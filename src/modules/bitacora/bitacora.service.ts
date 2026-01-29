import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bitacora } from './bitacora.entity';
import { UserRequest } from '../../auth/interfaces/auth.interface';

@Injectable()
export class BitacoraService {
  constructor(
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
  ) {}

  /**
   * Registra una acción en el log del sistema.
   * Se usa internamente por otros servicios.
   */
  async registrar(
    user: UserRequest,
    accion: string,
    modulo: string,
    tabla: string,
    idRegistro: number,
    ip: string,
    detalles?: Record<string, unknown>,
  ): Promise<void> {
    const nuevaEntrada = this.bitacoraRepository.create({
      id_usuario: user.id_usuario,
      id_empresa: user.id_empresa,
      accion,
      modulo_origen: modulo,
      tabla_afectada: tabla,
      id_registro_afectado: idRegistro,
      ip_maquina: ip,
      detalle_cambio: detalles ? JSON.stringify(detalles) : null,
    });

    await this.bitacoraRepository.save(nuevaEntrada);
  }

  /**
   * Consulta logs filtrados por empresa (solo para administradores/auditores)
   */
  async findAllByEmpresa(idEmpresa: number): Promise<Bitacora[]> {
    return await this.bitacoraRepository.find({
      where: { id_empresa: idEmpresa },
      order: { fecha_hora: 'DESC' },
      relations: ['usuario'], // Para saber quién hizo qué
    });
  }
}
