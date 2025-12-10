// src/modules/usuario/services/usuario.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto';
import * as bcrypt from 'bcrypt'; // NECESITAS INSTALAR: npm install bcrypt && npm install -D @types/bcrypt

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Lógica de Lectura (Existente, mejorada con relaciones)
  async getAllUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      // Incluir las relaciones (ej. usuarioEmpresas)
      relations: ['usuarioEmpresas', 'bitacoras'],
    });
  }

  async getUsuarioById(id_usuario: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id_usuario } });
  }

  // Lógica de Creación (POST)
  async postUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { password, ...userData } = createUsuarioDto;

    // 1. Hashear contraseña
    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(password, saltRounds);

    // 2. Crear y guardar la entidad
    const newUsuario = this.usuarioRepository.create({
      ...userData,
      contrasena_hash,
    });

    return this.usuarioRepository.save(newUsuario);
  }

  // Lógica de Actualización (PUT)
  async putUsuario(
    id_usuario: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario | null> {
    const dataToUpdate: any = { ...updateUsuarioDto };

    // 1. Si se proporciona la contraseña, hashearla
    if (updateUsuarioDto.password) {
      const saltRounds = 10;
      dataToUpdate.contrasena_hash = await bcrypt.hash(
        updateUsuarioDto.password,
        saltRounds,
      );
      delete dataToUpdate.password; // Eliminar el campo de texto plano
    }

    const result: UpdateResult = await this.usuarioRepository.update(
      { id_usuario },
      dataToUpdate,
    );

    if ((result.affected ?? 0) === 0) {
      return null; // No encontrado o no actualizado
    }
    return await this.getUsuarioById(id_usuario);
  }

  // Lógica de Eliminación (DELETE)
  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const result = await this.usuarioRepository.delete({ id_usuario });
    return (result.affected ?? 0) > 0;
  }

  // Método extra para login (necesario para AuthModule)
  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .addSelect('usuario.contrasena_hash') // Selecciona el hash, que es excluido por defecto
      .getOne();
  }
}
