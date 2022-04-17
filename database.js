// const knex = require('knex');
// const envi = process.env.DB_ENV || 'development';
// const config = require('./knexfile');

// const db = knex(config[envi]);

// module.exports = db;


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
 
client.query('SELECT * FROM "ms_student";', (err, res) => {
  
  // if (err) throw err;
  // for (let row of res.rows) {
  //   console.log(JSON.stringify(row));
  // }
  // client.end();

});