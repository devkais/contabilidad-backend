import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moneda } from './moneda.entity';
import { CreateMonedaDto, UpdateMonedaDto } from './dto';

@Injectable()
export class MonedaService {
  constructor(
    @InjectRepository(Moneda)
    private readonly monedaRepository: Repository<Moneda>,
  ) {}

  async findAll(): Promise<Moneda[]> {
    return await this.monedaRepository.find();
  }

  async findOne(id: number): Promise<Moneda> {
    const moneda = await this.monedaRepository.findOne({
      where: { id_moneda: id },
    });
    if (!moneda)
      throw new NotFoundException(`Moneda con ID ${id} no encontrada`);
    return moneda;
  }

  async create(createMonedaDto: CreateMonedaDto): Promise<Moneda> {
    const existeCodigo = await this.monedaRepository.findOne({
      where: { codigo: createMonedaDto.codigo },
    });
    if (existeCodigo)
      throw new ConflictException(
        `El código de moneda ${createMonedaDto.codigo} ya existe`,
      );

    const nuevaMoneda = this.monedaRepository.create(createMonedaDto);
    return await this.monedaRepository.save(nuevaMoneda);
  }

  async update(id: number, updateMonedaDto: UpdateMonedaDto): Promise<Moneda> {
    const moneda = await this.findOne(id);
    this.monedaRepository.merge(moneda, updateMonedaDto);
    return await this.monedaRepository.save(moneda);
  }

  async remove(id: number): Promise<void> {
    const moneda = await this.findOne(id);
    // Nota: Aquí se podría validar si hay cuentas o tipos de cambio asociados antes de borrar
    await this.monedaRepository.remove(moneda);
  }
}
