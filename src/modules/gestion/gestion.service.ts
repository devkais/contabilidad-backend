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

  async findAll(): Promise<Gestion[]> {
    return await this.gestionRepository.find({ relations: ['empresa'] });
  }

  async findByEmpresa(id_empresa: number): Promise<Gestion[]> {
    return await this.gestionRepository.find({
      where: { id_empresa },
      order: { fecha_inicio: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Gestion> {
    const gestion = await this.gestionRepository.findOne({
      where: { id_gestion: id },
      relations: ['empresa'],
    });
    if (!gestion)
      throw new NotFoundException(`Gestión con ID ${id} no encontrada`);
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

    // 3. Opcional: Validar que no existan traslapes de fechas para la misma empresa
    // (Lógica de negocio adicional aquí si se requiere)

    const nuevaGestion = this.gestionRepository.create({
      ...dto,
      fecha_inicio: inicio,
      fecha_fin: fin,
    });
    return await this.gestionRepository.save(nuevaGestion);
  }

  async update(id: number, dto: UpdateGestionDto): Promise<Gestion> {
    const gestion = await this.findOne(id);
    this.gestionRepository.merge(gestion, dto);
    return await this.gestionRepository.save(gestion);
  }

  async remove(id: number): Promise<void> {
    const gestion = await this.findOne(id);
    // Aquí se debería validar si tiene asientos antes de borrar
    await this.gestionRepository.remove(gestion);
  }
}
