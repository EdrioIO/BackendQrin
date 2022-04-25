const dotenv = require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */



module.exports = {
  development:{
    client: 'pg',
    connection:{
      database: 'QRin',
      user: 'postgres',
      password: 'admin123'
    },
    pool:{
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migration',
    },
    seeds: {
      tableName: 'seed',
    },
  },
  
  production: {
    client: 'pg',
    connection:{
      connectionString : process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  }
};
