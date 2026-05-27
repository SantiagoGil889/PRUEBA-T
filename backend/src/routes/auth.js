const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Solo se permiten letras, números y guiones bajos'),
    body('email')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  login
);

module.exports = router;
