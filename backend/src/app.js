require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));


app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

async function waitForDb(retries = 10, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Base de datos conectada');
      return;
    } catch {
      console.log(`  Esperando base de datos... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
}

waitForDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error fatal:', err.message);
    process.exit(1);
  });

module.exports = app;
