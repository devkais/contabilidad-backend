import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa.entity';
import { Repository } from 'typeorm';
import { EmpresaDto } from '../dto/empresa.dto';
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

  async getEmpresaById(id_empresa: number): Promise<EmpresaDto | null> {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa },
    });
    return empresa;
  }
  async postEmpresa(createEmpresaDto: CreateEmpresaDto): Promise<EmpresaDto> {
    const newEmpresa = this.empresaRepository.create(createEmpresaDto);
    const empresa = this.empresaRepository.save(newEmpresa);
    return empresa;
  }
  async putEmpresa(
    id_empresa: number,
    UpdateEmpresaDto: UpdateEmpresaDto,
  ): Promise<EmpresaDto | null> {
    const empresa = this.empresaRepository.create(UpdateEmpresaDto);
    const result = await this.empresaRepository.update({ id_empresa }, empresa);
    if (!result.affected) {
      return null;
    }
    return await this.getEmpresaById(id_empresa);
  }
  async deleteEmpresa(id_empresa: number): Promise<boolean> {
    const result = await this.empresaRepository.delete({ id_empresa });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
