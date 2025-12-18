import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
  catch(error: unknown) {
    const dbError = error as { code?: string; message?: string };
    if (dbError.code === 'ER_DUP_ENTRY' || dbError.code === '23505') {
      throw new ConflictException('Ya existe una moneda con ese código');
    }
    throw new Error(
      'Error al crear la moneda: ' + (dbError.message || 'Error desconocido'),
    );
  }

  async putMoneda(
    id_moneda: number,
    updateMonedaDto: UpdateMonedaDto,
  ): Promise<MonedaDto | null> {
    try {
      // Primero verificamos si la moneda existe
      const monedaExistente = await this.monedaRepository.findOne({
        where: { id_moneda },
      });
      if (!monedaExistente) {
        throw new NotFoundException('Moneda no encontradda');
      }

      //Actulizamos los campos
      Object.assign(monedaExistente, updateMonedaDto);

      //Guardamos los cambios
      const monedaActualizada =
        await this.monedaRepository.save(monedaExistente);
      return monedaActualizada;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      //Manejo especifico del error de código único
      const dbError = error as { code?: string; message?: string };
      if (dbError.code === 'ER_DUP_ENTRY' || dbError.code === '23505') {
        throw new ConflictException('Ya existe una moneda con ese código');
      }
      throw new Error(
        'Error al actualizar la moneda: ' +
          (dbError.message || 'Error desconocido'),
      );
    }
  }

  async deleteMoneda(id_moneda: number): Promise<boolean> {
    const result = await this.monedaRepository.delete({ id_moneda });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
