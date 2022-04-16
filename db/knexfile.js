// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_KEY,
      user:     process.env.USER_KEY,
      password: process.env.PASSWORD_KEY
    },
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
