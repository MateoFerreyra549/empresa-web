# Solvex - Sitio web corporativo con panel de administración

Proyecto de la acreditación de **Programación IV** (7mo año).
Sitio web de **Solvex – Asistencia Informática** ("Tu problema, nuestra solución") que presenta la empresa y sus servicios, permite enviar consultas desde un formulario y las guarda en una base de datos MySQL. Incluye un panel de administración protegido para leerlas y gestionarlas.

## Tecnologías

- **Frontend:** HTML5, CSS3 y JavaScript (sin frameworks)
- **Backend:** Node.js + Express
- **Base de datos:** MySQL (XAMPP), con `mysql2` usando `createConnection` (conexión simple, sin pool)
- **Módulos Node:** `express`, `mysql2`, `cors`, `path`

## Estructura del proyecto

```
empresa-web/
├── backend/
│   └── server.js        # API REST y servidor de archivos estáticos
├── front/
│   ├── index.html       # Inicio
│   ├── nosotros.html    # Misión, visión y valores
│   ├── servicios.html   # Servicios (se cargan desde la BD)
│   ├── contacto.html    # Formulario de consultas
│   ├── admin/
│   │   ├── login.html   # Login del panel
│   │   └── panel.html   # Panel de consultas
│   ├── css/estilos.css
│   ├── js/              # main.js, login.js, panel.js
│   └── img/logo.png
├── database.sql         # Estructura y datos iniciales de la base
├── package.json
└── README.md
```

## Cómo ponerlo en marcha

### 1. Requisitos
- [Node.js](https://nodejs.org) (versión LTS)
- [XAMPP](https://www.apachefriends.org) con MySQL

### 2. Base de datos
1. Abrí XAMPP e iniciá **MySQL** (y **Apache** si querés usar phpMyAdmin).
2. Entrá a `http://localhost/phpmyadmin`.
3. Pestaña **Importar** → elegí `database.sql` → **Importar**.
   El archivo crea la base `empresa_solvex` con sus tablas y datos de ejemplo.

> Si la base `empresa_solvex` ya existe, el archivo borra y recrea sus tablas.

### 3. Dependencias y servidor
```bash
npm install
npm start
```
Si todo va bien, la terminal muestra `Conectado a MySQL` y `Servidor corriendo en http://localhost:3000`.

La conexión a MySQL está en `backend/server.js` (usuario `root`, sin contraseña, base `empresa_solvex`, valores por defecto de XAMPP).

### 4. Usar el sitio
- Sitio público: http://localhost:3000
- Panel de administración: http://localhost:3000/admin/login.html

**Usuario de prueba:** `admin`  
**Contraseña de prueba:** `admin123`

## API REST

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/servicios` | Público | Lista los servicios activos |
| POST | `/api/consultas` | Público | Guarda una consulta nueva |
| POST | `/api/login` | Público | Valida usuario y contraseña; devuelve un token |
| POST | `/api/logout` | Admin | Cierra la sesión |
| GET | `/api/consultas` | Admin | Lista consultas (filtros: `leida`, `fecha`, `q`) |
| GET | `/api/consultas/:id` | Admin | Detalle de una consulta |
| PATCH | `/api/consultas/:id/leida` | Admin | Marca como leída / no leída |

Las rutas de administrador requieren el encabezado `Authorization: Bearer <token>`.

## Decisiones técnicas

- **`createConnection` en lugar de pool:** el proyecto tiene un solo servidor y poco tráfico, así que una conexión simple alcanza y es más fácil de entender.
- **Consultas parametrizadas (`?`):** evitan la inyección SQL.
- **Escape de HTML en el frontend:** el contenido que viene de la base se muestra como texto, para evitar XSS.
- **Validación doble:** el formulario valida en el navegador y el servidor vuelve a validar (campos obligatorios, email y largo mínimo del mensaje).
- **Autenticación:** la contraseña se guarda como hash SHA-256 y se compara con `SHA2()` en MySQL. Al iniciar sesión se genera un token aleatorio guardado en memoria del servidor.

## Limitaciones conocidas

- Las sesiones se guardan en memoria: se pierden si se reinicia el servidor y los tokens no vencen solos.
- SHA-256 sin sal es más débil que bcrypt, que sería la mejora recomendada para producción.
