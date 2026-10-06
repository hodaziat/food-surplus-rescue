const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost', // تم تعديلها لتتصل بجهازك المحلي مباشرة
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '00000',
  database: process.env.PGDATABASE || 'food_surplus_db',
  port: process.env.PGPORT || 5432,
});

pool.on('connect', () => {
  console.log('PostgreSQL Database connected successfully!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};