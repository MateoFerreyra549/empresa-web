-- ============================================================
-- Solvex - Base de datos del sitio web corporativo
-- Ejecutar desde phpMyAdmin (pestaña "Importar") o desde la
-- consola de MySQL. Deja la base lista para usar.
-- ATENCIÓN: si la base empresa_solvex ya existe, este archivo
-- elimina y recrea sus tablas (se pierden los datos actuales).
-- ============================================================

CREATE DATABASE IF NOT EXISTS `empresa_solvex`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `empresa_solvex`;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `consultas`;
DROP TABLE IF EXISTS `servicios`;
DROP TABLE IF EXISTS `administradores`;

-- ------------------------------------------------------------
-- Tabla: administradores
-- La contraseña se guarda como hash SHA-256 (se compara con SHA2()).
-- ------------------------------------------------------------
CREATE TABLE `administradores` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario de prueba: admin / admin123
INSERT INTO `administradores` (`id`, `usuario`, `password_hash`, `nombre`) VALUES
(1, 'admin', SHA2('admin123', 256), 'Administrador');

-- ------------------------------------------------------------
-- Tabla: servicios
-- ------------------------------------------------------------
CREATE TABLE `servicios` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `icono` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `servicios` (`id`, `nombre`, `descripcion`, `icono`, `precio`, `activo`) VALUES
(1, 'Soporte técnico', 'Diagnóstico y reparación de equipos, instalación de software y mantenimiento preventivo.', 'fa-screwdriver-wrench', 55000.00, 1),
(2, 'Redes y conectividad', 'Diseño, instalación y configuración de redes cableadas e inalámbricas para hogares y pymes.', 'fa-network-wired', NULL, 1),
(3, 'Desarrollo web', 'Sitios web a medida, responsivos y administrables para tu negocio.', 'fa-code', 150000.00, 1),
(4, 'Backups y seguridad', 'Resguardo de información y protección de tus equipos y datos.', 'fa-shield-halved', 35000.00, 1);

-- ------------------------------------------------------------
-- Tabla: consultas
-- ------------------------------------------------------------
CREATE TABLE `consultas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `asunto` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_servicio` int(10) UNSIGNED DEFAULT NULL,
  `leida_por` int(10) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_consultas_leida` (`leida`),
  KEY `idx_consultas_fecha` (`fecha`),
  KEY `idx_consultas_email` (`email`),
  KEY `fk_consultas_servicio` (`id_servicio`),
  KEY `fk_consultas_admin` (`leida_por`),
  CONSTRAINT `fk_consultas_admin` FOREIGN KEY (`leida_por`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_consultas_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Consultas de ejemplo
INSERT INTO `consultas` (`id`, `nombre`, `email`, `telefono`, `asunto`, `mensaje`, `leida`, `fecha`, `id_servicio`, `leida_por`) VALUES
(1, 'Lucía Fernández', 'lucia.fernandez@example.com', '2964 555123', 'Presupuesto para red de oficina', 'Hola, necesitamos instalar una red cableada e inalámbrica en una oficina de 8 puestos. ¿Podrían pasarme un presupuesto?', 1, '2026-10-28 14:15:00', 2, 1),
(2, 'Martín Gómez', 'martin.gomez@example.com', NULL, 'Mi computadora no enciende', 'Buenas tardes, mi notebook dejó de encender desde ayer. ¿Pueden revisarla? Gracias.', 0, '2026-11-01 10:30:00', 1, NULL),
(3, 'Carolina Ruiz', 'carolina.ruiz@example.com', '2964 555987', 'Sitio web para mi negocio', 'Quisiera una página web para mi local, con catálogo y formulario de contacto. ¿Cómo trabajan?', 0, '2026-11-02 09:00:00', 3, NULL);
