Acreditacion Programacion IV.

Hice una página web para **Solvex**, la empresa de asistencia informática que armé para el TPI. Tiene las secciones Inicio, Nosotros, Servicios y Contacto. También cuenta con un panel de administración para ver y gestionar las consultas que envían los usuarios a través del formulario de contacto.

## Tecnologías utilizadas

HTML, CSS y JavaScript.
Node.js y Express.
MySQL con XAMPP.
mysql2, cors y path.
Font Awesome para los íconos.

## Cómo ejecutar el proyecto

1. Tener instalados Node.js y XAMPP.
2. Abrir XAMPP e iniciar MySQL y Apache.
3. Entrar a phpMyAdmin (`http://localhost/phpmyadmin`) e importar el archivo `empresa_solvex.sql` para crear la base de datos.
4. Abrir la carpeta del proyecto en una terminal y ejecutar:

   ```bash
   npm install
   npm start
   ```

5. Entrar desde el navegador a `http://localhost:3000`.

### Panel de administración

Se puede acceder desde el enlace que aparece en la página o directamente desde:

`http://localhost:3000/admin/login.html`

**Usuario:** `admin`
**Contraseña:** `admin123`

## Cómo funciona
**Servicios:** se muestran los servicios guardados en la base de datos y cada uno tiene un botón para realizar una consulta.
**Contacto:** permite enviar consultas mediante un formulario que valida los datos antes de guardarlos en MySQL.
**Panel de administración:** permite iniciar sesión, ver las consultas, buscar y filtrar por estado, fecha o nombre/email, consultar los detalles y marcarlas como leídas o no leídas.

## Rutas de la API

`GET /api/servicios`: muestra los servicios.
`POST /api/consultas`: guarda una consulta.
`POST /api/login`: inicia sesión.
`POST /api/logout`: cierra la sesión.
`GET /api/consultas`: obtiene las consultas.
`GET /api/consultas/:id`: muestra una consulta.
`PATCH /api/consultas/:id/leida`: cambia el estado de lectura.

Las rutas de administración requieren el token obtenido al iniciar sesión.

## Archivos principales

`backend/server.js`: servidor y API.
`front/`: páginas, estilos, JavaScript e imágenes.
`database.sql`: archivo de la base de datos.
`package.json`: configuración del proyecto.
`DOCUMENTACION.md`: problemas que tuve durante el desarrollo y cómo los resolví.

## Cosas por mejorar

Usar un método más seguro para guardar las contraseñas. Actualmente utilizo SHA-256.
Guardar las sesiones de otra forma para que no se pierdan al reiniciar el servidor.