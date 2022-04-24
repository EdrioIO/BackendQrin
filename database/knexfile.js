const dotenv = require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


module.exports = {

  //pool : {
  //   afterCreate :(conn, done) =>{
  //     conn.run("PRAGMA foreign_keys = ON", done);
  //   }
  // }

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    pool: { //connection
      min: 2,
      max: 10
    },
    migrations: {
      tablename : 'knex_migrations',
      directory : './migrations'
    }
  }
};
