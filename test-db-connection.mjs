import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  const res = await pool.query('SELECT 1 as ok');
  console.log('✅ Connection successful!', res.rows[0]);
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed:', err.code || 'UNKNOWN', err.message);
  process.exit(1);
} finally {
  pool.end();
}
