# Des_Web_TFI

Sistema web de gestion de proyectos desarrollado como Trabajo Final Integrador de
Desarrollo de Aplicaciones Web.

La aplicacion permite administrar clientes, proyectos y tareas, con autenticacion,
base de datos PostgreSQL, frontend Angular, backend NestJS, despliegue con nginx y
ejecucion productiva del backend con PM2.

# Integrantes
- Matias Vespa
- Marcos Gabriel Gainza
- Daniel Marcelo Cisnero
- Melina Johanna Lisette Casco
- Jose Ignacio Debuck
- Maria Gabriela Olivares Contreras

## Tecnologias utilizadas

- Angular
- NestJS
- TypeORM
- PostgreSQL
- nginx
- PM2
- Node.js / npm

## Funcionalidades principales

- Login de usuario con JWT.
- Gestion de clientes.
- Gestion de proyectos.
- Gestion de tareas por proyecto.
- Relacion entre clientes, proyectos y tareas.
- Restriccion de acciones segun estados de los registros.
- Visualizacion compartida de la informacion para todos los usuarios del sistema.

## Extras implementados

- Exportacion de datos en CSV desde la pantalla de tareas.
- Estadisticas generales desde la pantalla de inicio.
- Historial de cambios por entidad, registrando accion, usuario y fecha.
- Configuracion de despliegue con nginx y PM2.

## Capturas

Las siguientes capturas muestran pantallas principales del sistema.

<img width="1920" height="917" alt="Inicio" src="https://github.com/user-attachments/assets/2b800399-0c70-490a-802e-894b20c3879f" />

<img width="1920" height="917" alt="Clientes" src="https://github.com/user-attachments/assets/dc836f2b-69e9-469b-bb07-131e78c13d76" />

<img width="1920" height="1154" alt="Proyectos" src="https://github.com/user-attachments/assets/934e4466-5247-4ffe-b2dc-c5e74a3252dc" />

<img width="1920" height="917" alt="Tareas" src="https://github.com/user-attachments/assets/c8e4d62f-6567-428a-bcba-cd827bbba913" />

<img width="1920" height="917" alt="Estadisticas" src="https://github.com/user-attachments/assets/2898e347-9253-4f9c-9ed0-2d2175473e07" />

<img width="1920" height="917" alt="Historial" src="https://github.com/user-attachments/assets/0a3a5426-b772-4daa-9072-31c047ad91a8" />

<img width="1920" height="917" alt="Exportacion CSV" src="https://github.com/user-attachments/assets/1896d7ce-3785-4548-8801-2858096f59b7" />

Si se agregan nuevas imagenes al repositorio, se recomienda guardarlas en
`docs/imagenes/` y referenciarlas desde este README con rutas relativas.

## Requisitos previos

Antes de ejecutar el proyecto, instalar:

- Node.js 20 o superior.
- npm.
- PostgreSQL.
- nginx, solo para prueba productiva.
- PM2, solo para prueba productiva.

En Windows, si PowerShell bloquea scripts de npm, usar `npm.cmd` en lugar de `npm`.

## Base de datos

1. Crear una base de datos PostgreSQL llamada:

```sql
gestion_proyectos
```

2. Ejecutar el script incluido en la raiz del proyecto:

```text
Script_BD_fixed.sql
```

Ese script crea las tablas necesarias y carga el usuario inicial.

Credenciales de prueba:

```text
usuario / clave
```

## Variables de entorno del backend

Crear el archivo `backend/.env` tomando como base `backend/.env.example`.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_clave_postgres
DB_DATABASE=gestion_proyectos

JWT_SECRET=una_clave_secreta
PORT=3000
```

Cambiar `DB_PASSWORD` por la clave real de PostgreSQL de la computadora donde se
ejecute el proyecto.

## Instalacion

Desde la raiz del proyecto, instalar dependencias del backend:

```powershell
cd backend
npm.cmd install
```

Instalar dependencias del frontend:

```powershell
cd ../frontend
npm.cmd install
```

## Ejecucion en desarrollo

Levantar el backend:

```powershell
cd backend
npm.cmd run start:dev
```

El backend queda disponible en:

```text
http://localhost:3000
```

Levantar el frontend:

```powershell
cd frontend
npm.cmd start
```

El frontend queda disponible en:

```text
http://localhost:4200
```

En desarrollo, Angular usa `frontend/proxy.conf.json` para redirigir las llamadas
`/api` hacia el backend NestJS.

## Ejecucion productiva con nginx y PM2

Este flujo cumple con el esquema:

```text
Navegador -> nginx -> Angular
Navegador -> nginx /api -> NestJS con PM2 -> PostgreSQL
```

### 1. Backend con PM2

Desde la carpeta `backend`:

```powershell
npm.cmd install
npm.cmd run pm2:start
```

Comandos utiles:

```powershell
pm2.cmd list
npm.cmd run pm2:restart
npm.cmd run pm2:stop
```

El archivo de configuracion de PM2 es:

```text
backend/ecosystem.config.js
```

### 2. Frontend compilado para nginx

Desde la carpeta `frontend`:

```powershell
npm.cmd install
npm.cmd run deploy
```

El comando `deploy` compila Angular y copia los archivos generados a:

```text
C:/nginx-1.31.1/html
```

Si nginx esta instalado en otra carpeta, ajustar el script `nginx:copy` en
`frontend/package.json`.

### 3. Configuracion de nginx

El proyecto incluye una configuracion base en:

```text
deploy/nginx/des-web-tfi.conf
```

Esa configuracion sirve el frontend Angular y redirige `/api` al backend en
`http://127.0.0.1:3000/api`.

Para usarla, copiar su contenido al archivo `nginx.conf` de la instalacion local de
nginx, o incluirla desde la configuracion principal.

Ejemplo de ubicacion usada en Windows:

```text
C:/nginx-1.31.1/conf/nginx.conf
```

Luego iniciar o reiniciar nginx.

Con nginx y PM2 funcionando, abrir:

```text
http://localhost
```

## Pruebas rapidas

Verificar backend por PM2:

```powershell
pm2.cmd list
```

Verificar la app productiva:

```text
http://localhost
```

Verificar la app en desarrollo:

```text
http://localhost:4200
```

Login de prueba:

```text
usuario / clave
```

## Estructura del proyecto

```text
Des_Web_TFI/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/         # Login, JWT y proteccion de rutas
│   │   ├── clientes/     # CRUD de clientes
│   │   ├── proyectos/    # CRUD de proyectos
│   │   ├── tareas/       # CRUD de tareas
│   │   ├── usuarios/     # Gestion de usuarios
│   │   └── historial/    # Registro de cambios
│   ├── .env.example
│   └── ecosystem.config.js
├── frontend/             # Aplicacion Angular
│   ├── src/app/
│   │   ├── core/         # Guards, interceptores y servicios compartidos
│   │   └── features/     # Pantallas principales
│   └── proxy.conf.json
├── deploy/
│   ├── README.md
│   └── nginx/
│       └── des-web-tfi.conf
├── Script_BD_fixed.sql
└── README.md
```

## Pantallas del sistema

- Inicio: muestra metricas generales y estadisticas.
- Clientes: permite crear, editar y dar de baja clientes.
- Proyectos: permite administrar proyectos y su cliente asociado.
- Tareas: permite administrar tareas y exportarlas a CSV.
- Historial: permite consultar acciones realizadas sobre los registros.

## Notas para entrega

- El proyecto debe ejecutarse con PostgreSQL activo.
- El archivo `backend/.env` debe configurarse en cada computadora.
- La carpeta `node_modules` no se sube al repositorio.
- Las carpetas `dist` son generadas por los comandos de build.
- Para una prueba productiva, usar `http://localhost`.
- Para una prueba de desarrollo, usar `http://localhost:4200`.

