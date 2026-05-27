const express = require('express');
const { body, param, query } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Validación para obtener tareas: filtros opcionales por estado y prioridad

router.get(
  '/',
  [
    query('status').optional().isIn(['pendiente', 'completada']).withMessage('Estado inválido'),
    query('priority').optional().isIn(['alta', 'media', 'baja']).withMessage('Prioridad inválida'),
  ],
  getTasks
);

// Validación para crear tarea: título requerido, descripción opcional, prioridad

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty().withMessage('El título es requerido')
      .isLength({ max: 200 }).withMessage('El título no puede superar 200 caracteres'),
    body('description')
      .optional({ nullable: true })
      .isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres'),
    body('priority')
      .optional()
      .isIn(['alta', 'media', 'baja']).withMessage('Prioridad inválida'),
  ],
  createTask
);

// Validación para actualizar tarea: al menos un campo requerido

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('ID de tarea inválido'),
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('El título no puede estar vacío')
      .isLength({ max: 200 }).withMessage('El título no puede superar 200 caracteres'),
    body('description')
      .optional({ nullable: true })
      .isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres'),
    body('status')
      .optional()
      .isIn(['pendiente', 'completada']).withMessage('Estado inválido'),
    body('priority')
      .optional()
      .isIn(['alta', 'media', 'baja']).withMessage('Prioridad inválida'),
  ],
  updateTask
);

// Función para eliminar tarea por ID con validación

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID de tarea inválido')],
  deleteTask
);

module.exports = router;
