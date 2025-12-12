require('dotenv').config({ path: './config/.env' });
const knex = require('knex');

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'note_taking_app',
  },
  pool: {
    min: 0,
    max: 7,
  },
});

module.exports = db;
