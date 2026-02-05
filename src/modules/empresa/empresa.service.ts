import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import { UsuarioEmpresaGestion } from '../usuario-empresa-gestion/usuario-empresa-gestion.entity';
import { Gestion } from '../gestion/gestion.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(UsuarioEmpresaGestion)
    private readonly uegRepository: Repository<UsuarioEmpresaGestion>,
    @InjectRepository(Gestion)
    private readonly gestionRepository: Repository<Gestion>,
  ) {}

  async create(
    createEmpresaDto: CreateEmpresaDto,
    idUsuario: number,
  ): Promise<Empresa> {
    const existe = await this.empresaRepository.findOne({
      where: { nit: createEmpresaDto.nit },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe una empresa registrada con ese NIT',
      );
    }

    const nuevaEmpresa = this.empresaRepository.create(createEmpresaDto);
    const empresaGuardada = await this.empresaRepository.save(nuevaEmpresa);

    // Crear gestión por defecto
    const gestionPorDefecto = this.gestionRepository.create({
      id_empresa: empresaGuardada.id_empresa,
      nombre: 'Gestión 2024',
      fecha_inicio: new Date('2024-01-01'),
      fecha_fin: new Date('2024-12-31'),
      estado: 'abierto',
    });
    const gestionGuardada =
      await this.gestionRepository.save(gestionPorDefecto);

    // Asignar acceso al usuario creador
    const accesoUsuario = this.uegRepository.create({
      id_usuario: idUsuario,
      id_empresa: empresaGuardada.id_empresa,
      id_gestion: gestionGuardada.id_gestion,
      esPrincipal: true,
    });
    await this.uegRepository.save(accesoUsuario);

    return empresaGuardada;
  }

  /**
   * Lista solo las empresas a las que el usuario tiene acceso.
   */
  async findAllByUser(idUsuario: number): Promise<Empresa[]> {
    const relaciones = await this.uegRepository.find({
      where: { id_usuario: idUsuario },
      relations: ['empresa'],
    });

    return relaciones.map((r) => r.empresa);
  }

  async findOne(id: number, idUsuario: number): Promise<Empresa> {
    // Validamos acceso antes de retornar
    const tieneAcceso = await this.uegRepository.findOne({
      where: { id_usuario: idUsuario, id_empresa: id },
    });

    if (!tieneAcceso) {
      throw new NotFoundException('Empresa no encontrada o sin acceso');
    }

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresa) throw new NotFoundException('Empresa no existe');

    return empresa;
  }

  async update(
    id: number,
    updateEmpresaDto: UpdateEmpresaDto,
    idUsuario: number,
  ): Promise<Empresa> {
    // Validamos acceso antes de actualizar
    const tieneAcceso = await this.uegRepository.findOne({
      where: { id_usuario: idUsuario, id_empresa: id },
    });

    if (!tieneAcceso) {
      throw new NotFoundException('Empresa no encontrada o sin acceso');
    }

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresa) throw new NotFoundException('Empresa no existe');

    // Verificar si el NIT ya existe en otra empresa
    const nit = updateEmpresaDto.nit;
    if (nit) {
      const existeOtro = await this.empresaRepository.findOne({
        where: { nit },
      });
      if (existeOtro && existeOtro.id_empresa !== id) {
        throw new BadRequestException(
          'Ya existe una empresa registrada con ese NIT',
        );
      }
    }

    await this.empresaRepository.update(id, updateEmpresaDto);
    const empresaActualizada = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresaActualizada) throw new NotFoundException('Empresa no existe');
    return empresaActualizada;
  }
  async delete(id: number, idUsuario: number): Promise<void> {
    // Validamos acceso antes de eliminar
    const tieneAcceso = await this.uegRepository.findOne({
      where: { id_usuario: idUsuario, id_empresa: id },
    });

    if (!tieneAcceso) {
      throw new NotFoundException('Empresa no encontrada o sin acceso');
    }

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresa) throw new NotFoundException('Empresa no existe');

    // Verificar si tiene gestiones activas o cuentas
    const gestiones = await this.gestionRepository.find({
      where: { id_empresa: id },
    });
    if (gestiones.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar la empresa porque tiene gestiones asociadas',
      );
    }

    // Eliminar relaciones primero
    await this.uegRepository.delete({ id_empresa: id });

    // Eliminar empresa
    await this.empresaRepository.delete(id);
  }
}
