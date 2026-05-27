const { validationResult } = require('express-validator');
const pool = require('../config/db');

const getTasks = async (req, res) => {
  const { status, priority } = req.query;
  const params = [req.user.id];
  let query = 'SELECT * FROM tasks WHERE id_usuario = $1';
  let idx = 2;

  if (status) {
    query += ` AND status = $${idx++}`;
    params.push(status);
  }
  if (priority) {
    query += ` AND priority = $${idx++}`;
    params.push(priority);
  }
  query += ' ORDER BY fecha_creacion DESC';

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('getTasks:', err.message);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, priority = 'media' } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, priority, id_usuario)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, priority, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createTask:', err.message);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    const check = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND id_usuario = $2',
      [id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const { rows } = await pool.query(
      `UPDATE tasks SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         priority    = COALESCE($4, priority)
       WHERE id = $5 AND id_usuario = $6
       RETURNING *`,
      [title ?? null, description ?? null, status ?? null, priority ?? null, id, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('updateTask:', err.message);
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND id_usuario = $2 RETURNING id',
      [id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error('deleteTask:', err.message);
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
