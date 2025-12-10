import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateEmpresaDto, UpdateEmpresaDto } from '../dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

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
    const newEmpresa = this.empresaRepository.create(createEmpresaDto);
    return this.empresaRepository.save(newEmpresa);
  }
  async putEmpresa(
    id_empresa: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa | null> {
    const result: UpdateResult = await this.empresaRepository.update(
      { id_empresa },
      updateEmpresaDto,
    );
    // Usamos el chequeo seguro para 'affected'
    if ((result.affected ?? 0) === 0) {
      return null;
    }
    // Devolvemos la entidad actualizada para que el controlador la reciba
    return await this.getEmpresaById(id_empresa);
  }
  async deleteEmpresa(id_empresa: number): Promise<boolean> {
    const result = await this.empresaRepository.delete({ id_empresa });
    return (result.affected ?? 0) > 0;
  }
}
