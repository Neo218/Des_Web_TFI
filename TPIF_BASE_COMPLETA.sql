-- =====================================================
-- TPIF - BASE DE DATOS COMPLETA
-- Script para crear toda la estructura de la BD
-- Version: 2026-06-14 (Entrega)
-- =====================================================

-- Crear tipos ENUM (si no existen)
CREATE TYPE IF NOT EXISTS estados_usuarios AS ENUM ('ACTIVO','BAJA');
CREATE TYPE IF NOT EXISTS roles_usuarios AS ENUM ('ADMIN','USUARIO');
CREATE TYPE IF NOT EXISTS estados_clientes AS ENUM ('ACTIVO','BAJA');
CREATE TYPE IF NOT EXISTS estados_proyectos AS ENUM ('ACTIVO','FINALIZADO','BAJA');
CREATE TYPE IF NOT EXISTS estados_tareas AS ENUM ('PENDIENTE','FINALIZADA','BAJA');

-- =====================================================
-- TABLA: usuarios
-- (Incluye campo rol para gestion de permisos)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL DEFAULT 'ACTIVO',
    rol roles_usuarios NOT NULL DEFAULT 'USUARIO'
);

-- =====================================================
-- TABLA: clientes
-- (Incluye telefono, email y direccion)
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    estado estados_clientes NOT NULL DEFAULT 'ACTIVO'
);

-- =====================================================
-- TABLA: proyectos
-- (Incluye fecha_objetivo para tracking de plazos)
-- =====================================================
CREATE TABLE IF NOT EXISTS proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_proyectos NOT NULL DEFAULT 'ACTIVO',
    id_cliente INT,
    fecha_objetivo DATE,
    CONSTRAINT fk_proyectos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
);

-- =====================================================
-- TABLA: tareas
-- =====================================================
CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    estado estados_tareas NOT NULL DEFAULT 'PENDIENTE',
    id_proyecto INT NOT NULL,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: historial_cambios
-- (Registra auditoria de cambios)
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_cambios (
    id SERIAL PRIMARY KEY,
    entidad TEXT NOT NULL,
    id_registro INT,
    accion TEXT NOT NULL,
    usuario_id INT,
    usuario_nombre TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalle TEXT
);

-- =====================================================
-- EXTENSIONES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- INDICES (para mejor performance)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(id_proyecto);
CREATE INDEX IF NOT EXISTS idx_proyectos_cliente ON proyectos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_historial_entidad ON historial_cambios(entidad);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_cambios(fecha);

-- =====================================================
-- USUARIOS ADMIN
-- Usuario: admin / Clave: admin / Rol: ADMIN
-- Usuario: usuario / Clave: clave / Rol: ADMIN
-- =====================================================
INSERT INTO usuarios (nombre, clave, estado, rol)
VALUES ('admin', crypt('admin', gen_salt('bf', 10)), 'ACTIVO', 'ADMIN')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO usuarios (nombre, clave, estado, rol)
VALUES ('usuario', crypt('clave', gen_salt('bf', 10)), 'ACTIVO', 'ADMIN')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
