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
    // El método .delete() puede ser peligroso si la cuenta está referenciada
    // en detalle_asiento. La base de datos lanzará un error 500 si no se maneja
    // la restricción FOREIGN KEY (ON DELETE RESTRICT o CASCADE).

    const result = await this.cuentaRepository.delete({ id_cuenta });

    // Verificamos si se afectó al menos una fila
    return (result.affected ?? 0) > 0;
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
    const { id_empresa, id_gestion, id_moneda, id_cuenta_padre } =
      createCuentaDto;

    // 1. VERIFICACIÓN DE EXISTENCIA DE LLAVES FORÁNEAS (Importante para evitar Error 500)
    // Buscamos las entidades para validar, pero NO las adjuntamos.
    const [empresa, gestion, moneda, cuentaPadre] = await Promise.all([
      this.empresaService.getEmpresaById(id_empresa),
      this.gestionService.getGestionById(id_gestion),
      this.monedaService.getMonedaById(id_moneda),
      id_cuenta_padre
        ? this.getCuentaById(id_cuenta_padre)
        : Promise.resolve(null),
    ]);

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

    // Validar la cuenta padre si se proporcionó un ID y no se encontró
    if (id_cuenta_padre && !cuentaPadre) {
      throw new NotFoundException(
        `Cuenta Padre con ID ${id_cuenta_padre} no encontrada.`,
      );
    }

    // 2. CREACIÓN (FORMA SENCILLA)
    // Pasamos el DTO plano directamente a .create() y .save()
    // TypeORM insertará los IDs planos (id_empresa, id_gestion, id_moneda, id_cuenta_padre)
    // en las columnas de la base de datos.
    const cuentaToCreate = this.cuentaRepository.create(createCuentaDto);

    const cuenta = await this.cuentaRepository.save(cuentaToCreate);
    return cuenta;
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
