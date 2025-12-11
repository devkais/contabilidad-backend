import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bitacora } from './bitacora.entity';
import { Repository } from 'typeorm';
import { CreateBitacoraDto, UpdateBitacoraDto } from './dto';
import { UsuarioService } from '../usuario/services/usuario.service';
import { EmpresaService } from '../empresa/services/empresa.service';

@Injectable()
export class BitacoraService {
  constructor(
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
    private readonly usuarioService: UsuarioService,
    private readonly empresaService: EmpresaService,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallBitacora(): Promise<Bitacora[]> {
    return this.bitacoraRepository.find();
  }

  async getBitacoraById(id_bitacora: number): Promise<Bitacora | null> {
    const bitacora = await this.bitacoraRepository.findOne({
      where: { id_bitacora },
    });
    return bitacora;
  }
  async postBitacora(createBitacoraDto: CreateBitacoraDto): Promise<Bitacora> {
    // Cambiamos el retorno a la entidad

    // Desestructurar los IDs y el resto de los datos
    const { id_usuario, id_empresa, ...rest } = createBitacoraDto;

    // 1. Buscar ambas entidades de manera concurrente (más rápido)
    const [usuario, empresa] = await Promise.all([
      this.usuarioService.getUsuarioById(id_usuario),
      this.empresaService.getEmpresaById(id_empresa),
    ]);

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con ID ${id_usuario} no encontrado.`,
      );
    }
    if (!empresa) {
      throw new NotFoundException(
        `Empresa con ID ${id_empresa} no encontrada.`,
      );
    }

    // 2. Crear el objeto de Bitacora, asignando ambas entidades
    const bitacoraToCreate = this.bitacoraRepository.create({
      ...rest, // Incluye acción, tabla_afectada, ip_maquina, etc.
      usuario: usuario, // Asignar la entidad Usuario
      empresa: empresa, // Asignar la entidad Empresa
    });

    // 3. Guardar el nuevo registro
    const bitacora = await this.bitacoraRepository.save(bitacoraToCreate);
    return bitacora;
  }
  async putBitacora(
    id_bitacora: number,
    updateBitacoraDto: UpdateBitacoraDto,
  ): Promise<Bitacora | null> {
    // Cambiamos el retorno a la entidad

    // 1. Opcional: Verificar que las FK existen si están presentes en el DTO
    if (updateBitacoraDto.id_usuario) {
      const usuarioExistente = await this.usuarioService.getUsuarioById(
        updateBitacoraDto.id_usuario,
      );
      if (!usuarioExistente) {
        throw new NotFoundException(
          `Usuario con ID ${updateBitacoraDto.id_usuario} no encontrado.`,
        );
      }
    }
    if (updateBitacoraDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateBitacoraDto.id_empresa,
      );
      if (!empresaExistente) {
        throw new NotFoundException(
          `Empresa con ID ${updateBitacoraDto.id_empresa} no encontrada.`,
        );
      }
    }

    // 2. Ejecutar la actualización con el DTO (estrategia simple)
    const result = await this.bitacoraRepository.update(
      { id_bitacora },
      updateBitacoraDto, // Pasamos el DTO de datos planos
    );

    if (!result.affected) {
      return null;
    }

    return await this.getBitacoraById(id_bitacora);
  }
  async deleteBitacora(id_bitacora: number): Promise<boolean> {
    const result = await this.bitacoraRepository.delete({ id_bitacora });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
