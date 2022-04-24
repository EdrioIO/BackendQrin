// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dotenv = require('dotenv').config();

module.exports = {

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      tablename : 'knex_migrations',
      directory : './migrations',
    }
  }
};
