const dotenv = require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  }
};
