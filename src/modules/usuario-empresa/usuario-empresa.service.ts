import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEmpresa } from './usuario-empresa.entity';
import { CreateUsuarioEmpresaDto } from './dto/create-usuario-empresa.dto';
import { UpdateUsuarioEmpresaDto } from './dto/update-usuario-empresa.dto';

@Injectable()
export class UsuarioEmpresaService {
  constructor(
    @InjectRepository(UsuarioEmpresa)
    private readonly ueRepository: Repository<UsuarioEmpresa>,
  ) {}

  async findByUsuario(id_usuario: number): Promise<UsuarioEmpresa[]> {
    return await this.ueRepository.find({
      where: { id_usuario },
      relations: ['empresa'], // Trae los datos de la empresa vinculada
    });
  }

  async findPrincipal(id_usuario: number): Promise<UsuarioEmpresa> {
    const principal = await this.ueRepository.findOne({
      where: { id_usuario, es_principal: true },
      relations: ['empresa'],
    });

    if (!principal) {
      throw new NotFoundException(
        'El usuario no tiene una empresa principal asignada',
      );
    }
    return principal;
  }

  async create(dto: CreateUsuarioEmpresaDto): Promise<UsuarioEmpresa> {
    // Si la nueva es principal, quitamos la marca de principal a las anteriores del usuario
    if (dto.es_principal) {
      await this.ueRepository.update(
        { id_usuario: dto.id_usuario },
        { es_principal: false },
      );
    }

    const nuevaRelacion = this.ueRepository.create(dto);
    return await this.ueRepository.save(nuevaRelacion);
  }
  async update(
    id: number,
    updateDto: UpdateUsuarioEmpresaDto,
  ): Promise<UsuarioEmpresa> {
    // Si se está marcando como principal, quitamos la marca a las demás
    if (updateDto.es_principal) {
      const relacionActual = await this.ueRepository.findOne({
        where: { id_usuario_empresa: id },
      });
      if (relacionActual) {
        await this.ueRepository.update(
          { id_usuario: relacionActual.id_usuario },
          { es_principal: false },
        );
      }
    }

    const relacion = await this.ueRepository.preload({
      id_usuario_empresa: id,
      ...updateDto,
    });

    if (!relacion)
      throw new NotFoundException(`Relación con ID ${id} no encontrada`);
    return await this.ueRepository.save(relacion);
  }

  async remove(id: number): Promise<void> {
    const relacion = await this.ueRepository.findOne({
      where: { id_usuario_empresa: id },
    });
    if (!relacion)
      throw new NotFoundException(`Relación con ID ${id} no encontrada`);
    await this.ueRepository.remove(relacion);
  }
}
