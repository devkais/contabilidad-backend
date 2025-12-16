# SISTEMA DE CONTABILIDAD - DOCUMENTACIÓN COMPLETA

## 🎯 ¿QUÉ ES ESTE SISTEMA?

Este es un **Sistema de Contabilidad Backend** completo desarrollado con NestJS que implementa un sistema de doble partida (double-entry bookkeeping) profesional. Es una API REST que maneja todos los procesos contables fundamentales de una empresa, desde la gestión de usuarios hasta la generación de asientos contables con auditoría completa.

---

## 🏗️ ARQUITECTURA Y PATRONES DE DISEÑO

### **Patrón Principal: Domain-Driven Design (DDD) + Clean Architecture**

1. **Módulos por Dominio**: Cada módulo representa un dominio de negocio específico
2. **Separación de Responsabilidades**: Controllers, Services, Entities, DTOs
3. **Inyección de Dependencias**: Patrón fundamental de NestJS
4. **Repository Pattern**: Abstracción de acceso a datos con TypeORM
5. **Module Pattern**: Encapsulación de funcionalidades relacionadas

### **Patrones Específicos Implementados:**

- **Module Pattern**: Cada funcionalidad está en su propio módulo independiente
- **Repository Pattern**: Capa de abstracción para operaciones de base de datos
- **DTO Pattern**: Data Transfer Objects para validación y transformación
- **Strategy Pattern**: Diferentes tipos de asientos contables
- **Observer Pattern**: Sistema de bitácora para auditoría
- **Factory Pattern**: Creación de diferentes entidades del dominio

---

## 🛠️ TECNOLOGÍAS Y FRAMEWORKS

### **Core Technologies:**

- **NestJS 11.0.1**: Framework backend progresivo de Node.js
- **TypeORM 0.3.28**: ORM para manejo de base de datos
- **MariaDB/MySQL**: Base de datos relacional
- **TypeScript**: Lenguaje de programación tipado
- **Node.js**: Runtime de JavaScript

### **Dependencias Clave:**

- **@nestjs/typeorm**: Integración de TypeORM con NestJS
- **@nestjs/config**: Gestión de variables de entorno
- **@nestjs/jwt**: Autenticación JWT
- **@nestjs/passport**: Middleware de autenticación
- **bcrypt/bcryptjs**: Hashing de contraseñas
- **class-validator**: Validación de datos
- **zod**: Validación de esquemas

### **Herramientas de Desarrollo:**

- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Jest**: Framework de testing
- **pnpm**: Gestor de paquetes

---

## 📁 ESTRUCTURA DEL PROYECTO

```
contabilidad-backend/
├── 📁 config/                 # Configuraciones globales
│   └── env.config.ts         # Variables de entorno tipadas
├── 📁 db/                    # Configuración de base de datos
│   ├── data-source.ts        # Configuración de conexión
│   ├── database.module.ts    # Módulo de DB
│   └── seed-data.ts          # Datos iniciales
├── 📁 modules/               # Módulos de negocio
│   ├── 📁 asiento/           # Módulo de asientos contables
│   ├── 📁 usuario/           # Gestión de usuarios
│   ├── 📁 empresa/           # Información de empresas
│   ├── 📁 cuenta/            # Plan de cuentas
│   ├── 📁 centro-costo/      # Centros de costo
│   ├── 📁 tipo-cambio/       # Tipos de cambio
│   └── ... (otros módulos)
├── 📁 schemas/               # Esquemas y tipos
├── 📁 utils/                 # Utilidades
├── 📄 app.module.ts          # Módulo raíz
├── 📄 main.ts                # Punto de entrada
└── 📄 .env                   # Variables de entorno
```

---

## 🗃️ MODELO DE DATOS Y RELACIONES

### **Entidades Principales:**

#### 1. **Usuario** 👤

```typescript
- id_usuario (PK)
- nombre: string
- email: string (único)
- password: string (hash)
- activo: boolean
- Relación N:M con Empresa (a través de UsuarioEmpresa)
- Relación 1:N con Asiento (created_by)
- Relación 1:N con Bitacora
```

#### 2. **Empresa** 🏢

```typescript
- id_empresa (PK)
- nombre: string
- nit: string
- direccion: string
- telefono: string
- email: string
- Relación 1:N con UsuarioEmpresa
- Relación 1:N con Asiento
- Relación 1:N con Cuenta
- Relación 1:N con CentroCosto
```

#### 3. **Asiento Contable** 📊

```typescript
- id_asiento (PK)
- fecha: date
- numero_comprobante: string
- glosa: text
- tipo_asiento: string (Ingreso/Egreso/Traspaso)
- estado: string (valido/anulado/revertido)
- tipo_cambio_usd: decimal
- tipo_cambio_ufv: decimal
- Relación N:1 con Empresa
- Relación N:1 con Gestion
- Relación N:1 con Usuario (created_by)
- Relación 1:N con DetalleAsiento
- Relación recursiva: reversion_de (auto-referencia)
```

#### 4. **DetalleAsiento** (Líneas del Asiento) 📝

```typescript
- id_detalle_asiento (PK)
- debe: decimal
- haber: decimal
- moneda: string
- tipo_cambio_aplicado: decimal
- glosa: text
- Relación N:1 con Asiento
- Relación N:1 con Cuenta
- Relación N:1 con CentroCosto
- Relación N:1 con CuentaAuxiliar
```

#### 5. **Cuenta** (Plan de Cuentas) 📋

```typescript
- id_cuenta (PK)
- codigo: string
- nombre: string
- tipo_cuenta: string
- nivel: number
- padre: Cuenta (auto-referencia)
- activa: boolean
- Relación 1:N con Empresa
- Relación 1:N con DetalleAsiento
```

#### 6. **UsuarioEmpresa** (Tabla Pivote) 🔗

```typescript
- id_usuario_empresa (PK)
- Relación N:1 con Usuario
- Relación N:1 con Empresa
- Relación N:1 con Rol
```

### **Relaciones Complejas Implementadas:**

1. **N:M con Tabla Pivote**: Usuario ↔ Empresa (a través de UsuarioEmpresa)
2. **Auto-Referencia**: Cuenta.padre (jerarquía del plan de cuentas)
3. **Relación Recursiva**: Asiento.reversionDe (reversión de asientos)
4. **Cascada**: Eliminación en cascada de detalles al eliminar asientos
5. **Auditoría**: Tracking de created_by en múltiples entidades

---

## 🏢 MÓDULOS DE NEGOCIO

### **1. Módulos de Seguridad y Contexto:**

- **Usuario**: Gestión completa de usuarios con hashing de contraseñas
- **Rol**: Control de acceso basado en roles
- **Empresa**: Información corporativa
- **Gestion**: Períodos contables
- **UsuarioEmpresa**: Asociación usuario-empresa con roles

### **2. Módulos de Estructura y Valor:**

- **Cuenta**: Plan de cuentas contable jerárquico
- **Moneda**: Soporte multi-moneda
- **TipoCambio**: Gestión de tasas de cambio

### **3. Módulos de Desagregación:**

- **CentroCosto**: Distribución por centros de costo
- **CuentaAuxiliar**: Cuentas auxiliares detalladas

### **4. Módulos de Transacción (Núcleo):**

- **Asiento**: Registro de asientos contables
- **DetalleAsiento**: Líneas detalladas de los asientos

### **5. Módulos de Auditoría:**

- **Bitacora**: Log completo de operaciones del sistema

---

## ⚙️ CONFIGURACIÓN DEL SISTEMA

### **Variables de Entorno (.env):**

```bash
# Aplicación
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sebastian
DB_PASSWORD=sebas12
DB_DATABASE=contabilidad_db
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Seguridad
JWT_SECRET=TU_SECRETO_ULTRA_SEGURO_AQUI
```

### **Configuración de TypeORM:**

- **Driver**: MariaDB/MySQL
- **Auto-sync**: Deshabilitado en producción
- **Logging**: Habilitado para desarrollo
- **Entities**: Cargadas dinámicamente desde `dist/**/*.entity{.ts,.js}`

---

## 🔧 CONFIGURACIÓN DE NESTJS

### **main.ts - Configuración Global:**

```typescript
- CORS habilitado para frontend (puerto 5173)
- Prefijo global de API: /api/v1
- Validación global con class-validator
- Whitelist de propiedades
- Transformación automática de DTOs
```

### **app.module.ts - Arquitectura Modular:**

```typescript
- ConfigModule global
- DatabaseModule con TypeORM
- Importación de todos los módulos de negocio
- Inyección de dependencias centralizada
```

---

## 🔐 SEGURIDAD IMPLEMENTADA

### **1. Autenticación y Autorización:**

- **JWT**: Autenticación basada en tokens
- **bcrypt**: Hashing seguro de contraseñas
- **Passport**: Middleware de autenticación
- **Roles**: Control de acceso granular

### **2. Validación de Datos:**

- **class-validator**: Validación de DTOs
- **Whitelist**: Filtrado de propiedades no definidas
- **Transform**: Conversión automática de tipos

### **3. Protección de Datos:**

- **@Exclude**: Ocultación de contraseñas en responses
- **Validación de entrada**: Sanitización de datos
- **Configuración de CORS**: Control de acceso cross-origin

---

## 💾 BASE DE DATOS

### **Características:**

- **MariaDB/MySQL**: Base de datos relacional
- **TypeORM**: ORM con migrations
- **Auto-sync**: Deshabilitado en producción
- **Logging**: Consultas SQL visibles en desarrollo
- **Entity Loading**: Carga automática de entidades

### **Diseño Normalizado:**

- **3ra Forma Normal**: Eliminación de redundancia
- **Claves Foráneas**: Integridad referencial
- **Índices**: Optimización de consultas
- **Constraints**: Validaciones a nivel de BD

---

## 📡 API REST

### **Estructura de Endpoints:**

```
POST   /api/v1/usuarios              # Crear usuario
GET    /api/v1/usuarios              # Listar usuarios
GET    /api/v1/usuarios/:id          # Obtener usuario
PUT    /api/v1/usuarios/:id          # Actualizar usuario
DELETE /api/v1/usuarios/:id          # Eliminar usuario

POST   /api/v1/asientos              # Crear asiento
GET    /api/v1/asientos              # Listar asientos
GET    /api/v1/asientos/:id          # Obtener asiento
PUT    /api/v1/asientos/:id          # Actualizar asiento
DELETE /api/v1/asientos/:id          # Eliminar asiento

# Y así para cada módulo...
```

### **Características:**

- **CRUD Completo**: Operaciones Create, Read, Update, Delete
- **Validación**: Validación de datos en cada endpoint
- **Respuestas JSON**: Formato estándar de respuestas
- **Códigos de Estado**: HTTP status codes apropiados
- **Manejo de Errores**: Exceptions globales

---

## 🎨 PATRONES DE DISEÑO ESPECÍFICOS

### **1. Module Pattern:**

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
  exports: [Service],
})
export class EntityModule {}
```

### **2. Repository Pattern:**

```typescript
export class EntityService {
  constructor(
    @InjectRepository(Entity)
    private entityRepository: Repository<Entity>,
  ) {}
}
```

### **3. DTO Pattern:**

```typescript
export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### **4. Service Layer Pattern:**

```typescript
export class EntityService {
  async create(dto: CreateEntityDto): Promise<Entity> {
    const entity = this.entityRepository.create(dto);
    return await this.entityRepository.save(entity);
  }
}
```

---

## 🔄 FLUJO DE DATOS TÍPICO

### **Ejemplo: Crear un Asiento Contable**

1. **Controller** recibe petición POST `/api/v1/asientos`
2. **DTO** valida datos de entrada (fecha, glosa, tipo)
3. **Service** procesa lógica de negocio:
   - Validación de balance (debe = haber)
   - Aplicación de tipos de cambio
   - Verificación de permisos
4. **Repository** persiste en base de datos
5. **Response** retorna el asiento creado
6. **Bitácora** registra la operación para auditoría

---

## 🧪 TESTING Y CALIDAD

### **Herramientas de Testing:**

- **Jest**: Framework de testing
- **Supertest**: Testing de endpoints HTTP
- **Coverage**: Cobertura de código
- **E2E Tests**: Tests end-to-end

### **Linting y Formateo:**

- **ESLint**: Análisis estático de código
- **Prettier**: Formateo automático
- **TypeScript**: Tipado estático

---

## 🚀 DESPLIEGUE

### **Scripts Disponibles:**

```bash
pnpm run build        # Compilar TypeScript
pnpm run start        # Ejecutar en producción
pnpm run start:dev    # Ejecutar en desarrollo con watch
pnpm run start:debug  # Ejecutar en modo debug
pnpm run test         # Ejecutar tests
pnpm run lint         # Linting de código
```

### **Configuración de Producción:**

- **Environment**: NODE_ENV=production
- **DB Sync**: DB_SYNCHRONIZE=false
- **Logging**: DB_LOGGING=false (reducir overhead)
- **CORS**: Configurar dominios específicos
- **JWT Secret**: Clave secreta segura

---

## 📊 CARACTERÍSTICAS AVANZADAS

### **1. Sistema de Auditoría:**

- **Bitácora**: Log completo de operaciones
- **Tracking**: Usuario que realizó la acción
- **Timestamps**: created_at, updated_at
- **Estado**: Tracking de cambios de estado

### **2. Soporte Multi-Moneda:**

- **Tipos de Cambio**: USD, UFV, Bolivianos
- **Aplicación en Tiempo Real**: Al momento del asiento
- **Conversión Automática**: Basada en tasas vigentes

### **3. Reversión de Asientos:**

- **Asiento de Reversión**: Creación automática
- **Relación Recursiva**: Linking entre asientos
- **Estado de Reversión**: Tracking del estado

### **4. Jerarquía de Cuentas:**

- **Plan de Cuentas**: Estructura jerárquica
- **Códigos Numerados**: Sistema de codificación
- **Niveles**: Diferentes niveles de detalle

### **5. Centros de Costo:**

- **Distribución**: Por áreas o proyectos
- **Tracking**: Asignación a cuentas
- **Reportes**: Análisis por centro de costo

---

## 🎯 CASOS DE USO PRINCIPALES

### **1. Gestión de Usuarios:**

- Registro de usuarios
- Asignación de roles
- Asociación con empresas

### **2. Gestión de Empresas:**

- Múltiples empresas
- Períodos contables
- Configuración por empresa

### **3. Registro Contable:**

- Asientos de ingreso
- Asientos de egreso
- Asientos de traspaso
- Reversión de asientos

### **4. Reportes y Consultas:**

- Balance por períodos
- Movimientos por cuenta
- Reportes por centro de costo
- Historial de operaciones

---

## 🔮 ESCALABILIDAD Y MANTENIBILIDAD

### **Escalabilidad:**

- **Modular**: Fácil adición de nuevos módulos
- **Separación de Responsabilidades**: Cada módulo es independiente
- **Database Pooling**: Conexiones reutilizables
- **Caching**: Preparado para Redis/Memcached

### **Mantenibilidad:**

- **TypeScript**: Tipado estático reduce errores
- **Patrones Consistente**: Arquitectura uniforme
- **Documentación**: JSDoc y comentarios
- **Testing**: Suite de tests para regresión

---

## 📈 PRÓXIMAS MEJORAS POSIBLES

1. **Microservicios**: División en servicios independientes
2. **Cache**: Implementación de Redis
3. **Event Sourcing**: Auditoría completa de eventos
4. **GraphQL**: Alternativa a REST API
5. **Websockets**: Updates en tiempo real
6. **Machine Learning**: Categorización automática de gastos
7. **Reportes Avanzados**: Dashboard con métricas
8. **API Gateway**: Gestión centralizada de APIs

---

## 📝 EJEMPLOS DE USO

### **1. Crear un Usuario:**

```bash
curl -X POST http://localhost:3000/api/v1/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "password": "password123"
  }'
```

### **2. Crear un Asiento Contable:**

```bash
curl -X POST http://localhost:3000/api/v1/asientos \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2024-01-15",
    "numero_comprobante": "COMP-001",
    "glosa": "Venta de productos",
    "tipo_asiento": "Ingreso",
    "id_empresa": 1,
    "id_gestion": 1,
    "detalles": [
      {
        "id_cuenta": 1,
        "debe": 1000,
        "haber": 0,
        "moneda": "BOB"
      },
      {
        "id_cuenta": 2,
        "debe": 0,
        "haber": 1000,
        "moneda": "BOB"
      }
    ]
  }'
```

---

Este sistema representa una implementación robusta y escalable de un sistema de contabilidad moderno, siguiendo las mejores prácticas de desarrollo backend y arquitectura de software. Está diseñado para manejar las necesidades contables de empresas medianas y grandes, con capacidad de auditoría completa y soporte para operaciones complejas.
