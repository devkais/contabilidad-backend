import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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

  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find();
  }

  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresa)
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return empresa;
  }

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const existeNit = await this.empresaRepository.findOne({
      where: { nit: createEmpresaDto.nit },
    });
    if (existeNit)
      throw new ConflictException('El NIT ya se encuentra registrado');

    const nuevaEmpresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(nuevaEmpresa);
  }

  async update(
    id: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);
    this.empresaRepository.merge(empresa, updateEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async remove(id: number): Promise<void> {
    const empresa = await this.findOne(id);
    await this.empresaRepository.remove(empresa);
  }
}
