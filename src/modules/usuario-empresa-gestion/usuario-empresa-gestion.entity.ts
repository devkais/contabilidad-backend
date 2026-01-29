import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';

@Entity('usuario_empresa_gestion')
export class UsuarioEmpresaGestion {
  @PrimaryColumn({ name: 'id_usuario' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_empresa' })
  id_empresa: number;

  @PrimaryColumn({ name: 'id_gestion' })
  id_gestion: number;

  @Column({ name: 'es_principal', type: 'boolean', default: false })
  esPrincipal: boolean;

  // RELACIONES
  @ManyToOne(() => Usuario, (usuario) => usuario.accesoGestiones)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarioEmpresaGestiones)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Gestion)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;
}
