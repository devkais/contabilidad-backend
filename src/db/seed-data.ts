// seed.ts
import 'dotenv/config'; // Asegura cargar el archivo .env
import { DataSource } from 'typeorm';
import { Rol } from '../modules/rol/rol.entity';
import { Usuario } from '../modules/usuario/usuario.entity';
import { Empresa } from '../modules/empresa/empresa.entity';
import { Gestion } from '../modules/gestion/gestion.entity';
import { UsuarioEmpresa } from '../modules/usuario-empresa/usuario-empresa.entity';
import { Moneda } from '../modules/moneda/moneda.entity';
import { TipoCambio } from '../modules/tipo-cambio/tipo-cambio.entity';
import { Cuenta } from '../modules/cuenta/cuenta.entity';
import { Asiento } from '../modules/asiento/asiento.entity';
import { DetalleAsiento } from '../modules/detalle-asiento/detalle-asiento.entity';
import {
  RolSchema,
  UsuarioSchema,
  EmpresaSchema,
} from '../schemas/seed.schema'; // Asegúrate de crear este archivo
import * as bcrypt from 'bcrypt';

// --- Utilerías ---

async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

// ---------------------------------------------------------------------
// 💡 CONFIGURACIÓN BASE
// ---------------------------------------------------------------------

// Configuración de TypeORM basada en tu database.modules y .env
const dataSourceConfig = {
  type: 'mariadb' as const,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Siempre False para seeding
  logging: process.env.DB_LOGGING === 'true',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

// Inicialización manual del DataSource
const AppDataSource = new DataSource(dataSourceConfig);

// Constantes de Referencia
const IDS = {
  USUARIO_ADMIN: 1,
  ROL_SUPERADMIN: 1,
  EMPRESA_MODELO: 1,
  GESTION_INICIAL: 1,
  MONEDA_BOB: 1,
  MONEDA_USD: 2,
  ASIENTO_APERTURA: 1,
  CTA: {
    CAJA_MN: 11101,
    CAPITAL_SOCIAL: 31000,
  },
};

const INITIAL_ADMIN_EMAIL = 'admin@contable.com';
const INITIAL_ADMIN_PASSWORD = 'P@ssw0rd123';
const FECHA_INICIO = new Date('2024-01-01');
const TIPO_CAMBIO_USD = 6.96;
const TIPO_CAMBIO_UFV = 2.5;

// ---------------------------------------------------------------------
// 1. Seed de Seguridad y Contexto
// ---------------------------------------------------------------------

async function seedRoles() {
  const rolRepo = AppDataSource.getRepository(Rol);
  console.log('--- 1. Seed Roles ---');

  const rolesData = [
    { id_rol: IDS.ROL_SUPERADMIN, nombre_rol: 'SuperAdministrador' },
    { id_rol: 2, nombre_rol: 'AdministradorEmpresa' },
    { id_rol: 3, nombre_rol: 'Contador' },
  ];

  for (const data of rolesData) {
    try {
      const validatedData = RolSchema.parse(data);
      const existe = await rolRepo.findOneBy({ id_rol: validatedData.id_rol });
      if (!existe) {
        await rolRepo.save(validatedData);
        console.log(`Rol "${validatedData.nombre_rol}" creado.`);
      }
    } catch (e) {
      console.error(`Error al validar/crear Rol: ${data.nombre_rol}`, e);
    }
  }
}

async function seedUsuarios() {
  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const empresaRepo = AppDataSource.getRepository(Empresa);
  const ueRepo = AppDataSource.getRepository(UsuarioEmpresa);
  console.log('--- 2. Seed Usuarios y Empresa ---');

  // 2.1 Usuario SuperAdmin
  let superAdmin = await usuarioRepo.findOneBy({
    id_usuario: IDS.USUARIO_ADMIN,
  });

  if (!superAdmin) {
    const hashedPassword = await hashPassword(INITIAL_ADMIN_PASSWORD);
    const userData = {
      id_usuario: IDS.USUARIO_ADMIN,
      nombre: 'Admin Global',
      email: INITIAL_ADMIN_EMAIL,
      contrasena_hash: hashedPassword,
    };
    const validatedUser = UsuarioSchema.parse(userData);
    superAdmin = await usuarioRepo.save(validatedUser);
    console.log(`Usuario SuperAdmin ${superAdmin.email} creado.`);
  }

  // 2.2 Empresa Modelo
  let empresaModelo = await empresaRepo.findOneBy({
    id_empresa: IDS.EMPRESA_MODELO,
  });
  if (!empresaModelo) {
    const empresaData = {
      id_empresa: IDS.EMPRESA_MODELO,
      nombre: 'Empresa Modelo S.R.L.',
      nit: '10203040019',
      direccion: 'Av. Principal 100',
      telefono: '3334455',
    };
    const validatedEmpresa = EmpresaSchema.parse(empresaData);
    empresaModelo = await empresaRepo.save(validatedEmpresa);
    console.log(`Empresa "${empresaModelo.nombre}" creada.`);
  }

  // 2.3 Asignación Usuario-Empresa
  const existeUE = await ueRepo.findOneBy({
    id_usuario: IDS.USUARIO_ADMIN,
    id_empresa: IDS.EMPRESA_MODELO,
  });
  if (!existeUE) {
    await ueRepo.save({
      id_usuario: IDS.USUARIO_ADMIN,
      id_empresa: IDS.EMPRESA_MODELO,
      id_rol: IDS.ROL_SUPERADMIN,
    });
    console.log('SuperAdmin asignado a la Empresa Modelo.');
  }

  return { superAdmin, empresaModelo };
}

async function seedContexto(id_empresa: number) {
  const gestionRepo = AppDataSource.getRepository(Gestion);
  const monedaRepo = AppDataSource.getRepository(Moneda);
  const tcRepo = AppDataSource.getRepository(TipoCambio);
  // ... Repositorios para CentroCosto y CuentaAuxiliar

  console.log('--- 3. Seed Contexto Operativo ---');

  // 3.1 Gestión
  let gestion = await gestionRepo.findOneBy({
    id_gestion: IDS.GESTION_INICIAL,
  });
  if (!gestion) {
    gestion = await gestionRepo.save({
      id_gestion: IDS.GESTION_INICIAL,
      nombre: 'Gestión 2024',
      fecha_inicio: FECHA_INICIO,
      fecha_fin: new Date('2024-12-31'),
      id_empresa,
      estado: 'abierto',
    });
    console.log('Gestión 2024 creada.');
  }

  // 3.2 Monedas y Tipo de Cambio
  const monedasData = [
    {
      id_moneda: IDS.MONEDA_BOB,
      codigo: 'BOB',
      nombre: 'Boliviano',
      simbolo: 'Bs',
    },
    {
      id_moneda: IDS.MONEDA_USD,
      codigo: 'USD',
      nombre: 'Dólar Estadounidense',
      simbolo: '$',
    },
  ];
  for (const data of monedasData) {
    const existe = await monedaRepo.findOneBy({ id_moneda: data.id_moneda });
    if (!existe) {
      await monedaRepo.save(data);
      console.log(`Moneda "${data.nombre}" creada.`);
    }
  }

  const existeTC = await tcRepo.findOneBy({ id_tipo_cambio: 1 });
  if (!existeTC) {
    await tcRepo.save({
      id_tipo_cambio: 1,
      fecha: FECHA_INICIO,
      id_moneda_destino: IDS.MONEDA_USD,
      valor_compra: TIPO_CAMBIO_USD - 0.1,
      valor_venta: TIPO_CAMBIO_USD,
    });
    console.log('Tipo de Cambio USD/BOB inicial creado.');
  }

  // (Otras seeds como CentroCosto y CuentaAuxiliar irían aquí, usando sus respectivos repositorios)

  return { gestion };
}

async function seedPlanDeCuentas(id_empresa: number, id_gestion: number) {
  const cuentaRepo = AppDataSource.getRepository(Cuenta);
  console.log('--- 4. Seed Plan de Cuentas Básico ---');

  // Datos del Plan de Cuentas (simplificado para el ejemplo)
  const cuentasData = [
    // ... (Define tus cuentas aquí, igual que en el ejemplo anterior)
    {
      id_cuenta: 10000,
      codigo: '1',
      nombre: 'ACTIVO',
      nivel: 1,
      id_cuenta_padre: null,
      clase_cuenta: 'BALANCE',
      es_movimiento: false,
      id_moneda: IDS.MONEDA_BOB,
    },
    {
      id_cuenta: 30000,
      codigo: '3',
      nombre: 'PATRIMONIO',
      nivel: 1,
      id_cuenta_padre: null,
      clase_cuenta: 'BALANCE',
      es_movimiento: false,
      id_moneda: IDS.MONEDA_BOB,
    },
    {
      id_cuenta: 11100,
      codigo: '111',
      nombre: 'Disponible',
      nivel: 3,
      id_cuenta_padre: 10000,
      clase_cuenta: 'BALANCE',
      es_movimiento: false,
      id_moneda: IDS.MONEDA_BOB,
    },
    {
      id_cuenta: IDS.CTA.CAJA_MN,
      codigo: '111.01',
      nombre: 'Caja M.N.',
      nivel: 4,
      id_cuenta_padre: 11100,
      clase_cuenta: 'BALANCE',
      es_movimiento: true,
      id_moneda: IDS.MONEDA_BOB,
    },
    {
      id_cuenta: IDS.CTA.CAPITAL_SOCIAL,
      codigo: '31000',
      nombre: 'Capital Social',
      nivel: 2,
      id_cuenta_padre: 30000,
      clase_cuenta: 'BALANCE',
      es_movimiento: true,
      id_moneda: IDS.MONEDA_BOB,
    },
  ];

  for (const data of cuentasData) {
    const existe = await cuentaRepo.findOneBy({ id_cuenta: data.id_cuenta });
    if (!existe) {
      const cuentaData = {
        ...data,
        id_empresa,
        id_gestion,
        activo: true,
      };
      // (Idealmente se validaría con Zod: CuentaSchema.parse(cuentaData))
      await cuentaRepo.save(cuentaData);
      console.log(`Cuenta ${data.codigo} creada.`);
    }
  }
}

async function seedAsientos(
  id_empresa: number,
  id_gestion: number,
  id_usuario_creador: number,
) {
  const asientoRepo = AppDataSource.getRepository(Asiento);
  const detalleRepo = AppDataSource.getRepository(DetalleAsiento);
  console.log('--- 5. Seed Transacción Inicial ---');

  const debeBob = 10000.0;
  const debeUsd = debeBob / TIPO_CAMBIO_USD;
  const debeUfv = debeBob / TIPO_CAMBIO_UFV;

  // 5.1 Asiento de Apertura
  let asiento = await asientoRepo.findOneBy({
    id_asiento: IDS.ASIENTO_APERTURA,
  });

  if (!asiento) {
    asiento = await asientoRepo.save({
      id_asiento: IDS.ASIENTO_APERTURA,
      fecha: FECHA_INICIO,
      numero_comprobante: 'A-0001',
      glosa: 'Asiento de Apertura de la Gestión',
      tipo_asiento: 'apertura',
      estado: 'valido',
      tipo_cambio_usd: TIPO_CAMBIO_USD,
      tipo_cambio_ufv: TIPO_CAMBIO_UFV,
      id_empresa,
      id_gestion,
      created_at: new Date(),
      created_by: id_usuario_creador,
      reversion_de: null,
    });
    console.log(`Asiento de Apertura ${asiento.numero_comprobante} creado.`);
  }

  // 5.2 Detalle del Asiento (Caja contra Capital)

  // Detalle 1: Debe (Caja M.N.)
  const detalleDebe = await detalleRepo.findOneBy({ id_detalle: 1 });
  if (!detalleDebe) {
    await detalleRepo.save({
      id_detalle: 1,
      id_asiento: IDS.ASIENTO_APERTURA,
      id_cuenta: IDS.CTA.CAJA_MN,
      tipo_mov_debe_haber_bs: debeBob,
      tipo_mov_debe_haber_usd: debeUsd,
      tipo_mov_debe_haber_ufv: debeUfv,
      id_centro_costo: null, // Si usas Centro de Costo, úsalo aquí
    });
  }

  // Detalle 2: Haber (Capital Social)
  const detalleHaber = await detalleRepo.findOneBy({ id_detalle: 2 });
  if (!detalleHaber) {
    await detalleRepo.save({
      id_detalle: 2,
      id_asiento: IDS.ASIENTO_APERTURA,
      id_cuenta: IDS.CTA.CAPITAL_SOCIAL,
      tipo_mov_debe_haber_bs: -debeBob, // HABER = Negativo
      tipo_mov_debe_haber_usd: -debeUsd,
      tipo_mov_debe_haber_ufv: -debeUfv,
      id_centro_costo: null,
    });
    console.log('Detalles del Asiento de Apertura registrados.');
  }
}

// ---------------------------------------------------------------------
// FUNCIÓN PRINCIPAL DE EJECUCIÓN
// ---------------------------------------------------------------------

async function main() {
  try {
    console.log('🚀 Iniciando conexión y Seeding...');
    // Inicializa la conexión
    await AppDataSource.initialize();
    console.log('✅ Conexión a la Base de Datos establecida.');

    // 1. Datos Base
    await seedRoles();
    const { superAdmin, empresaModelo } = await seedUsuarios();

    // 2. Contexto
    const { gestion } = await seedContexto(empresaModelo.id_empresa);

    // 3. Estructura Contable
    await seedPlanDeCuentas(empresaModelo.id_empresa, gestion.id_gestion);

    // 4. Transacciones Iniciales
    await seedAsientos(
      empresaModelo.id_empresa,
      gestion.id_gestion,
      superAdmin.id_usuario,
    );

    await AppDataSource.destroy();
    console.log('----------------------------------------------------');
    console.log('✅ PROCESO DE SEEDING FINALIZADO CON ÉXITO.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal en el proceso de seeding:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

main();
