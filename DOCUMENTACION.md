# Documentación del proyecto – Solvex

**Materia:** Programación IV (7mo) · **Docente:** Verónica Godoy
**Proyecto:** Sitio web corporativo de Solvex con formulario de consultas y panel de administración.

Este documento se completa a medida que se avanza en el proyecto. Cada problema se anota con lo que se probó y cómo se resolvió, para poder explicarlo en la defensa oral.

---

## 1. Resumen del proyecto

Solvex es una empresa de asistencia informática (hardware, software, redes, programación y optimización de equipos). El sitio presenta la empresa y sus servicios, y permite enviar consultas que se guardan en MySQL. Un panel de administración protegido permite leerlas y gestionarlas.

- **Frontend:** HTML5, CSS3 y JavaScript puro (sin frameworks).
- **Backend:** Node.js + Express, API REST.
- **Base de datos:** MySQL en XAMPP (`empresa_solvex`), conexión con `mysql2` usando `createConnection`.
- **Instalación y uso:** ver `README.md`.

## 2. Decisiones técnicas y por qué

| Decisión | Motivo |
|---|---|
| `createConnection` y no pool | La consigna lo exige; además es un solo servidor con poco tráfico, una conexión simple alcanza. |
| Consultas con `?` (parametrizadas) | Evitan la inyección SQL. |
| `escaparHTML` en el frontend | Los datos de la base se muestran como texto y no se interpretan como HTML (evita XSS). |
| Validación en cliente y en servidor | El navegador da respuesta rápida, pero solo el servidor es confiable. |
| Token aleatorio guardado en memoria | Es simple y alcanza para el alcance del proyecto. Limitación: se pierde al reiniciar el servidor. |
| Hash SHA-256 con `SHA2()` de MySQL | No se usa bcrypt porque el stack pedido no lo incluye. Limitación: no lleva sal. |
| Animaciones con CSS y un poco de JS | Sin librerías extra. Se desactivan si el usuario pidió reducir el movimiento. |

## 3. Bitácora de problemas

### 3.1 `node` y `npm` no se reconocían en la notebook nueva
- **Síntoma:** `The term 'node' is not recognized as the name of a cmdlet...`
- **Qué probé:** correr `node -v`, `npm install` y `node backend/server.js` en la terminal de VS Code.
- **Causa:** Node.js no estaba instalado en esa PC.
- **Solución:** instalar Node.js (versión LTS) desde nodejs.org, cerrar y volver a abrir VS Code, y comprobar con `node -v` y `npm -v`.

### 3.2 PowerShell bloqueaba los scripts de npm
- **Síntoma:** `npm.ps1 cannot be loaded because running scripts is disabled on this system`.
- **Causa:** la política de ejecución de PowerShell no permitía correr scripts.
- **Solución:** `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (alternativas: usar `npm.cmd` o la terminal Command Prompt).

### 3.3 Faltaban las dependencias en la PC nueva
- **Causa:** al pasar la carpeta del proyecto no estaban instaladas las dependencias.
- **Solución:** `npm install` lee `package.json` y reinstala `express`, `mysql2` y `cors`. `node_modules` no se sube a GitHub (está en `.gitignore`).

### 3.4 Migración de la base de datos entre computadoras
- **Qué hice:** exporté la base desde phpMyAdmin (archivo `.sql`) y la importé en la PC nueva.
- **Problema:** en phpMyAdmin se veían dos entradas, `empresa` y `empresa_db`, y parecía que la importación había quedado mal.
- **Qué descubrí:** phpMyAdmin agrupa visualmente las bases con el mismo prefijo; eran dos bases distintas.
- **Problema 2:** después de ejecutar `CREATE DATABASE` y `USE` las tablas dejaron de verse. No determiné la causa.
- **Solución:** reimportar el `.sql` y verificar en la pestaña Estructura que estuvieran las tablas `administradores`, `consultas` y `servicios`. Renombré la base a `empresa_solvex` y actualicé `database` en `backend/server.js` para que coincida.

### 3.5 Caracteres raros en el archivo `.sql`
- **Síntoma:** un servicio mostraba "protecci?n" en lugar de "protección".
- **Solución:** corregir el texto y declarar `utf8mb4` en el `.sql` (`SET NAMES utf8mb4`, y tablas con `utf8mb4_unicode_ci`).

### 3.6 El logo no se veía bien en el encabezado
- **Síntoma:** el logo tiene fondo blanco y partes gris oscuro; sobre el encabezado oscuro casi no se veía y era muy chico.
- **Solución:** encabezado blanco, una versión del logo solo con el emblema para el encabezado y otra completa para el Inicio y el login.

### 3.7 (Próximos problemas se anotan acá)
- **Síntoma:**
- **Qué probé:**
- **Causa:**
- **Solución:**

## 4. Posibles mejoras futuras

- Guardar las contraseñas con **bcrypt** (con sal) en lugar de SHA-256.
- Reemplazar el token en memoria por **JWT** con vencimiento.
- Paginación en el listado de consultas.
- Envío de un correo de aviso al recibir una consulta.
- Alta, baja y modificación de servicios desde el panel.
