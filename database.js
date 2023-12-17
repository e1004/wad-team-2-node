const { Pool } = require('pg');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
});

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
    logger.error(error.stack);
    return false;
  }
};

const createTblQuery = `
    CREATE TABLE IF NOT EXISTS app_user (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      password text NOT NULL
    );
    CREATE TABLE IF NOT EXISTS post (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        text text NOT NULL,
        likes smallint NOT NULL DEFAULT 0,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
    );`;

execute(createTblQuery).then((result) => {
  if (result) {
    logger.info('Tables created');
  }
});

module.exports = pool;
