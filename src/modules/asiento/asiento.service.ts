import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Asiento } from './asiento.entity';

import { CreateAsientoDto } from './dto';

import { GestionService } from '../gestion/gestion.service';

@Injectable()
export class AsientoService {
  constructor(
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,

    private readonly gestionService: GestionService,
  ) {}

  // Filtrado por Empresa y Gestión (Contexto de Login)

  async getallAsiento(
    id_empresa: number,

    id_gestion: number,
  ): Promise<Asiento[]> {
    return await this.asientoRepository.find({
      where: { id_empresa, id_gestion }, // <--- Solo los de esta empresa y gestión

      relations: ['gestion'],

      order: { fecha: 'DESC' },
    });
  }

  // Obtener por ID validando que sea de la empresa del usuario

  async getAsientoById(id: number, id_empresa: number): Promise<Asiento> {
    const asiento = await this.asientoRepository.findOne({
      where: { id_asiento: id, id_empresa }, // <--- Candado de seguridad

      relations: ['gestion', 'detalles'],
    });

    if (!asiento)
      throw new NotFoundException(
        `Asiento con ID ${id} no encontrado en esta empresa`,
      );

    return asiento;
  }

  async postAsiento(
    dto: CreateAsientoDto,

    id_usuario: number,
  ): Promise<Asiento> {
    // 1. Validar que la gestión exista Y pertenezca a la empresa del DTO

    const gestion = await this.gestionService.findOne(
      dto.id_gestion,

      dto.id_empresa,
    );

    // 2. Mantener tu lógica de gestión cerrada

    if (gestion.estado !== 'abierto') {
      throw new BadRequestException('La gestión está cerrada.');
    }

    const fechaAsiento = new Date(dto.fecha);

    const nuevoAsiento = this.asientoRepository.create({
      id_empresa: dto.id_empresa, // <--- Obligatorio por el nuevo SQL

      id_gestion: dto.id_gestion,

      fecha: fechaAsiento,

      numero_comprobante: dto.numero_comprobante,

      glosa_general: dto.glosa_general,

      tipo_asiento: dto.tipo_asiento,

      created_by: id_usuario,

      tc_oficial_asiento: dto.tc_oficial_asiento,

      sistema_origen: dto.sistema_origen || 'MANUAL',

      external_id: dto.external_id,
    });

    return await this.asientoRepository.save(nuevoAsiento);
  }

  async putAsiento(
    id: number,

    dto: CreateAsientoDto,

    id_empresa: number,
  ): Promise<Asiento> {
    const asiento = await this.getAsientoById(id, id_empresa);

    this.asientoRepository.merge(asiento, dto);

    return await this.asientoRepository.save(asiento);
  }

  async deleteAsiento(id: number, id_empresa: number): Promise<void> {
    const asiento = await this.getAsientoById(id, id_empresa);

    // Nota: El SQL tiene ON DELETE CASCADE o restricción según definimos

    await this.asientoRepository.remove(asiento);
  }
}
