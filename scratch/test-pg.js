const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Kuaq6Lp7lJjV@ep-red-surf-aoff50v1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting with pg:', err);
  } else {
    console.log('Successfully connected with pg:', res.rows);
  }
  pool.end();
});
