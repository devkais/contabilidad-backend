// src/modules/usuario/dto/create-usuario.dto.ts
// Usaremos 'password' en texto plano aquí, que será hasheado en el servicio
export class CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  activo: boolean = true;
  // Nota: Las FK (id_rol) se añadirán aquí si no se usan tablas pivote,
  // pero para esta tabla es suficiente con los campos directos.
}
