const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  user:     process.env.DB_USER     || 'todouser',
  password: process.env.DB_PASSWORD || 'todopass',
  database: process.env.DB_NAME     || 'tododb',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client', err.message);
});

module.exports = pool;
