import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEmpresa } from './usuario-empresa.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto } from './dto';
import { UsuarioService } from '../usuario/services/usuario.service';
import { EmpresaService } from '../empresa/services/empresa.service';
import { RolService } from '../rol/rol.service';
// Entidades (Necesarias para el tipado)

@Injectable()
export class UsuarioEmpresaService {
  constructor(
    @InjectRepository(UsuarioEmpresa)
    private readonly usuarioEmpresaRepository: Repository<UsuarioEmpresa>,
    private readonly usuarioService: UsuarioService,
    private readonly empresaService: EmpresaService,
    private readonly rolService: RolService,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallUsuarioEmpresa(): Promise<UsuarioEmpresa[]> {
    // Opcional: Usar 'relations' para cargar las entidades relacionadas (Usuario, Empresa, Rol)
    return this.usuarioEmpresaRepository.find({
      relations: ['usuario', 'empresa', 'rol'],
    });
  }

  // 2. Obtener una relación por su clave primaria compuesta (GET BY ID)
  // El ID se compone de id_usuario y id_empresa
  async getUsuarioEmpresaById(
    id_usuario: number,
    id_empresa: number,
  ): Promise<UsuarioEmpresa | null> {
    const relacion = await this.usuarioEmpresaRepository.findOne({
      where: { id_usuario, id_empresa },
      relations: ['usuario', 'empresa', 'rol'],
    });

    return relacion;
  }

  // 3. Eliminar una relación por su clave primaria compuesta (DELETE)
  async deleteUsuarioEmpresa(
    id_usuario: number,
    id_empresa: number,
  ): Promise<boolean> {
    // El método .delete() puede usar objetos para las condiciones WHERE
    const result = await this.usuarioEmpresaRepository.delete({
      id_usuario,
      id_empresa,
    });

    // Verificamos si se afectó al menos una fila
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
  async postUsuarioEmpresa(
    createUsuarioEmpresaDto: CreateUsuarioEmpresaDto,
  ): Promise<UsuarioEmpresa> {
    const { id_usuario, id_empresa, id_rol } = createUsuarioEmpresaDto;

    // 1. Verificar si la relación ya existe (omito por simplicidad, pero debe estar)
    // ...

    // 2. Buscar las tres entidades concurrentemente
    const [usuario, empresa, rol] = await Promise.all([
      this.usuarioService.getUsuarioById(id_usuario),
      this.empresaService.getEmpresaById(id_empresa),
      this.rolService.getRolById(id_rol),
    ]);

    if (!usuario)
      throw new NotFoundException(
        `Usuario con ID ${id_usuario} no encontrado.`,
      );
    if (!empresa)
      throw new NotFoundException(
        `Empresa con ID ${id_empresa} no encontrada.`,
      );
    if (!rol)
      throw new NotFoundException(`Rol con ID ${id_rol} no encontrado.`);

    // 3. Crear el objeto de relación
    const relacionToCreate = this.usuarioEmpresaRepository.create({
      // SOLO asignamos las entidades completas (que TypeORM usará para obtener los IDs)
      usuario: usuario,
      empresa: empresa,
      rol: rol,
      // Eliminamos las líneas:
      // id_usuario: id_usuario,
      // id_empresa: id_empresa,
      // id_rol: id_rol,
    });

    // Línea que tenía error en la imagen:
    return this.usuarioEmpresaRepository.save(relacionToCreate);
  }
  async putUsuarioEmpresa(
    id_usuario: number, // ID del usuario (viene de la URL/parámetro)
    id_empresa: number, // ID de la empresa (viene de la URL/parámetro)
    updateUsuarioEmpresaDto: UpdateUsuarioEmpresaDto, // Solo contiene 'id_rol'
  ): Promise<UsuarioEmpresa | null> {
    // 1. Crear el objeto de actualización:
    // Combinamos la información que identifica la fila (PK compuesta)
    // con el campo que queremos actualizar (id_rol).
    const updateData = {
      id_usuario: id_usuario,
      id_empresa: id_empresa,
      id_rol: updateUsuarioEmpresaDto.id_rol,
    };

    // 2. Usar .create() para mapear el objeto a la entidad (Tipo TypeORM)
    const relacionToUpdate = this.usuarioEmpresaRepository.create(updateData);

    // 3. Ejecutar la actualización:
    // Solo le indicamos a TypeORM qué fila actualizar usando la PK compuesta
    // y qué datos debe modificar.
    const result = await this.usuarioEmpresaRepository.update(
      { id_usuario, id_empresa }, // Criterio de búsqueda (la PK)
      relacionToUpdate, // El objeto con el rol actualizado
    );

    if (!result.affected) {
      return null;
    }

    // Devolver el registro actualizado
    return this.usuarioEmpresaRepository.findOne({
      where: { id_usuario, id_empresa },
    });
  }
}
