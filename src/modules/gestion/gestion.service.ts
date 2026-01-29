import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gestion } from './gestion.entity';
import { CreateGestionDto } from './dto/gestion.dto';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(Gestion)
    private readonly gestionRepository: Repository<Gestion>,
  ) {}

  async create(createGestionDto: CreateGestionDto): Promise<Gestion> {
    // 1. Validar que la fecha fin no sea menor a la de inicio
    if (
      new Date(createGestionDto.fecha_fin) <=
      new Date(createGestionDto.fecha_inicio)
    ) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la de inicio',
      );
    }

    // 2. Opcional: Validar que no haya solapamiento de fechas en la misma empresa
    // (Lógica de negocio contable importante)

    const nuevaGestion = this.gestionRepository.create(createGestionDto);
    return await this.gestionRepository.save(nuevaGestion);
  }

  async findAllByEmpresa(idEmpresa: number): Promise<Gestion[]> {
    return await this.gestionRepository.find({
      where: { id_empresa: idEmpresa },
      order: { fecha_inicio: 'DESC' },
    });
  }

  async findOne(id: number, idEmpresa: number): Promise<Gestion> {
    const gestion = await this.gestionRepository.findOne({
      where: { id_gestion: id, id_empresa: idEmpresa },
    });

    if (!gestion) {
      throw new NotFoundException('Gestión no encontrada en esta empresa');
    }
    return gestion;
  }

  /**
   * Verifica si una gestión está abierta para permitir transacciones.
   */
  async isGestionAbierta(id: number): Promise<boolean> {
    const gestion = await this.gestionRepository.findOne({
      where: { id_gestion: id },
    });
    return gestion?.estado === 'abierto';
  }
}
