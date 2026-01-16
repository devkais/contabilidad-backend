import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bitacora } from './bitacora.entity';
import { CreateBitacoraDto } from './dto';

@Injectable()
export class BitacoraService {
  constructor(
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
  ) {}

  // Este método será llamado por otros servicios o interceptores
  async registrarAccion(
    dto: CreateBitacoraDto,
    id_usuario: number,
  ): Promise<Bitacora> {
    const registro = this.bitacoraRepository.create({
      ...dto,
      id_usuario,
    });
    return await this.bitacoraRepository.save(registro);
  }

  async findAll(): Promise<Bitacora[]> {
    return await this.bitacoraRepository.find({
      relations: ['usuario', 'empresa'],
      order: { fecha_hora: 'DESC' },
    });
  }

  async findByEmpresa(id_empresa: number): Promise<Bitacora[]> {
    return await this.bitacoraRepository.find({
      where: { id_empresa },
      relations: ['usuario'],
      order: { fecha_hora: 'DESC' },
    });
  }
}
