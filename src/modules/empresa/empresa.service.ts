import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { CreateEmpresaDto } from './dto/empresa.dto';
import { UsuarioEmpresaGestion } from '../usuario-empresa-gestion/usuario-empresa-gestion.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(UsuarioEmpresaGestion)
    private readonly uegRepository: Repository<UsuarioEmpresaGestion>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const existe = await this.empresaRepository.findOne({
      where: { nit: createEmpresaDto.nit },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe una empresa registrada con ese NIT',
      );
    }

    const nuevaEmpresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(nuevaEmpresa);
  }

  /**
   * Lista solo las empresas a las que el usuario tiene acceso.
   */
  async findAllByUser(idUsuario: number): Promise<Empresa[]> {
    const relaciones = await this.uegRepository.find({
      where: { id_usuario: idUsuario },
      relations: ['empresa'],
    });

    return relaciones.map((r) => r.empresa);
  }

  async findOne(id: number, idUsuario: number): Promise<Empresa> {
    // Validamos acceso antes de retornar
    const tieneAcceso = await this.uegRepository.findOne({
      where: { id_usuario: idUsuario, id_empresa: id },
    });

    if (!tieneAcceso) {
      throw new NotFoundException('Empresa no encontrada o sin acceso');
    }

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
    });
    if (!empresa) throw new NotFoundException('Empresa no existe');

    return empresa;
  }
}
