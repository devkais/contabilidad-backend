import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UsuarioEmpresaGestion } from './usuario-empresa-gestion.entity';
import { CreateUsuarioEmpresaGestionDto } from './dto/usuario-empresa-gestion.dto';

@Injectable()
export class UsuarioEmpresaGestionService {
  constructor(
    @InjectRepository(UsuarioEmpresaGestion)
    private readonly uegRepository: Repository<UsuarioEmpresaGestion>,
    private readonly dataSource: DataSource, // Para transacciones seguras
  ) {}

  /**
   * Asigna un acceso. Si es el primero para el usuario, lo marca como principal.
   */
  async create(
    dto: CreateUsuarioEmpresaGestionDto,
  ): Promise<UsuarioEmpresaGestion> {
    const { id_usuario, id_empresa, id_gestion } = dto;

    // 1. Verificar si ya existe esa asignación exacta
    const existe = await this.uegRepository.findOne({
      where: { id_usuario, id_empresa, id_gestion },
    });
    if (existe)
      throw new ConflictException(
        'Este usuario ya tiene acceso a esta empresa y gestión.',
      );

    // 2. Verificar si el usuario ya tiene algún acceso marcado como principal
    const tienePrincipal = await this.uegRepository.findOne({
      where: { id_usuario, esPrincipal: true },
    });

    // 3. Crear el nuevo registro
    const nuevoAcceso = this.uegRepository.create({
      ...dto,
      // Si no tiene ningún principal, este DEBE ser el principal por defecto
      esPrincipal: tienePrincipal ? (dto.es_principal ?? false) : true,
    });

    return await this.uegRepository.save(nuevoAcceso);
  }

  /**
   * Cambia el contexto principal del usuario (usando Transacción)
   */
  async changePrincipal(
    idUsuario: number,
    idEmpresa: number,
    idGestion: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Quitar principal a todos los registros del usuario
      await queryRunner.manager.update(
        UsuarioEmpresaGestion,
        { id_usuario: idUsuario },
        { esPrincipal: false },
      );

      // Asignar el nuevo principal
      await queryRunner.manager.update(
        UsuarioEmpresaGestion,
        { id_usuario: idUsuario, id_empresa: idEmpresa, id_gestion: idGestion },
        { esPrincipal: true },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Busca el contexto principal (Empresa y Gestión) para el login.
   * Prioriza el registro marcado como 'esPrincipal'.
   */
  async findPrincipalContext(
    idUsuario: number,
  ): Promise<UsuarioEmpresaGestion> {
    const contexto = await this.uegRepository.findOne({
      where: [
        { id_usuario: idUsuario, esPrincipal: true },
        { id_usuario: idUsuario }, // Fallback al primero que encuentre si ninguno es principal
      ],
      relations: ['empresa', 'gestion'],
      order: { esPrincipal: 'DESC' },
    });

    if (!contexto) {
      throw new NotFoundException(
        `El usuario con ID ${idUsuario} no tiene asignada ninguna Empresa o Gestión.`,
      );
    }

    return contexto;
  }

  /**
   * Lista todos los accesos de un usuario (útil para el selector de empresas en el Front).
   */
  async findAllByUser(idUsuario: number): Promise<UsuarioEmpresaGestion[]> {
    return await this.uegRepository.find({
      where: { id_usuario: idUsuario },
      relations: ['empresa', 'gestion'],
    });
  }

  /**
   * Asigna un nuevo acceso.
   */

  /**
   * Verifica si un usuario tiene permiso específico a una empresa/gestión.
   * Se usará en el Guard de seguridad.
   */
  async validateAccess(
    idUsuario: number,
    idEmpresa: number,
    idGestion: number,
  ): Promise<boolean> {
    const acceso = await this.uegRepository.findOne({
      where: {
        id_usuario: idUsuario,
        id_empresa: idEmpresa,
        id_gestion: idGestion,
      },
    });
    return !!acceso;
  }
}
