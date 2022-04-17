// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const dotenv = require('dotenv').config();
module.exports = {

  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      directory : './migrations',
    }
  }
};
