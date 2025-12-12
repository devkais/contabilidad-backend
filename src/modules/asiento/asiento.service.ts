import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
import { Repository } from 'typeorm';
import { CreateAsientoDto, UpdateAsientoDto } from './dto';

// Servicios de las llaves foráneas
import { EmpresaService } from '../empresa/services/empresa.service';
import { GestionService } from '../gestion/gestion.service';
import { UsuarioService } from '../usuario/services/usuario.service';
// Entidades para el tipado (opcional)
// ...

@Injectable()
export class AsientoService {
  constructor(
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>, // ⬇️ Inyecciones de servicios para validar las 3 FKs
    private readonly empresaService: EmpresaService,
    private readonly gestionService: GestionService,
    private readonly usuarioService: UsuarioService,
  ) {} // 💡 Necesitas este método para la recursividad:

  async getallAsiento(): Promise<Asiento[]> {
    return this.asientoRepository.find({
      // ⬇️ Array de relaciones definido directamente
      relations: ['empresa', 'gestion', 'createdBy', 'reversionDe'],
      // Opcional: ordenar por fecha y número de comprobante
      order: {
        fecha: 'DESC',
        numero_comprobante: 'DESC',
      },
    });
  }

  // 2. Obtener un asiento por su ID (GET BY ID)
  async getAsientoById(id_asiento: number): Promise<Asiento | null> {
    const asiento = await this.asientoRepository.findOne({
      where: { id_asiento },
      // ⬇️ Array de relaciones definido directamente
      relations: ['empresa', 'gestion', 'createdBy', 'reversionDe'],
    });

    return asiento;
  }

  // 3. Eliminar un asiento por su ID (DELETE)
  async deleteAsiento(id_asiento: number): Promise<boolean> {
    // Este método no requiere la lista de relaciones (relations)
    const result = await this.asientoRepository.delete({ id_asiento });

    // Verificamos si se afectó al menos una fila
    return (result.affected ?? 0) > 0;
  }
  // En asiento.service.ts, método postAsiento:

  async postAsiento(createAsientoDto: CreateAsientoDto): Promise<Asiento> {
    const { id_empresa, id_gestion, created_by, reversion_de } =
      createAsientoDto;

    // 1. VERIFICACIÓN DE EXISTENCIA DE LLAVES FORÁNEAS (4 FKs en total)
    const [empresa, gestion, usuario, asientoRevertido] = await Promise.all([
      this.empresaService.getEmpresaById(id_empresa),
      this.gestionService.getGestionById(id_gestion),
      this.usuarioService.getUsuarioById(created_by),
      // Verificar Asiento Padre (recursivo) si se proporciona
      reversion_de ? this.getAsientoById(reversion_de) : Promise.resolve(null),
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
    if (!usuario)
      throw new NotFoundException(
        `Usuario (Created By) con ID ${created_by} no encontrado.`,
      );

    // Validar el Asiento Padre si se proporcionó y no se encontró
    if (reversion_de && !asientoRevertido) {
      throw new NotFoundException(
        `Asiento a revertir (ID ${reversion_de}) no encontrado.`,
      );
    }

    // 2. CREACIÓN (FORMA SENCILLA)
    const asientoToCreate = this.asientoRepository.create(createAsientoDto);

    return this.asientoRepository.save(asientoToCreate);
  }

  // En asiento.service.ts, método putAsiento:

  async putAsiento(
    id_asiento: number,
    updateAsientoDto: UpdateAsientoDto,
  ): Promise<Asiento | null> {
    // 1. Verificar existencia de las 4 FKs si están en el DTO
    if (updateAsientoDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateAsientoDto.id_empresa,
      );
      if (!empresaExistente)
        throw new NotFoundException(
          `Empresa con ID ${updateAsientoDto.id_empresa} no encontrada.`,
        );
    }

    if (updateAsientoDto.id_gestion) {
      const gestionExistente = await this.gestionService.getGestionById(
        updateAsientoDto.id_gestion,
      );
      if (!gestionExistente)
        throw new NotFoundException(
          `Gestión con ID ${updateAsientoDto.id_gestion} no encontrada.`,
        );
    }

    if (updateAsientoDto.created_by) {
      const usuarioExistente = await this.usuarioService.getUsuarioById(
        updateAsientoDto.created_by,
      );
      if (!usuarioExistente)
        throw new NotFoundException(
          `Usuario con ID ${updateAsientoDto.created_by} no encontrado.`,
        );
    }

    if (updateAsientoDto.reversion_de) {
      const asientoPadreExistente = await this.getAsientoById(
        updateAsientoDto.reversion_de,
      );
      if (!asientoPadreExistente)
        throw new NotFoundException(
          `Asiento a revertir con ID ${updateAsientoDto.reversion_de} no encontrado.`,
        );
    }

    // 2. Ejecutar la actualización con el DTO (Forma Sencilla)
    const result = await this.asientoRepository.update(
      { id_asiento },
      updateAsientoDto,
    );

    if (!result.affected) return null;

    return await this.getAsientoById(id_asiento);
  }
}
