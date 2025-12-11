import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEmpresa } from '../usuario-empresa.entity';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto } from '../dto';

@Injectable()
export class UsuarioEmpresaService {
  constructor(
    @InjectRepository(UsuarioEmpresa)
    private readonly usuarioEmpresaRepository: Repository<UsuarioEmpresa>,
  ) {}

  /**
   * Obtiene todas las relaciones usuario-empresa.
   */
  async findAll(): Promise<UsuarioEmpresa[]> {
    return this.usuarioEmpresaRepository.find();
  }

  /**
   * Busca una relación específica por su clave primaria compuesta.
   * @param id_usuario - ID del Usuario.
   * @param id_empresa - ID de la Empresa.
   */
  async findOne(
    id_usuario: number,
    id_empresa: number,
  ): Promise<UsuarioEmpresa | null> {
    return this.usuarioEmpresaRepository.findOne({
      where: { id_usuario, id_empresa },
    });
  }

  /**
   * Crea una nueva relación usuario-empresa.
   * @param createDto - Datos para crear la nueva relación.
   */
  async create(createDto: CreateUsuarioEmpresaDto): Promise<UsuarioEmpresa> {
    const nuevaRelacion = this.usuarioEmpresaRepository.create(createDto);
    return this.usuarioEmpresaRepository.save(nuevaRelacion);
  }
  async update(
    id_usuario: number,
    id_empresa: number,
    id_rol: number, // Se añade para consistencia, aunque no se use en el 'where' del 'findOne'
    updateDto: UpdateUsuarioEmpresaDto,
  ): Promise<UsuarioEmpresa | null> {
    const relacionExistente = await this.findOne(id_usuario, id_empresa);
    if (!relacionExistente) {
      return null; // El controlador se encargará de lanzar NotFoundException
    }

    // Fusiona los cambios en la entidad existente
    // Se transforma el DTO para que coincida con la estructura de la entidad
    const datosParaActualizar = {
      rol: { id_rol: updateDto.id_rol },
    };
    this.usuarioEmpresaRepository.merge(relacionExistente, datosParaActualizar);
    return this.usuarioEmpresaRepository.save(relacionExistente);
  }

  async remove(
    id_usuario: number,
    id_empresa: number,
    id_rol: number,
  ): Promise<boolean> {
    const result = await this.usuarioEmpresaRepository.delete({
      id_usuario,
      id_empresa,
      rol: { id_rol }, // Aseguramos que se borre solo si el rol coincide
    });
    // affected será 1 si se eliminó, 0 si no se encontró.
    return (result.affected ?? 0) > 0;
  }
}
