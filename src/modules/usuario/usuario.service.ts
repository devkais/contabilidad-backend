import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { username, contrasena_hash } = createUsuarioDto;

    // Validar duplicado por username
    const existe = await this.usuarioRepository.findOne({
      where: { username },
    });
    if (existe)
      throw new BadRequestException('El nombre de usuario ya está registrado');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(contrasena_hash, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasenaHash: hashed,
    });

    return await this.usuarioRepository.save(nuevoUsuario);
  }

  // Método actualizado para buscar por username
  async findByUsernameWithPassword(username: string): Promise<Usuario | null> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.contrasenaHash')
      .where('usuario.username = :username', { username })
      .getOne();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }
}
