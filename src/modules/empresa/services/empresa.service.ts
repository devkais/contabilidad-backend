import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa.entity';
import { Repository } from 'typeorm';
import { CreateEmpresaDto, UpdateEmpresaDto } from '../dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallEmpresas(): Promise<Empresa[]> {
    return this.empresaRepository.find();
  }

  async getEmpresaById(id_empresa: number): Promise<Empresa | null> {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa },
    });
    return empresa;
  }

  async postEmpresa(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    try {
      const newEmpresa = this.empresaRepository.create(createEmpresaDto);
      const empresa = await this.empresaRepository.save(newEmpresa);
      return empresa;
    } catch (error: unknown) {
      // Manejo específico del error de NIT único
      const dbError = error as { code?: string; message?: string };
      if (dbError.code === 'ER_DUP_ENTRY' || dbError.code === '23505') {
        throw new ConflictException('Ya existe una empresa con ese NIT');
      }
      throw new Error(
        'Error al crear la empresa: ' +
          (dbError.message || 'Error desconocido'),
      );
    }
  }

  async putEmpresa(
    id_empresa: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa | null> {
    try {
      // Primero verificamos si la empresa existe
      const empresaExistente = await this.empresaRepository.findOne({
        where: { id_empresa },
      });

      if (!empresaExistente) {
        throw new NotFoundException('Empresa no encontrada');
      }

      // Actualizamos los campos
      Object.assign(empresaExistente, updateEmpresaDto);

      // Guardamos los cambios
      const empresaActualizada =
        await this.empresaRepository.save(empresaExistente);
      return empresaActualizada;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Manejo específico del error de NIT único
      const dbError = error as { code?: string; message?: string };
      if (dbError.code === 'ER_DUP_ENTRY' || dbError.code === '23505') {
        throw new ConflictException('Ya existe una empresa con ese NIT');
      }
      throw new Error(
        'Error al actualizar la empresa: ' +
          (dbError.message || 'Error desconocido'),
      );
    }
  }

  async deleteEmpresa(id_empresa: number): Promise<boolean> {
    const result = await this.empresaRepository.delete({ id_empresa });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
