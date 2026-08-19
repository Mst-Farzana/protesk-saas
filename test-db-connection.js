require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

pool.query('SELECT 1 as ok', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.code || 'UNKNOWN', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connection successful!', res.rows[0]);
    process.exit(0);
  }
  pool.end();
});
