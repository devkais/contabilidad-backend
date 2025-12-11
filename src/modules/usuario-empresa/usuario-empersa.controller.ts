import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioEmpresaService } from './usuario-empresa.service';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto } from './dto';
import { UsuarioEmpresa } from './usuario-empresa.entity';

@Controller('usuario-empresa') // Ruta base: /api/v1/usuario-empresa
export class UsuarioEmpresaController {
  constructor(private readonly usuarioEmpresaService: UsuarioEmpresaService) {}

  // --- 1. CREACIÓN DE RELACIÓN (POST) ---
  // POST /usuario-empresa
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUsuarioEmpresaDto: CreateUsuarioEmpresaDto,
  ): Promise<UsuarioEmpresa> {
    // El servicio maneja la lógica de buscar las FKs y guardar la relación
    return this.usuarioEmpresaService.postUsuarioEmpresa(
      createUsuarioEmpresaDto,
    );
  }

  // --- 2. ACTUALIZACIÓN DE ROL (PUT) ---
  // PUT /usuario-empresa/:id_usuario/:id_empresa
  // Se usan ambos IDs como parámetros para identificar la fila única a modificar.
  @Put(':id_usuario/:id_empresa')
  async update(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
    @Body() updateUsuarioEmpresaDto: UpdateUsuarioEmpresaDto,
  ): Promise<UsuarioEmpresa> {
    // Convertir parámetros de cadena a número entero
    const usuarioId = parseInt(id_usuario.toString());
    const empresaId = parseInt(id_empresa.toString());

    // Llamar al servicio para actualizar el rol
    const updatedRelation = await this.usuarioEmpresaService.putUsuarioEmpresa(
      usuarioId,
      empresaId,
      updateUsuarioEmpresaDto,
    );

    if (!updatedRelation) {
      throw new NotFoundException(
        `Relación Usuario (ID: ${usuarioId}) y Empresa (ID: ${empresaId}) no encontrada.`,
      );
    }

    return updatedRelation;
  }

  // --- 3. OBTENER TODAS LAS RELACIONES (GET ALL) ---
  // GET /usuario-empresa
  @Get()
  async findAll(): Promise<UsuarioEmpresa[]> {
    return this.usuarioEmpresaService.getallUsuarioEmpresa();
  }

  // --- 4. OBTENER RELACIÓN POR ID COMPUESTO (GET BY ID) ---
  // GET /usuario-empresa/:id_usuario/:id_empresa
  @Get(':id_usuario/:id_empresa')
  async findOne(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
  ): Promise<UsuarioEmpresa> {
    // Convertir parámetros a número
    const usuarioId = parseInt(id_usuario.toString());
    const empresaId = parseInt(id_empresa.toString());

    const relation = await this.usuarioEmpresaService.getUsuarioEmpresaById(
      usuarioId,
      empresaId,
    );

    if (!relation) {
      throw new NotFoundException(
        `Relación Usuario (ID: ${usuarioId}) y Empresa (ID: ${empresaId}) no encontrada.`,
      );
    }
    return relation;
  }

  // --- 5. ELIMINAR RELACIÓN (DELETE) ---
  // DELETE /usuario-empresa/:id_usuario/:id_empresa
  @Delete(':id_usuario/:id_empresa')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si es exitoso
  async delete(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
  ): Promise<void> {
    // Convertir parámetros a número
    const usuarioId = parseInt(id_usuario.toString());
    const empresaId = parseInt(id_empresa.toString());

    const wasDeleted = await this.usuarioEmpresaService.deleteUsuarioEmpresa(
      usuarioId,
      empresaId,
    );

    if (!wasDeleted) {
      throw new NotFoundException(
        `Relación Usuario (ID: ${usuarioId}) y Empresa (ID: ${empresaId}) no encontrada para eliminar.`,
      );
    }
  }
}
