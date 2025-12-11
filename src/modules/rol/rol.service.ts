import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDto, RolDto, UpdateRolDto } from './dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallRol(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async getRolById(id_rol: number): Promise<Rol | null> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol },
    });
    return rol;
  }
  async postRol(createRolDto: CreateRolDto): Promise<RolDto> {
    const newRol = this.rolRepository.create(createRolDto);
    const rol = this.rolRepository.save(newRol);
    return rol;
  }
  async putRol(
    id_rol: number,
    updateRolDto: UpdateRolDto,
  ): Promise<RolDto | null> {
    const rol = this.rolRepository.create(updateRolDto);
    const result = await this.rolRepository.update({ id_rol }, rol);
    if (!result.affected) {
      return null;
    }
    return await this.getRolById(id_rol);
  }
  async deleteRol(id_rol: number): Promise<boolean> {
    const result = await this.rolRepository.delete({ id_rol });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
