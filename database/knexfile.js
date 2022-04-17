// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      directory : './migrations',
    }
  }
};
