import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT), // Convierte a número
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('Conectado a PostgreSQL');

    // Aquí puedes ejecutar tus consultas
    const res = await client.query('SELECT NOW()');
    console.log(res.rows);

    client.release(); // Libera la conexión cuando terminas
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err);
  }
}

connectDB();

export default pool;
