import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioEmpresaDto } from './create-usuario-empresa.dto';

export class UpdateUsuarioEmpresaDto extends PartialType(CreateUsuarioEmpresaDto) {}
