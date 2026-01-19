// src/usuario-empresa/entities/usuario-empresa.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity'; // Ajusta según tu ruta
import { Empresa } from '../empresa/empresa.entity'; // Ajusta según tu ruta

@Entity('usuario_empresa')
export class UsuarioEmpresa {
  @PrimaryGeneratedColumn()
  id_usuario_empresa: number;

  @Column()
  id_usuario: number;

  @Column()
  id_empresa: number;

  @Column({ default: false })
  es_principal: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
