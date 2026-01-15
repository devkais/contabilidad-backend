import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // CRÍTICO PARA AUTH: No cambiar el nombre ni la selección del password
  async findByUsernameWithPassword(username: string): Promise<Usuario | null> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.username = :username', { username })
      .addSelect('usuario.password') // Necesario si usas @Exclude() en la entidad
      .getOne();
  }

  async getAllUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { activo: true },
    });
  }

  async getUsuarioById(id_usuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    return usuario;
  }

  async postUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.usuarioRepository.findOne({
      where: { username: dto.username },
    });
    if (existe) throw new BadRequestException('El nombre de usuario ya existe');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUsuario = this.usuarioRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.usuarioRepository.save(newUsuario);
  }

  async putUsuario(
    id_usuario: number,
    dto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    // 1. Buscamos el usuario existente
    const usuario = await this.getUsuarioById(id_usuario);

    // 2. Aplicamos los cambios del DTO manualmente o con merge
    // Esto evita pasar objetos de relación al repositorio
    if (dto.username) usuario.username = dto.username;
    if (dto.nombre_completo) usuario.nombre_completo = dto.nombre_completo;
    if (dto.activo !== undefined) usuario.activo = dto.activo;

    // 3. Manejo de password
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(dto.password, salt);
    }

    // 4. Usamos .save() en lugar de .update()
    // .save() reconoce que el objeto tiene un ID y realizará un UPDATE solo de los campos locales
    return await this.usuarioRepository.save(usuario);
  }

  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const usuario = await this.getUsuarioById(id_usuario);
    // Preferimos borrado lógico para no romper la bitácora
    usuario.activo = false;
    await this.usuarioRepository.save(usuario);
    return true;
  }
}
