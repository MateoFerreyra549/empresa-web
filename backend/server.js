const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Sirve el frontend (carpeta "front") como archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'front')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'empresa_solvex'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    return;
  }
  console.log('Conectado a MySQL');
});


app.get('/api/servicios', (req, res) => {
  const sql = 'SELECT id, nombre, descripcion, icono, precio FROM servicios WHERE activo = 1';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los servicios' });
    res.json(results);
  });
});

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/consultas', (req, res) => {
  const { nombre, email, telefono, asunto, mensaje, id_servicio } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (!REGEX_EMAIL.test(String(email).trim())) {
    return res.status(400).json({ error: 'El email no tiene un formato válido' });
  }
  if (String(mensaje).trim().length < 10) {
    return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres' });
  }

  const sql = `INSERT INTO consultas (nombre, email, telefono, asunto, mensaje, id_servicio)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const valores = [
    String(nombre).trim(),
    String(email).trim(),
    telefono ? String(telefono).trim() : null,
    String(asunto).trim(),
    String(mensaje).trim(),
    id_servicio || null
  ];

  db.query(sql, valores, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al guardar la consulta' });
    res.status(201).json({ id: result.insertId, mensaje: 'Consulta guardada correctamente' });
  });
});

const sesiones = new Map(); // token -> datos del admin

function verificarToken(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const sesion = sesiones.get(token);
  if (!sesion) return res.status(401).json({ error: 'No autorizado' });
  req.admin = sesion;
  req.token = token;
  next();
}

app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Completá usuario y contraseña' });
  }

  const sql = `SELECT id, usuario, nombre FROM administradores
               WHERE usuario = ? AND password_hash = SHA2(?, 256)`;
  db.query(sql, [usuario, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = crypto.randomUUID();
    sesiones.set(token, { id: results[0].id, usuario: results[0].usuario });
    res.json({ token, nombre: results[0].nombre });
  });
});

app.post('/api/logout', verificarToken, (req, res) => {
  sesiones.delete(req.token);
  res.json({ mensaje: 'Sesión cerrada' });
});


app.get('/api/consultas', verificarToken, (req, res) => {
  const { leida, fecha, q } = req.query;
  let sql = 'SELECT id, nombre, email, asunto, fecha, leida FROM consultas WHERE 1=1';
  const valores = [];

  if (leida === '0' || leida === '1') {
    sql += ' AND leida = ?';
    valores.push(leida);
  }
  if (fecha) {
    sql += ' AND DATE(fecha) = ?';
    valores.push(fecha);
  }
  if (q) {
    sql += ' AND (nombre LIKE ? OR email LIKE ?)';
    valores.push(`%${q}%`, `%${q}%`);
  }
  sql += ' ORDER BY fecha DESC';

  db.query(sql, valores, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las consultas' });
    res.json(results);
  });
});


app.get('/api/consultas/:id', verificarToken, (req, res) => {
  const sql = `SELECT c.*, s.nombre AS servicio
               FROM consultas c
               LEFT JOIN servicios s ON c.id_servicio = s.id
               WHERE c.id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la consulta' });
    if (results.length === 0) return res.status(404).json({ error: 'Consulta no encontrada' });
    res.json(results[0]);
  });
});

app.patch('/api/consultas/:id/leida', verificarToken, (req, res) => {
  const leida = req.body.leida ? 1 : 0;
  const leidaPor = leida ? req.admin.id : null;

  db.query(
    'UPDATE consultas SET leida = ?, leida_por = ? WHERE id = ?',
    [leida, leidaPor, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Consulta no encontrada' });
      res.json({ mensaje: 'Estado actualizado', leida });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
