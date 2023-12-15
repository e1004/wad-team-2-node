import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: '', // add your password
  database: 'wad2',
  host: 'localhost',
  port: '5432',
});

const execute = async (query) => {
  try {
    await pool.connect(); // create a connection
    await pool.query(query); // executes a query
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};

// TODO: create necessary tables for posts
const createTblQuery = `
    CREATE TABLE IF NOT EXISTS "posts" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ... VARCHAR(200) NOT NULL UNIQUE,
        ... VARCHAR(200) NOT NULL
    );`;

execute(createTblQuery).then((result) => {
  if (result) {
    console.log('Table "posts" is created');
  }
});

export default pool;
