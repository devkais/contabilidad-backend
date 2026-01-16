import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gestion } from './gestion.entity';
import { CreateGestionDto, UpdateGestionDto } from './dto';
import { EmpresaService } from '../empresa/services/empresa.service';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(Gestion)
    private readonly gestionRepository: Repository<Gestion>,
    private readonly empresaService: EmpresaService,
  ) {}

  // Ahora findAll podría requerir id_empresa para no mostrar gestiones de otros
  async findAll(id_empresa?: number): Promise<Gestion[]> {
    return await this.gestionRepository.find({
      where: id_empresa ? { id_empresa } : {},
      relations: ['empresa'],
    });
  }

  async findByEmpresa(id_empresa: number): Promise<Gestion[]> {
    return await this.gestionRepository.find({
      where: { id_empresa },
      order: { fecha_inicio: 'DESC' },
    });
  }

  // ACTUALIZADO: Ahora recibe id_empresa para validar el contexto
  async findOne(id: number, id_empresa: number): Promise<Gestion> {
    const gestion = await this.gestionRepository.findOne({
      where: {
        id_gestion: id,
        id_empresa: id_empresa, // <--- Validamos que la gestión sea de la empresa
      },
      relations: ['empresa'],
    });

    if (!gestion)
      throw new NotFoundException(
        `Gestión con ID ${id} no encontrada en esta empresa`,
      );

    return gestion;
  }

  async create(dto: CreateGestionDto): Promise<Gestion> {
    // 1. Validar que la empresa existe
    await this.empresaService.findOne(dto.id_empresa);

    // 2. Validar que fecha_inicio < fecha_fin
    const inicio = new Date(dto.fecha_inicio);
    const fin = new Date(dto.fecha_fin);
    if (inicio >= fin) {
      throw new BadRequestException(
        'La fecha de inicio debe ser menor a la fecha de fin',
      );
    }

    const nuevaGestion = this.gestionRepository.create({
      ...dto,
      fecha_inicio: inicio,
      fecha_fin: fin,
    });
    return await this.gestionRepository.save(nuevaGestion);
  }

  async update(
    id: number,
    dto: UpdateGestionDto,
    id_empresa: number,
  ): Promise<Gestion> {
    const gestion = await this.findOne(id, id_empresa);
    this.gestionRepository.merge(gestion, dto);
    return await this.gestionRepository.save(gestion);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const gestion = await this.findOne(id, id_empresa);
    // Validar si tiene asientos antes de borrar (opcional)
    await this.gestionRepository.remove(gestion);
  }
}
