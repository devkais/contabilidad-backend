import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../empresa.entity';
import { CreateEmpresaDto, UpdateEmpresaDto } from '../dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async getallEmpresas(): Promise<Empresa[]> {
    return await this.empresaRepository.find();
  }

  async getEmpresaById(id_empresa: number): Promise<Empresa | null> {
    return await this.empresaRepository.findOne({
      where: { id_empresa },
    });
  }

  async postEmpresa(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const newEmpresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(newEmpresa);
  }

  async putEmpresa(
    id_empresa: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa | null> {
    // Usamos la misma lógica de limpieza que en Centro de Costo
    const { id_empresa: _id, ...data } = updateEmpresaDto as any;

    await this.empresaRepository.update(id_empresa, data);
    return await this.getEmpresaById(id_empresa);
  }

  async deleteEmpresa(id_empresa: number): Promise<boolean> {
    const result = await this.empresaRepository.delete(id_empresa);
    return (result.affected ?? 0) > 0;
  }
}
