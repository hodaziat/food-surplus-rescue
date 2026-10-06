const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // إذا كان يعمل داخل Docker سينتقل إلى اسم الخدمة 'db' أو 'postgres'، وإذا كان محلياً سيستخدم 'localhost'
  host: process.env.PGHOST || process.env.DB_HOST || 'db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '00000',
  database: process.env.PGDATABASE || 'food_surplus_db',
  port: process.env.PGPORT || 5432,
});

pool.on('connect', () => {
  console.log('PostgreSQL Database connected successfully!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};