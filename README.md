Para levantar el proyecto 
  Backend

  cd github/backend

  # Instalar dependencias
  npm install

  # Crear archivo .env
  cp .env.example .env

  # Editar .env con tus datos:
  # - DB_HOST=localhost
  # - DB_PASSWORD=tu_contraseña_postgres
  # - JWT_SECRET=una_clave_secreta

  # Iniciar
  npm run start:dev

  Backend corre en http://localhost:3000

  Frontend

  cd github/frontend

  # Instalar dependencias
  npm install

  # Iniciar
  npm start

  Frontend corre en http://localhost:4200

  Requisitos

  - Node.js 20+
  - npm 11+
  - PostgreSQL corriendo con base de datos gestion_proyectos creada

dejo la DB y el .ENV que use


Backend (NestJS)
Archivos de configuración

package.json — Dependencias y scripts 
package-lock.json — Versiones de dependencias
tsconfig.json — Config de TypeScript
nest-cli.json — Config de la CLI de NestJS
.prettierrc — Config formato de código
eslint.config.mjs — Configu linting (análisis de código)

src/ — Estructura principal
main.ts — Punto de entrada, inicia el servidor
app.module.ts — Módulo raíz que conecta todos los módulos

auth/ — Autenticación
auth.controller.ts — Recibe peticiones de login (/api/auth/login)
auth.service.ts — Lógica: valida credenciales, genera JWT
auth.module.ts — Configura el módulo de autenticación
jwt.strategy.ts — Estrategia Passport-JWT para validar tokens
jwt-auth.guard.ts — Guard: protege rutas que requieren login
dto/login.dto.ts — Define estructura del login (email, password)

clientes/ — Gestión de Clientes
clientes.controller.ts — Endpoints CRUD de clientes
clientes.service.ts — Lógica de negocio de clientes
clientes.module.ts — Configura el módulo
entities/cliente.entity.ts — Modelo de tabla en BD
dto/create-cliente.dto.ts — Validación para crear cliente
dto/update-cliente.dto.ts — Validación para actualizar

proyectos/ — Gestión de Proyectos
proyectos.controller.ts — Endpoints CRUD de proyectos
proyectos.service.ts — Lógica con relaciones a clientes
entities/proyecto.entity.ts — Tabla proyectos (relación con clientes)
dto/ — Validaciones de entrada

tareas/ — Gestión de Tareas
tareas.controller.ts — Endpoints CRUD de tareas
tareas.service.ts — Lógica con relaciones a proyectos
entities/tarea.entity.ts — Tabla tareas (PENDIENTE/FINALIZADA/BAJA)

Frontend (Angular)
Archivos de configuración (raíz)

package.json — Dependencias (@angular, rxjs, etc.)
angular.json — Configuración del proyecto Angular
tsconfig*.json — Configuración TypeScript

src/app/ — Estructura principal
main.ts — Punto de entrada de Angular
app.config.ts — Configuración global (proveedores)
app.routes.ts — Rutas de la aplicación
app.ts — Componente raíz

core/ — Funcionalidad compartida
guards/auth.guard.ts — Protege rutas: requiere login
interceptors/auth-interceptor.ts — Agrega token JWT a las peticiones
services/auth-store.ts — Guarda token en localStorage

features/auth/login/ — Login
login.ts — Componente: formulario y lógica
login.html — Template del formulario
login.css — Estilos del login
login-api-client.ts — Servicio que llama al backend

features/clientes/ — Gestión de Clientes
clientes.component.ts — Lógica (listar, crear, editar, eliminar)
clientes.component.html — Vista con tabla y formularios
clientes.component.css — Estilos
cliente.service.ts — Servicio HTTP al backend
cliente.model.ts — Interface de Cliente

features/proyectos/ — Gestión de Proyectos
proyectos.component.* — Vista principal de proyectos
proyecto.service.ts — Servicio HTTP
proyecto.model.ts — Interfaces
proyecto-tareas.component.* — Vista de tareas de un proyecto

features/tareas/ — Gestión de Tareas
tareas.component.ts — Lógica de tareas agrupadas por proyecto
tareas.component.html — Cards agrupadas por proyecto
tareas.component.css — Grid layout y estilos
tarea.service.ts — Servicio HTTP
tarea.model.ts — Enum de estados

features/layout/ — Layout compartido
layout.component.* — Barra lateral con navegación



# Des_Web_TFI

Desarrollo de Aplicaciones Web - 2026 Tecnicatura Universitaria en Desarrollo Web


Trabajo Final Integrador 


OBJETIVOS:

Se busca que el estudiante ponga en práctica todos los conocimientos adquiridos durante el
cursado de la asignatura, logrando el desarrollo de una aplicación web.

CONSIDERACIONES:

● El trabajo debe ser realizado en forma grupal. Cada grupo podrá contar con un
mínimo de 4 estudiantes y un máximo de 6 estudiantes.

● Las soluciones deben ser de autoría propia. Aquellas que se detecten como idénticas
entre diferentes grupos o que evidencien ser idénticas a las de un tercero serán
clasificadas como desaprobadas para todos los involucrados.

● Además de las consignas presentadas en el enunciado, cada integrante debe agregar
una funcionalidad adicional de su elección al sistema.

● Se deberá entregar un video de entre 8 y 12 minutos donde se exponga el
funcionamiento del sistema. Un integrante debe ser el responsable de presentar el
funcionamiento general, exponiendo la forma en que se cumplieron los objetivos
planteados en las consignas base.

● Es obligatorio que todos los integrantes del grupo participen del video, con cámara y
micrófono, y expongan, cuanto mínimo, la funcionalidad adicional que agregaron,
aclarando su nombre y apellido.

● Las entregas realizadas en el campus deberán consistir de una carpeta comprimida con
formato .zip, respetando las fechas límite publicadas. Las entregas deben contener
tanto el código fuente del sistema como el enlace al vídeo.

● El trabajo final será calificado de forma grupal como aprobado / desaprobado.


ENUNCIADO:

La consultora en la que usted realiza su pasantía ha decidido iniciar el desarrollo de un
sistema de gestión de proyectos que tiene como objetivo principal destacar por su
simplicidad.

Como parte del equipo de desarrollo, usted y su grupo han sido seleccionados para llevar
adelante este proyecto, el cual servirá como evaluación clave para determinar su contratación
en la empresa.

📌 Requerimientos iniciales

🔹 Acceso:

● Se deben proporcionar las credenciales de un usuario válido para ingresar al sistema.
Las propiedades de un usuario son su nombre de usuario, su clave, y su estado
(Activo o baja).

🔹 Gestión de proyectos:

● Se debe poder crear y modificar proyectos, así como también ver el detalle de las
tareas que componen cada proyecto y el cliente al que corresponde. Las propiedades
principales de un proyecto son su nombre y estado (Activo, finalizado o baja).

🔹 Gestión de clientes:

● Al crear o modificar un proyecto, se puede especificar el cliente correspondiente si
aplica (solo se puede elegir cliente en estado “Activo”), o no especificar ninguno si es
un proyecto interno de la empresa. Se debe poder crear y modificar clientes de forma
sencilla como parte del proceso de gestión de proyectos. Un cliente tiene como
propiedades su nombre y su estado (Activo o baja). Solo se puede dar de baja un
cliente si el mismo no está registrado en ningún proyecto.

🔹 Gestión de tareas:

● Dado un proyecto ya creado, se debe poder agregar, modificar y eliminar tareas. Cada
tarea tiene como propiedades su descripción y estado (Pendiente, finalizado o baja).

🔹 Restricciones de visualización:

● Todos los proyectos, clientes, y tareas son visibles para todos los usuarios de una
instalación del sistema. Los usuarios no son propietarios de los registros creados.

📌 Objetivo del Trabajo

Se espera que el equipo diseñe e implemente un sistema funcional que cumpla con estos
requerimientos, aplicando buenas prácticas de desarrollo de software y asegurando una
experiencia fluida para los usuarios.
Para el desarrollo se deben utilizar las siguientes tecnologías: NestJS, TypeORM,
PostgreSQL, nginx, PM2, y Angular.
