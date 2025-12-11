import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moneda } from './moneda.entity';
import { Repository } from 'typeorm';
import { CreateMonedaDto, MonedaDto, UpdateMonedaDto } from './dto';

@Injectable()
export class MonedaService {
  constructor(
    @InjectRepository(Moneda)
    private readonly monedaRepository: Repository<Moneda>,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallMoneda(): Promise<Moneda[]> {
    return this.monedaRepository.find();
  }

  async getMonedaById(id_moneda: number): Promise<Moneda | null> {
    const moneda = await this.monedaRepository.findOne({
      where: { id_moneda },
    });
    return moneda;
  }
  async postMoneda(createMonedaDto: CreateMonedaDto): Promise<MonedaDto> {
    const newMoneda = this.monedaRepository.create(createMonedaDto);
    const moneda = this.monedaRepository.save(newMoneda);
    return moneda;
  }
  async putMoneda(
    id_moneda: number,
    updateMonedaDto: UpdateMonedaDto,
  ): Promise<MonedaDto | null> {
    const moneda = this.monedaRepository.create(updateMonedaDto);
    const result = await this.monedaRepository.update({ id_moneda }, moneda);
    if (!result.affected) {
      return null;
    }
    return await this.getMonedaById(id_moneda);
  }
  async deleteMoneda(id_moneda: number): Promise<boolean> {
    const result = await this.monedaRepository.delete({ id_moneda });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
