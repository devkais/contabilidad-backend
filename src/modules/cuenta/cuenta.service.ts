// src/modules/cuentas/services/cuenta.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto, UpdateCuentaDto } from './dto';
// Importar servicios y entidades para las 3 FKs externas
import { EmpresaService } from '../empresa/services/empresa.service';
import { GestionService } from '../gestion/gestion.service';
import { MonedaService } from '../moneda/moneda.service';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    private readonly empresaService: EmpresaService,
    private readonly gestionService: GestionService,
    private readonly monedaService: MonedaService,
  ) {}

  async getallCuenta(): Promise<Cuenta[]> {
    // Usamos 'relations' para cargar las 3 entidades externas y la recursiva (cuentaPadre)
    return this.cuentaRepository.find({
      relations: [
        'empresa',
        'gestion',
        'moneda',
        'padre', // ✅ Nombre corregido para cargar la Cuenta Padre
        'hijas',
      ],
    });
  }

  // 2. Obtener una cuenta por su ID (GET BY ID)
  async getCuentaById(id_cuenta: number): Promise<Cuenta | null> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta },
      relations: [
        'empresa',
        'gestion',
        'moneda',
        'padre', // ✅ Nombre corregido para cargar la Cuenta Padre
        'hijas',
      ],
    });

    return cuenta;
  }

  // 3. Eliminar una cuenta por su ID (DELETE)
  async deleteCuenta(id_cuenta: number): Promise<boolean> {
    // 1. Buscamos la cuenta incluyendo la relación 'hijas'
    const cuentaExistente = await this.cuentaRepository.findOne({
      where: { id_cuenta },
      relations: ['hijas'],
    });

    if (!cuentaExistente) {
      throw new NotFoundException(`La cuenta con ID ${id_cuenta} no existe.`);
    }

    // 2. Verificación de seguridad: ¿Realmente tiene hijas?
    // Usamos ?.length para evitar errores si 'hijas' es undefined
    if (cuentaExistente.hijas && cuentaExistente.hijas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar: Esta cuenta es padre de otras subcuentas.',
      );
    }

    try {
      // 3. Eliminación física
      const result = await this.cuentaRepository.delete(id_cuenta);
      return (result.affected ?? 0) > 0;
    } catch (error: unknown) {
      // Este error salta si hay una llave foránea en la tabla 'asiento_detalle'
      throw new BadRequestException(
        'No se puede eliminar: La cuenta ya tiene movimientos contables registrados.',
      );
    }
  }
  // Obtener el Plan de Cuentas como un Árbol (funcionalidad avanzada)
  async getCuentasAsTree(id_empresa: number): Promise<Cuenta[]> {
    // Busca solo las cuentas de nivel 1 (que no tienen padre)
    return this.cuentaRepository.find({
      where: { id_empresa, nivel: 1 },
      // Carga la jerarquía recursivamente hasta el último nivel
      relations: ['hijas', 'hijas.hijas', 'hijas.hijas.hijas'],
      order: { codigo: 'ASC' },
    });
  }

  // ----------------------------------------------------
  // LÓGICA DE ESCRITURA (CRUD)
  // ----------------------------------------------------

  async postCuenta(createCuentaDto: CreateCuentaDto): Promise<Cuenta> {
    const { id_empresa, id_gestion, id_moneda, id_cuenta_padre, codigo } =
      createCuentaDto;

    // 1. VERIFICACIONES DE EXISTENCIA Y DUPLICIDAD
    const [empresa, gestion, moneda, cuentaPadre, cuentaExistente] =
      await Promise.all([
        this.empresaService.getEmpresaById(id_empresa),
        this.gestionService.getGestionById(id_gestion),
        this.monedaService.getMonedaById(id_moneda),
        id_cuenta_padre
          ? this.getCuentaById(id_cuenta_padre)
          : Promise.resolve(null),
        // Verificamos si ya existe una cuenta con ese código en la misma empresa
        this.cuentaRepository.findOne({ where: { codigo, id_empresa } }),
      ]);

    // Validar duplicidad de código
    if (cuentaExistente) {
      throw new BadRequestException(
        `El código de cuenta "${codigo}" ya está registrado en esta empresa.`,
      );
    }

    // Validar que las entidades obligatorias existen
    if (!empresa)
      throw new NotFoundException(
        `Empresa con ID ${id_empresa} no encontrada.`,
      );
    if (!gestion)
      throw new NotFoundException(
        `Gestión con ID ${id_gestion} no encontrada.`,
      );
    if (!moneda)
      throw new NotFoundException(`Moneda con ID ${id_moneda} no encontrada.`);

    if (id_cuenta_padre && !cuentaPadre) {
      throw new NotFoundException(
        `Cuenta Padre con ID ${id_cuenta_padre} no encontrada.`,
      );
    }
    if (cuentaPadre && !codigo.startsWith(cuentaPadre.codigo)) {
      throw new BadRequestException(
        `El código "${codigo}" debe comenzar con el código del padre "${cuentaPadre.codigo}"`,
      );
    }

    // 2. CREACIÓN
    const cuentaToCreate = this.cuentaRepository.create(createCuentaDto);
    return await this.cuentaRepository.save(cuentaToCreate);
  }
  async putCuenta(
    id_cuenta: number,
    updateCuentaDto: UpdateCuentaDto,
  ): Promise<Cuenta | null> {
    // 1. Verificar existencia de las 4 FKs si están en el DTO (Forma Sencilla)
    if (updateCuentaDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateCuentaDto.id_empresa,
      );
      if (!empresaExistente)
        throw new NotFoundException(
          `Empresa con ID ${updateCuentaDto.id_empresa} no encontrada.`,
        );
    }

    if (updateCuentaDto.id_gestion) {
      const gestionExistente = await this.gestionService.getGestionById(
        updateCuentaDto.id_gestion,
      );
      if (!gestionExistente)
        throw new NotFoundException(
          `Gestión con ID ${updateCuentaDto.id_gestion} no encontrada.`,
        );
    }

    if (updateCuentaDto.id_moneda) {
      const monedaExistente = await this.monedaService.getMonedaById(
        updateCuentaDto.id_moneda,
      );
      if (!monedaExistente)
        throw new NotFoundException(
          `Moneda con ID ${updateCuentaDto.id_moneda} no encontrada.`,
        );
    }

    if (updateCuentaDto.id_cuenta_padre) {
      const cuentaPadreExistente = await this.getCuentaById(
        updateCuentaDto.id_cuenta_padre,
      );
      if (!cuentaPadreExistente)
        throw new NotFoundException(
          `Cuenta Padre con ID ${updateCuentaDto.id_cuenta_padre} no encontrada.`,
        );
    }

    // 2. Ejecutar la actualización con el DTO (forma sencilla)
    const result = await this.cuentaRepository.update(
      { id_cuenta },
      updateCuentaDto,
    );

    if (!result.affected) return null;

    return await this.getCuentaById(id_cuenta);
  }

  // Lógica de Negocio ESENCIAL para Contabilidad
  async validarCuentaDeMovimiento(id_cuenta: number): Promise<void> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta },
      select: ['es_movimiento'],
    });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id_cuenta} no encontrada.`);
    }
    if (!cuenta.es_movimiento) {
      throw new BadRequestException(
        `La cuenta ${id_cuenta} no es de movimiento y no puede registrar transacciones.`,
      );
    }
  }
}
