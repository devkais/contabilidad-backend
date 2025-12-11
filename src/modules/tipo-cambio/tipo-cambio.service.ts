import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCambio } from './tipo-cambio.entity';
import { Repository } from 'typeorm';
import { CreateTipoCambioDto, UpdateTipoCambioDto } from './dto';
import { MonedaService } from '../moneda/moneda.service';

@Injectable()
export class TipoCambioService {
  constructor(
    @InjectRepository(TipoCambio)
    private readonly tipocambioRepository: Repository<TipoCambio>,
    private readonly monedaService: MonedaService,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallTipoCambio(): Promise<TipoCambio[]> {
    return this.tipocambioRepository.find();
  }

  async getTipoCambioById(id_tipo_cambio: number): Promise<TipoCambio | null> {
    const tipocambio = await this.tipocambioRepository.findOne({
      where: { id_tipo_cambio },
    });
    return tipocambio;
  }
  async postTipoCambio(
    createTipoCambioDto: CreateTipoCambioDto,
  ): Promise<TipoCambio> {
    // Cambié el retorno a TipoCambio (entidad) por buenas prácticas

    // 1. Obtener la entidad Moneda completa usando el ID
    const monedaDestino = await this.monedaService.getMonedaById(
      createTipoCambioDto.id_moneda_destino,
    );

    if (!monedaDestino) {
      // En tu código tienes: throw new NotFoundException()...
      // Asegúrate de importar NotFoundException
      throw new NotFoundException(
        `Moneda con ID ${createTipoCambioDto.id_moneda_destino} no encontrada.`,
      );
    }

    // 2. Crear el objeto para guardar, incluyendo la entidad Moneda (monedaDestino)
    const tipoCambioToCreate = this.tipocambioRepository.create({
      // Mapear los campos del DTO
      fecha: createTipoCambioDto.fecha,
      valor_compra: createTipoCambioDto.valor_compra,
      valor_venta: createTipoCambioDto.valor_venta,
      // Asignar la entidad completa al nombre de la propiedad de relación:
      monedaDestino: monedaDestino,
      // ¡Ojo! No necesitas 'id_moneda_destino' aquí si 'monedaDestino' está asignada
      // y TypeORM manejará automáticamente la FK.
    });

    // 3. Guardar el nuevo registro
    const tipocambio = await this.tipocambioRepository.save(tipoCambioToCreate);
    return tipocambio;
  }

  // En tipo-cambio.service.ts, método putTipoCambio:

  async putTipoCambio(
    id_tipo_cambio: number,
    updateTipoCambioDto: UpdateTipoCambioDto,
  ): Promise<TipoCambio | null> {
    // 1. Objeto de actualización: Copiamos todos los campos del DTO
    const updateData = { ...updateTipoCambioDto };

    // 2. Si se incluye el ID de la moneda destino, TypeORM debe manejarlo,
    // pero debemos asegurarnos de no pasar la entidad 'monedaDestino' si solo
    // tenemos el ID.
    // Para el método update, generalmente es mejor pasar solo el ID de la FK.

    // Si tu DTO contiene id_moneda_destino, pasa eso directamente:

    const result = await this.tipocambioRepository.update(
      { id_tipo_cambio },
      updateData, // <--- Pasamos el DTO directamente (o una copia)
    );

    if (!result.affected) {
      return null;
    }

    return await this.getTipoCambioById(id_tipo_cambio);
  }
  async deleteTipoCambio(id_tipo_cambio: number): Promise<boolean> {
    const result = await this.tipocambioRepository.delete({ id_tipo_cambio });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
