import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Rol } from '../rol/rol.entity';

@Entity('usuario_empresa') // Tabla pivote
export class UsuarioEmpresa {
  // --- CLAVES PRIMARIAS COMPUESTAS ---
  // @PrimaryColumn indica que estos campos forman la clave primaria
  @PrimaryColumn()
  id_usuario: number;

  @PrimaryColumn()
  id_empresa: number;

  // --- CLAVES FORÁNEAS (FKs) ---

  // 1. Muchos a Uno con Usuario
  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.usuarioEmpresas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // 2. Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.usuarioEmpresas)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // 3. Muchos a Uno con Rol (el rol específico para esta empresa)
  @ManyToOne(() => Rol, (rol: Rol) => rol.usuarioEmpresas)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}
