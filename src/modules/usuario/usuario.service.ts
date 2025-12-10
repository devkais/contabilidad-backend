import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    // Inyectamos el repositorio de la entidad Usuario
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Busca un usuario por su email.
   * Es crucial para el proceso de login.
   * @param email El email del usuario
   * @returns La entidad Usuario con la contraseña hasheada
   */
  async findOneByEmail(email: string): Promise<Usuario | null> {
    // Usamos el método findOne de TypeORM para buscar por el campo único 'email'.
    // También cargamos la relación 'usuarioEmpresas' y la relación anidada 'rol' y 'empresa'
    // que AuthController necesitará después del login.
    return this.usuarioRepository.findOne({
      where: { email },
      relations: [
        'usuarioEmpresas',
        'usuarioEmpresas.rol',
        'usuarioEmpresas.empresa',
      ],
    });
  }

  // Puedes añadir aquí otros métodos como create(), findAll(), etc.
}
