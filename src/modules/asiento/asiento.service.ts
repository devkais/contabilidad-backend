import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asiento } from './asiento.entity';
import { CreateAsientoDto, UpdateAsientoDto } from './dto';
import { GestionService } from '../gestion/gestion.service';

@Injectable()
export class AsientoService {
  constructor(
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,
    private readonly gestionService: GestionService,
  ) {}

  async getallAsiento(): Promise<Asiento[]> {
    return await this.asientoRepository.find({
      relations: ['gestion'],
      order: { fecha: 'DESC' },
    });
  }

  async getAsientoById(id: number): Promise<Asiento> {
    const asiento = await this.asientoRepository.findOne({
      where: { id_asiento: id },
      relations: ['gestion', 'detalles'],
    });
    if (!asiento)
      throw new NotFoundException(`Asiento con ID ${id} no encontrado`);
    return asiento;
  }

  async postAsiento(
    dto: CreateAsientoDto,
    id_usuario: number,
  ): Promise<Asiento> {
    const gestion = await this.gestionService.findOne(dto.id_gestion);

    if (gestion.estado !== 'abierto') {
      throw new BadRequestException('La gestión está cerrada.');
    }

    const fechaAsiento = new Date(dto.fecha);

    const nuevoAsiento = this.asientoRepository.create({
      fecha: fechaAsiento,
      numero_comprobante: dto.numero_comprobante,
      glosa_general: dto.glosa_general,
      tipo_asiento: dto.tipo_asiento,
      id_gestion: dto.id_gestion,
      created_by: id_usuario,
      tc_oficial_asiento: dto.tc_oficial_asiento,
      sistema_origen: dto.sistema_origen || 'MANUAL',
      external_id: dto.external_id,
    });

    return await this.asientoRepository.save(nuevoAsiento);
  }

  async putAsiento(id: number, dto: UpdateAsientoDto): Promise<Asiento> {
    const asiento = await this.getAsientoById(id);
    this.asientoRepository.merge(asiento, dto);
    return await this.asientoRepository.save(asiento);
  }

  async deleteAsiento(id: number): Promise<void> {
    const asiento = await this.getAsientoById(id);
    // Nota: TypeORM lanzará error si hay hijos en detalle_asiento por la integridad referencial
    await this.asientoRepository.remove(asiento);
  }
}
