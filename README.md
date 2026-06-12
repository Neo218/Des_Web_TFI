# TPIF - Sistema de Gestión de Proyectos

Sistema de gestión de proyectos para consultoras con control de tareas, clientes y usuarios.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Deploy](#deploy)
- [API Documentation](#api-documentation)

## 🛠 Tecnologías

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **PM2** - Gestión de procesos

### Frontend
- **Angular 21** - Framework frontend
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva

### Deploy
- **nginx** - Servidor web
- **PM2** - Process manager

## 📁 Estructura del Proyecto

```
Entrega/
├── backend/                    # API REST NestJS
│   ├── src/
│   │   ├── auth/              # Autenticación y JWT
│   │   ├── clientes/          # Gestión de clientes
│   │   ├── proyectos/         # Gestión de proyectos
│   │   ├── tareas/            # Gestión de tareas
│   │   ├── usuarios/          # Gestión de usuarios
│   │   ├── historial/         # Auditoría de cambios
│   │   ├── entities/          # Entidades TypeORM
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── main.ts            # Punto de entrada
│   │   └── app.module.ts      # Módulo principal
│   ├── .env                   # Variables de entorno
│   ├── ecosystem.config.js    # Configuración PM2
│   └── package.json           # Dependencias
│
├── frontend/                   # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Servicios core (auth, guards)
│   │   │   ├── features/      # Módulos de funcionalidad
│   │   │   │   ├── auth/      # Login
│   │   │   │   ├── clientes/  # CRUD Clientes
│   │   │   │   ├── proyectos/ # CRUD Proyectos
│   │   │   │   ├── tareas/    # CRUD Tareas
│   │   │   │   ├── historial/ # Historial de cambios
│   │   │   │   └── home/      # Dashboard con estadísticas
│   │   │   ├── shared/        # Componentes compartidos
│   │   │   └── models/        # Modelos de datos
│   │   ├── app.config.ts      # Configuración app
│   │   └── app.routes.ts      # Rutas
│   └── package.json           # Dependencias
│
├── deploy/                     # Configuración deploy
│   └── nginx/
│       └── des-web-tfi.conf   # Config nginx
│
└── TPIF_BASE_COMPLETA.sql     # Script base de datos
```

## ✨ Funcionalidades

### Requerimientos Iniciales

| Funcionalidad | Descripción |
|--------------|-------------|
| **Login** | Acceso con credenciales (usuario/clave) |
| **Gestión de Usuarios** | CRUD completo con roles (ADMIN/USUARIO) |
| **Gestión de Clientes** | CRUD con validaciones de negocio |
| **Gestión de Proyectos** | CRUD con relación a clientes y tareas |
| **Gestión de Tareas** | CRUD por proyecto con estados |

### Funcionalidades Adicionales

| Funcionalidad | Descripción |
|--------------|-------------|
| **Historial de Cambios** | Auditoría completa de todas las modificaciones |
| **Estadísticas** | Dashboard con métricas y KPIs |
| **Exportación CSV** | Descarga de tareas en formato CSV |
| **Búsqueda Avanzada** | Filtrado por nombre, estado, proyecto |
| **Panel Visual de Tareas** | Vista agrupada por proyecto |
| **Fecha Objetivo** | Tracking de plazos de proyectos |
| **Datos de Contacto** | Teléfono, email y dirección de clientes |
| **API Documentation** | Swagger UI en `/api/docs` |

### Validaciones de Negocio

- Solo se pueden asignar **clientes ACTIVOS** a proyectos
- No se puede dar de **baja a un cliente** con proyectos relacionados
- No se puede **eliminar un proyecto** con tareas asociadas
- Todos los registros son visibles para todos los usuarios

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- nginx (para deploy)

### Backend

```bash
cd backend
npm install
npm run start:dev    # Desarrollo
npm run start:prod   # Producción
```

### Frontend

```bash
cd frontend
npm install
npm start            # Desarrollo
npm run build        # Producción
```

### Base de Datos

```bash
# Ejecutar el script SQL en PostgreSQL
psql -U postgres -d gestion_proyectos -f TPIF_BASE_COMPLETA.sql
```

## ⚙️ Configuración

### Backend (`.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gestion_proyectos
PORT=3000
JWT_SECRET=tu_clave_secreta_aqui
```

### Credenciales por Defecto

| Usuario | Clave | Rol |
|---------|-------|-----|
| `usuario` | `clave` | USUARIO |
| `admin` | `admin123` | ADMIN |

## 📦 Deploy

### Backend con PM2

```bash
cd backend
npm run pm2:start    # Iniciar
npm run pm2:stop     # Detener
npm run pm2:restart  # Reiniciar
pm2 logs             # Ver logs
```

### Frontend con nginx

1. Compilar frontend:
```bash
cd frontend
npm run deploy       # Copia archivos a nginx
```

2. Configurar nginx (copiar `deploy/nginx/des-web-tfi.conf`)

3. Iniciar nginx:
```bash
cd C:\nginx-1.31.1
nginx -s reload
```

## 📚 API Documentation

Una vez iniciado el backend, acceder a:

```
http://localhost:3000/api/docs
```

Swagger UI permite probar todos los endpoints de la API de forma interactiva.

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login y obtención de token |
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/clientes` | Crear cliente |
| GET | `/api/clientes/activos` | Listar clientes activos |
| POST | `/api/proyectos` | Crear proyecto |
| GET | `/api/proyectos/:id/tareas` | Ver tareas de proyecto |
| POST | `/api/tareas` | Crear tarea |
| GET | `/api/historial` | Ver historial de cambios |

## 🔄 Changelog - Últimos Cambios

### v1.0.0 (2026-06-12)

#### Backend
- ✅ Configuración de Swagger para documentación de API
- ✅ `synchronize: true` en TypeORM para creación automática de tablas
- ✅ Limpiado de comentarios redundantes
- ✅ Optimización de código

#### Frontend
- ✅ Validaciones de formulario con feedback visual
  - Email: formato válido requerido
  - Teléfono: solo números (7-15 dígitos)
  - Mensajes de error en rojo bajo cada campo
- ✅ Manejo de errores unificado con `errorMessage`/`successMessage`
- ✅ Eliminación de `console.log` en producción
- ✅ Limpiado de comentarios obvios

#### Base de Datos
- ✅ Script SQL actualizado con todos los campos
  - `usuarios.rol` - Gestión de roles
  - `clientes.direccion` - Datos de contacto
  - `proyectos.fecha_objetivo` - Tracking de plazos
- ✅ Índices para optimización de consultas
- ✅ Usuario admin adicional (admin/admin123)

#### Deploy
- ✅ Configuración nginx + PM2 lista
- ✅ Carpeta `Entrega` con solo archivos necesarios

---

**Desarrollado para:** Trabajo Práctico Integrador Final - Desarrollo de Aplicaciones Web
**Fecha:** Junio 2026
