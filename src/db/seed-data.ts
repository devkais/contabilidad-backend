import { DataSource } from 'typeorm';
import { Empresa } from '../modules/empresa/empresa.entity';
import { Usuario } from '../modules/usuario/usuario.entity';
import { Rol } from '../modules/rol/rol.entity';
import { UsuarioEmpresa } from '../modules/usuario-empresa/usuario-empresa.entity';
import { Gestion } from '../modules/gestion/gestion.entity';
import { Moneda } from '../modules/moneda/moneda.entity';
import { TipoCambio } from '../modules/tipo-cambio/tipo-cambio.entity';
import { Cuenta } from '../modules/cuenta/cuenta.entity';
import { CentroCosto } from '../modules/centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../modules/cuenta-auxiliar/cuenta-auxiliar.entity';
import { Asiento } from '../modules/asiento/asiento.entity';
import { DetalleAsiento } from '../modules/detalle-asiento/detalle-asiento.entity';
import { Bitacora } from '../modules/bitacora/bitacora.entity';

export class SeedData {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Iniciando carga de datos de prueba...');

    // 1. Crear Monedas
    await this.createMonedas();

    // 2. Crear Roles
    await this.createRoles();

    // 3. Crear Empresa
    await this.createEmpresa();

    // 4. Crear Usuario
    await this.createUsuario();

    // 5. Crear UsuarioEmpresa (asociación)
    await this.createUsuarioEmpresa();

    // 6. Crear Gestión
    await this.createGestion();

    // 7. Crear Tipos de Cambio
    await this.createTiposCambio();

    // 8. Crear Plan de Cuentas
    await this.createCuentas();

    // 9. Crear Centros de Costo
    await this.createCentrosCosto();

    // 10. Crear Cuentas Auxiliares
    await this.createCuentasAuxiliares();

    // 11. Crear Asientos de Ejemplo
    await this.createAsientos();

    // 12. Crear Bitácora de Ejemplo
    await this.createBitacora();

    console.log('✅ Carga de datos de prueba completada exitosamente!');
  }

  private async createMonedas() {
    const monedaRepository = this.dataSource.getRepository(Moneda);

    const monedas = [
      { codigo: 'BS', nombre: 'Bolivianos', simbolo: 'Bs' },
      { codigo: 'USD', nombre: 'Dólares Americanos', simbolo: '$' },
      {
        codigo: 'UFV',
        nombre: 'Unidad de Fomento a la Vivienda',
        simbolo: 'UFV',
      },
    ];

    for (const monedaData of monedas) {
      const existing = await monedaRepository.findOne({
        where: { codigo: monedaData.codigo },
      });
      if (!existing) {
        await monedaRepository.save(monedaRepository.create(monedaData));
        console.log(`💰 Moneda creada: ${monedaData.nombre}`);
      }
    }
  }

  private async createRoles() {
    const rolRepository = this.dataSource.getRepository(Rol);

    const roles = [
      { nombre_rol: 'Administrador' },
      { nombre_rol: 'Contador' },
      { nombre_rol: 'Auditor' },
      { nombre_rol: 'Usuario' },
    ];

    for (const rolData of roles) {
      const existing = await rolRepository.findOne({
        where: { nombre_rol: rolData.nombre_rol },
      });
      if (!existing) {
        await rolRepository.save(rolRepository.create(rolData));
        console.log(`👤 Rol creado: ${rolData.nombre_rol}`);
      }
    }
  }

  private async createEmpresa() {
    const empresaRepository = this.dataSource.getRepository(Empresa);

    const empresaData = {
      nombre: 'Importadora KAIS S.A.',
      nit: '123456789',
      direccion: 'Av. Principal #123, Ciudad Empresarial',
      telefono: '+591 2 1234567',
    };

    const existing = await empresaRepository.findOne({
      where: { nit: empresaData.nit },
    });
    if (!existing) {
      await empresaRepository.save(empresaRepository.create(empresaData));
      console.log(`🏢 Empresa creada: ${empresaData.nombre}`);
    }
  }

  private async createUsuario() {
    const usuarioRepository = this.dataSource.getRepository(Usuario);

    // Hash simple para demo (en producción usar bcrypt)
    const usuarioData = {
      nombre: 'Juan Pérez',
      email: 'admin@kais.com',
      contrasena_hash: '$2b$10$hashedpassworddemo', // En producción: bcrypt.hash('password123', 10)
      activo: true,
    };

    const existing = await usuarioRepository.findOne({
      where: { email: usuarioData.email },
    });
    if (!existing) {
      await usuarioRepository.save(usuarioRepository.create(usuarioData));
      console.log(`👨 Usuario creado: ${usuarioData.nombre}`);
    }
  }

  private async createUsuarioEmpresa() {
    const usuarioEmpresaRepository =
      this.dataSource.getRepository(UsuarioEmpresa);

    // Obtener IDs
    const usuario = await this.dataSource.getRepository(Usuario).findOne({
      where: { email: 'admin@kais.com' },
    });
    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });
    const rol = await this.dataSource.getRepository(Rol).findOne({
      where: { nombre_rol: 'Administrador' },
    });

    if (usuario && empresa && rol) {
      const existing = await usuarioEmpresaRepository.findOne({
        where: {
          id_usuario: usuario.id_usuario,
          id_empresa: empresa.id_empresa,
        },
      });

      if (!existing) {
        await usuarioEmpresaRepository.save(
          usuarioEmpresaRepository.create({
            id_usuario: usuario.id_usuario,
            id_empresa: empresa.id_empresa,
            rol: rol,
          }),
        );
        console.log(`🔗 Usuario-Empresa-Rol asociado`);
      }
    }
  }

  private async createGestion() {
    const gestionRepository = this.dataSource.getRepository(Gestion);

    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });

    if (empresa) {
      const gestionData = {
        nombre: '2024',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-12-31'),
        estado: 'abierto',
        empresa: empresa,
      };

      const existing = await gestionRepository.findOne({
        where: {
          nombre: gestionData.nombre,
          empresa: { id_empresa: empresa.id_empresa },
        },
      });
      if (!existing) {
        await gestionRepository.save(gestionRepository.create(gestionData));
        console.log(`📅 Gestión creada: ${gestionData.nombre}`);
      }
    }
  }

  private async createTiposCambio() {
    const tipoCambioRepository = this.dataSource.getRepository(TipoCambio);

    const usd = await this.dataSource.getRepository(Moneda).findOne({
      where: { codigo: 'USD' },
    });
    const ufv = await this.dataSource.getRepository(Moneda).findOne({
      where: { codigo: 'UFV' },
    });

    const tiposCambio: {
      fecha: Date;
      valor_compra: number;
      valor_venta: number;
      monedaDestino: Moneda;
    }[] = [];

    if (usd) {
      tiposCambio.push({
        fecha: new Date('2024-01-01'),
        valor_compra: 6.96,
        valor_venta: 6.98,
        monedaDestino: usd,
      });
    }
    if (ufv) {
      tiposCambio.push({
        fecha: new Date('2024-01-01'),
        valor_compra: 2.45,
        valor_venta: 2.47,
        monedaDestino: ufv,
      });
    }

    for (const tcData of tiposCambio) {
      const existing = await tipoCambioRepository.findOne({
        where: {
          fecha: tcData.fecha,
          monedaDestino: { id_moneda: tcData.monedaDestino.id_moneda },
        },
      });
      if (!existing) {
        await tipoCambioRepository.save(tipoCambioRepository.create(tcData));
        console.log(
          `💱 Tipo de cambio creado para ${tcData.monedaDestino.codigo}`,
        );
      }
    }
  }

  private async createCuentas() {
    const cuentaRepository = this.dataSource.getRepository(Cuenta);

    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });
    const gestion = await this.dataSource.getRepository(Gestion).findOne({
      where: { nombre: '2024' },
    });
    const bs = await this.dataSource.getRepository(Moneda).findOne({
      where: { codigo: 'BS' },
    });

    if (empresa && gestion && bs) {
      // Plan de Cuentas básico
      const cuentas = [
        // Activo
        {
          codigo: '1',
          nombre: 'ACTIVO',
          nivel: 1,
          clase_cuenta: 'Activo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '1.1',
          nombre: 'ACTIVO CORRIENTE',
          nivel: 2,
          clase_cuenta: 'Activo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '1.1.1',
          nombre: 'CAJA Y BANCOS',
          nivel: 3,
          clase_cuenta: 'Activo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '1.1.1.01',
          nombre: 'Caja General',
          nivel: 4,
          clase_cuenta: 'Activo',
          activo: true,
          es_movimiento: true,
        },

        // Pasivo
        {
          codigo: '2',
          nombre: 'PASIVO',
          nivel: 1,
          clase_cuenta: 'Pasivo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '2.1',
          nombre: 'PASIVO CORRIENTE',
          nivel: 2,
          clase_cuenta: 'Pasivo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '2.1.1',
          nombre: 'PROVEEDORES',
          nivel: 3,
          clase_cuenta: 'Pasivo',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '2.1.1.01',
          nombre: 'Proveedores Nacionales',
          nivel: 4,
          clase_cuenta: 'Pasivo',
          activo: true,
          es_movimiento: true,
        },

        // Patrimonio
        {
          codigo: '3',
          nombre: 'PATRIMONIO',
          nivel: 1,
          clase_cuenta: 'Patrimonio',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '3.1',
          nombre: 'CAPITAL',
          nivel: 2,
          clase_cuenta: 'Patrimonio',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '3.1.1',
          nombre: 'Capital Social',
          nivel: 3,
          clase_cuenta: 'Patrimonio',
          activo: true,
          es_movimiento: true,
        },

        // Ingresos
        {
          codigo: '4',
          nombre: 'INGRESOS',
          nivel: 1,
          clase_cuenta: 'Ingreso',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '4.1',
          nombre: 'VENTAS',
          nivel: 2,
          clase_cuenta: 'Ingreso',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '4.1.1',
          nombre: 'Ventas de Productos',
          nivel: 3,
          clase_cuenta: 'Ingreso',
          activo: true,
          es_movimiento: true,
        },

        // Gastos
        {
          codigo: '5',
          nombre: 'GASTOS',
          nivel: 1,
          clase_cuenta: 'Gasto',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '5.1',
          nombre: 'GASTOS OPERATIVOS',
          nivel: 2,
          clase_cuenta: 'Gasto',
          activo: true,
          es_movimiento: false,
        },
        {
          codigo: '5.1.1',
          nombre: 'Sueldos y Salarios',
          nivel: 3,
          clase_cuenta: 'Gasto',
          activo: true,
          es_movimiento: true,
        },
      ];

      for (const cuentaData of cuentas) {
        const existing = await cuentaRepository.findOne({
          where: {
            codigo: cuentaData.codigo,
            empresa: { id_empresa: empresa.id_empresa },
            gestion: { id_gestion: gestion.id_gestion },
          },
        });
        if (!existing) {
          await cuentaRepository.save(
            cuentaRepository.create({
              ...cuentaData,
              empresa: empresa,
              gestion: gestion,
              moneda: bs,
            }),
          );
          console.log(`📊 Cuenta creada: ${cuentaData.nombre}`);
        }
      }
    }
  }

  private async createCentrosCosto() {
    const centroCostoRepository = this.dataSource.getRepository(CentroCosto);

    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });

    if (empresa) {
      const centrosCosto = [
        { codigo: 'ADM', nombre: 'Administración', activo: true },
        { codigo: 'VEN', nombre: 'Ventas', activo: true },
        { codigo: 'ALM', nombre: 'Almacén', activo: true },
        { codigo: 'LOG', nombre: 'Logística', activo: true },
      ];

      for (const ccData of centrosCosto) {
        const existing = await centroCostoRepository.findOne({
          where: {
            codigo: ccData.codigo,
            empresa: { id_empresa: empresa.id_empresa },
          },
        });
        if (!existing) {
          await centroCostoRepository.save(
            centroCostoRepository.create({
              ...ccData,
              empresa: empresa,
            }),
          );
          console.log(`🏭 Centro de Costo creado: ${ccData.nombre}`);
        }
      }
    }
  }

  private async createCuentasAuxiliares() {
    const cuentaAuxiliarRepository =
      this.dataSource.getRepository(CuentaAuxiliar);

    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });

    if (empresa) {
      const cuentasAuxiliares = [
        { codigo: '001', nombre: 'Productos Electrónicos', activo: true },
        { codigo: '002', nombre: 'Productos de Limpieza', activo: true },
        { codigo: '003', nombre: 'Material de Oficina', activo: true },
        { codigo: '004', nombre: 'Equipos de Computación', activo: true },
      ];

      for (const caData of cuentasAuxiliares) {
        const existing = await cuentaAuxiliarRepository.findOne({
          where: {
            codigo: caData.codigo,
            empresa: { id_empresa: empresa.id_empresa },
          },
        });
        if (!existing) {
          await cuentaAuxiliarRepository.save(
            cuentaAuxiliarRepository.create({
              ...caData,
              empresa: empresa,
            }),
          );
          console.log(`📋 Cuenta Auxiliar creada: ${caData.nombre}`);
        }
      }
    }
  }

  private async createAsientos() {
    const asientoRepository = this.dataSource.getRepository(Asiento);
    const detalleRepository = this.dataSource.getRepository(DetalleAsiento);

    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });
    const gestion = await this.dataSource.getRepository(Gestion).findOne({
      where: { nombre: '2024' },
    });
    const usuario = await this.dataSource.getRepository(Usuario).findOne({
      where: { email: 'admin@kais.com' },
    });

    if (empresa && gestion && usuario) {
      // Asiento de ejemplo: Capital inicial
      const asientoData = {
        fecha: new Date('2024-01-01'),
        numero_comprobante: '001-001',
        glosa: 'Capital inicial de la empresa',
        tipo_asiento: 'Ingreso',
        estado: 'valido',
        tipo_cambio_usd: 6.96,
        tipo_cambio_ufv: 2.45,
        empresa: empresa,
        gestion: gestion,
        createdBy: usuario,
        created_at: new Date(),
      };

      const asiento = await asientoRepository.save(
        asientoRepository.create(asientoData),
      );
      console.log(`📝 Asiento creado: ${asientoData.numero_comprobante}`);

      // Detalles del asiento
      const caja = await this.dataSource.getRepository(Cuenta).findOne({
        where: {
          codigo: '1.1.1.01',
          empresa: { id_empresa: empresa.id_empresa },
        },
      });
      const capital = await this.dataSource.getRepository(Cuenta).findOne({
        where: {
          codigo: '3.1.1',
          empresa: { id_empresa: empresa.id_empresa },
        },
      });

      if (caja && capital) {
        const detalles = [
          {
            tipo_mov_debe_haber_bs: 100000.0,
            tipo_mov_debe_haber_usd: 0,
            tipo_mov_debe_haber_ufv: 0,
            asiento: asiento,
            cuenta: caja,
          },
          {
            tipo_mov_debe_haber_bs: 0,
            tipo_mov_debe_haber_usd: 0,
            tipo_mov_debe_haber_ufv: 0,
            asiento: asiento,
            cuenta: capital,
          },
        ];

        for (const detalleData of detalles) {
          await detalleRepository.save(detalleRepository.create(detalleData));
        }
        console.log(`📋 Detalles del asiento creados`);
      }
    }
  }

  private async createBitacora() {
    const bitacoraRepository = this.dataSource.getRepository(Bitacora);

    const usuario = await this.dataSource.getRepository(Usuario).findOne({
      where: { email: 'admin@kais.com' },
    });
    const empresa = await this.dataSource.getRepository(Empresa).findOne({
      where: { nit: '123456789' },
    });

    if (usuario && empresa) {
      const bitacoraData = {
        accion: 'CREAR_ASIENTO',
        tabla_afectada: 'asiento',
        id_registro_afectado: 1,
        fecha_hora: new Date(),
        ip_maquina: '127.0.0.1',
        detalle_cambio: 'Creación de asiento inicial de capital',
        usuario: usuario,
        empresa: empresa,
      };

      await bitacoraRepository.save(bitacoraRepository.create(bitacoraData));
      console.log(`📋 Entrada de bitácora creada`);
    }
  }
}
