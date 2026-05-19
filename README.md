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
