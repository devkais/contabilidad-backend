import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';
import { Repository } from 'typeorm';
import { CreateDetalleAsientoDto, UpdateDetalleAsientoDto } from './dto';

// Servicios de las llaves foránea  s
import { AsientoService } from '../asiento/asiento.service';
import { CuentaService } from '../cuenta/cuenta.service';
import { CuentaAuxiliarService } from '../cuenta-auxiliar/cuenta-auxiliar.service';
import { CentroCostoService } from '../centro-costo/centro-costo.service';
// ...

@Injectable()
export class DetalleAsientoService {
  constructor(
    @InjectRepository(DetalleAsiento)
    private readonly detalleAsientoRepository: Repository<DetalleAsiento>,
    private readonly asientoService: AsientoService,
    private readonly cuentaService: CuentaService,
    private readonly cuentaAuxiliarService: CuentaAuxiliarService,
    private readonly centroCostoService: CentroCostoService,
  ) {} // 💡 Necesitas este método para la recursividad:

  // En detalle-asiento.service.ts

  // ... (constructor, postDetalleAsiento, putDetalleAsiento omitidos por brevedad) ...

  // 1. Obtener todos los detalles de asientos (GET ALL)
  async getallDetalleAsiento(): Promise<DetalleAsiento[]> {
    return this.detalleAsientoRepository.find({
      // ⬇️ Array de relaciones definido directamente
      relations: ['asiento', 'cuenta', 'cuentaAuxiliar', 'centroCosto'],
      order: { id_detalle: 'ASC' },
    });
  }

  // 2. Obtener un detalle de asiento por su ID (GET BY ID)
  async getDetalleAsientoById(
    id_detalle: number,
  ): Promise<DetalleAsiento | null> {
    const detalle = await this.detalleAsientoRepository.findOne({
      where: { id_detalle },
      // ⬇️ Array de relaciones definido directamente
      relations: ['asiento', 'cuenta', 'cuentaAuxiliar', 'centroCosto'],
    });

    return detalle;
  }

  // 3. Eliminar un detalle de asiento por su ID (DELETE)
  async deleteDetalleAsiento(id_detalle: number): Promise<boolean> {
    const result = await this.detalleAsientoRepository.delete({ id_detalle });

    // Verificamos si se afectó al menos una fila
    return (result.affected ?? 0) > 0;
  }

  // 💡 Bonus: Método crucial para obtener todas las líneas de detalle de un asiento específico.
  async getDetallesByAsientoId(id_detalle: number): Promise<DetalleAsiento[]> {
    return this.detalleAsientoRepository.find({
      where: { id_detalle }, // Busca por el ID plano de la FK
      relations: ['asiento', 'cuenta', 'cuentaAuxiliar', 'centroCosto'],
      order: { id_detalle: 'ASC' },
    });
  }

  async postDetalleAsiento(
    createDto: CreateDetalleAsientoDto,
  ): Promise<DetalleAsiento> {
    const { id_asiento, id_cuenta, id_cuenta_auxiliar, id_centro_costo } =
      createDto;

    // 1. VERIFICACIÓN DE EXISTENCIA DE LLAVES FORÁNEAS
    // Promise.all permite que las búsquedas se ejecuten en paralelo.
    const [asiento, cuenta, cuentaAuxiliar, centroCosto] = await Promise.all([
      this.asientoService.getAsientoById(id_asiento),
      this.cuentaService.getCuentaById(id_cuenta),
      id_cuenta_auxiliar
        ? this.cuentaAuxiliarService.getCuentaAuxiliarById(id_cuenta_auxiliar)
        : Promise.resolve(null),
      id_centro_costo
        ? this.centroCostoService.getCentroCostoById(id_centro_costo)
        : Promise.resolve(null),
    ]);

    // 2. Validar que las entidades obligatorias existen
    if (!asiento)
      throw new NotFoundException(
        `Asiento con ID ${id_asiento} no encontrado.`,
      );
    if (!cuenta)
      throw new NotFoundException(`Cuenta con ID ${id_cuenta} no encontrada.`);

    // Validar opcionales si se proporcionó un ID y no se encontró
    if (id_cuenta_auxiliar && !cuentaAuxiliar) {
      throw new NotFoundException(
        `Cuenta Auxiliar con ID ${id_cuenta_auxiliar} no encontrada.`,
      );
    }
    if (id_centro_costo && !centroCosto) {
      throw new NotFoundException(
        `Centro de Costo con ID ${id_centro_costo} no encontrado.`,
      );
    }

    // 3. CREACIÓN (FORMA SENCILLA)
    const detalleToCreate = this.detalleAsientoRepository.create(createDto);

    return this.detalleAsientoRepository.save(detalleToCreate);
  }
  // En detalle-asiento.service.ts, método putDetalleAsiento:

  async putDetalleAsiento(
    id_detalle: number,
    updateDto: UpdateDetalleAsientoDto,
  ): Promise<DetalleAsiento | null> {
    // 1. Verificar existencia de las FKs si están en el DTO
    if (updateDto.id_asiento) {
      const asientoExistente = await this.asientoService.getAsientoById(
        updateDto.id_asiento,
      );
      if (!asientoExistente)
        throw new NotFoundException(
          `Asiento con ID ${updateDto.id_asiento} no encontrado.`,
        );
    }

    if (updateDto.id_cuenta) {
      const cuentaExistente = await this.cuentaService.getCuentaById(
        updateDto.id_cuenta,
      );
      if (!cuentaExistente)
        throw new NotFoundException(
          `Cuenta con ID ${updateDto.id_cuenta} no encontrada.`,
        );
    }

    if (updateDto.id_cuenta_auxiliar) {
      const auxExistente =
        await this.cuentaAuxiliarService.getCuentaAuxiliarById(
          updateDto.id_cuenta_auxiliar,
        );
      if (!auxExistente)
        throw new NotFoundException(
          `Cuenta Auxiliar con ID ${updateDto.id_cuenta_auxiliar} no encontrada.`,
        );
    }

    if (updateDto.id_centro_costo) {
      const ccExistente = await this.centroCostoService.getCentroCostoById(
        updateDto.id_centro_costo,
      );
      if (!ccExistente)
        throw new NotFoundException(
          `Centro de Costo con ID ${updateDto.id_centro_costo} no encontrado.`,
        );
    }

    // 2. Ejecutar la actualización con el DTO (Forma Sencilla)
    const result = await this.detalleAsientoRepository.update(
      { id_detalle },
      updateDto,
    );

    if (!result.affected) return null;

    // 3. Devolver el objeto actualizado
    return await this.getDetalleAsientoById(id_detalle);
  }
}
