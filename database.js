const { Pool } = require('pg');

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

const createTblQuery = `
    CREATE TABLE IF NOT EXISTS "post" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name text,
        author_email text,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        text text NOT NULL,
        likes smallint NOT NULL DEFAULT 0
    );`;

execute(createTblQuery).then((result) => {
  if (result) {
    console.log('Table "posts" is created');
  }
});

module.exports = pool;
