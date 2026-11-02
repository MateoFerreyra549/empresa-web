# Documentación del proyecto SOLVEX

**Materia:** Programación IV  
**Docente:** Verónica Godoy

Este documento explica como hice el proyecto, las decisiones que tomé y algunos problemas que tuve durante el desarrollo y como los solucioné.

## 1. Resumen del proyecto

Solvex es una pagina web de una empresa de asistencia informática. Tiene las secciones Inicio, Nosotros, Servicios y Contacto, además de un panel para administrar las consultas que envian los usuarios.

**Frontend:** HTML, CSS y JavaScript.
**Backend:** Node.js y Express.
**Base de datos:** MySQL con XAMPP.

## 2. Decisiones técnicas

Use `createConnection` porque lo pedia la consigna.
Use consultas parametrizadas para evitar problemas con la base de datos.
Agregué validaciones en los formularios.
Las sesiones se guardan en memoria, por eso se pierden al reiniciar el servidor.
Las contraseñas se guardan con SHA-256, aunque en el futuro se podria usar un metodo mas seguro.
Las animaciones se hicieron con CSS y JavaScript, sin instalar otras librerias.

## 3. Problemas que tuve

**Node.js no funcionaba:** no estaba instalado en la notebook nueva. Lo instalé y volví a abrir VS Code.

**Error al ejecutar npm:** PowerShell bloqueaba los scripts. Cambié la configuración o se puede usar la terminal CMD.

**Faltaban dependencias:** ejecuté `npm install` para instalar lo necesario para el proyecto.

**Problemas con la base de datos:** exporté la base desde phpMyAdmin y la importé en la otra computadora. Despues verifiqué las tablas y cambié el nombre de la base a `empresa_solvex`, actualizando tambien la configuración del servidor.

**Caracteres mal escritos:** algunos textos aparecian con signos de pregunta. Lo solucioné usando la codificación `utf8mb4`.

**El logo no se veía bien:** cambié el fondo del encabezado y usé distintas versiones del logo para que se viera mejor.

**Problemas con el login del administrador:** no podia acceder correctamente al panel y, al intentar iniciar sesión, no pasaba nada y no podia ver las consultas de los usuarios. Revisando los archivos encontré que algunos estaban nombrados como `login..js`, con dos puntos, en vez de `login.js`. Corregí el nombre y el login empezó a funcionar correctamente.

## 4. Posibles mejoras
Usar bcrypt para guardar las contraseñas de forma mas segura.
Mejorar el sistema de sesiones.
Agregar paginación a las consultas.
Enviar un correo cuando llegue una consulta nueva.
Poder agregar, editar y eliminar servicios desde el panel.