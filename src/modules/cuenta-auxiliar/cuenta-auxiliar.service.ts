import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { Repository } from 'typeorm';
import { CreateCuentaAuxiliarDto, UpdateCuentaAuxiliarDto } from './dto';
import { EmpresaService } from '../empresa/services/empresa.service';

@Injectable()
export class CuentaAuxiliarService {
  constructor(
    @InjectRepository(CuentaAuxiliar)
    private readonly cuentaAuxiliarRepository: Repository<CuentaAuxiliar>,
    private readonly empresaService: EmpresaService,
  ) {}

  async getAllCuentaAuxiliar(): Promise<CuentaAuxiliar[]> {
    return this.cuentaAuxiliarRepository.find();
  }

  async getCuentaAuxiliarById(
    id_cuenta_auxiliar: number,
  ): Promise<CuentaAuxiliar | null> {
    const cuentaAuxiliar = await this.cuentaAuxiliarRepository.findOne({
      where: { id_cuenta_auxiliar },
    });
    return cuentaAuxiliar;
  }

  async postCuentaAuxiliar(
    createCuentaAuxiliarDto: CreateCuentaAuxiliarDto,
  ): Promise<CuentaAuxiliar> {
    const empresa = await this.empresaService.getEmpresaById(
      createCuentaAuxiliarDto.id_empresa,
    );
    if (!empresa) {
      throw new NotFoundException(
        `Empresa con ID ${createCuentaAuxiliarDto.id_empresa} no encontrada.`,
      );
    }
    const cuentaAuxiliarToCreate = this.cuentaAuxiliarRepository.create({
      codigo: createCuentaAuxiliarDto.codigo,
      nombre: createCuentaAuxiliarDto.nombre,
      activo: createCuentaAuxiliarDto.activo,
      empresa: empresa,
    });
    const cuentaAuxiliar = await this.cuentaAuxiliarRepository.save(
      cuentaAuxiliarToCreate,
    );
    return cuentaAuxiliar;
  }
  async putCuentaAuxiliar(
    id_cuenta_auxiliar: number,
    updateCuentaAuxiliarDto: UpdateCuentaAuxiliarDto,
  ): Promise<CuentaAuxiliar | null> {
    const updateData = { ...updateCuentaAuxiliarDto };
    const result = await this.cuentaAuxiliarRepository.update(
      { id_cuenta_auxiliar },
      updateData,
    );
    if (!result.affected) {
      return null;
    }
    return await this.getCuentaAuxiliarById(id_cuenta_auxiliar);
  }
  async deleteCuentaAuxiliar(id_cuenta_auxiliar: number): Promise<boolean> {
    const result = await this.cuentaAuxiliarRepository.delete({
      id_cuenta_auxiliar,
    });
    return (result.affected ?? 0) > 0;
  }
}
