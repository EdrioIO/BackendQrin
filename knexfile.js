const dotenv = require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


const __dirname = './database'

module.exports = {

  production: {
    client: 'pg',
    connection:{
      connectionString : process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    } ,
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
