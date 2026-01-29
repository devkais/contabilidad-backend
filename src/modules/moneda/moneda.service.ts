import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moneda } from './moneda.entity';
import { CreateMonedaDto, UpdateMonedaDto } from './dto/moneda.dto';

@Injectable()
export class MonedaService {
  constructor(
    @InjectRepository(Moneda)
    private readonly monedaRepository: Repository<Moneda>,
  ) {}

  async create(createMonedaDto: CreateMonedaDto): Promise<Moneda> {
    const { codigo } = createMonedaDto;

    const existe = await this.monedaRepository.findOne({ where: { codigo } });
    if (existe) {
      throw new BadRequestException(`La moneda con código ${codigo} ya existe`);
    }

    const nuevaMoneda = this.monedaRepository.create(createMonedaDto);
    return await this.monedaRepository.save(nuevaMoneda);
  }

  async findAll(): Promise<Moneda[]> {
    return await this.monedaRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Moneda> {
    const moneda = await this.monedaRepository.findOne({
      where: { id_moneda: id },
    });
    if (!moneda) {
      throw new NotFoundException('Moneda no encontrada');
    }
    return moneda;
  }

  async update(id: number, updateMonedaDto: UpdateMonedaDto): Promise<Moneda> {
    const moneda = await this.findOne(id);
    const monedaActualizada = Object.assign(moneda, updateMonedaDto);
    return await this.monedaRepository.save(monedaActualizada);
  }
}
