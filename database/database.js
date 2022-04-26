const dotenv = require('dotenv').config();

// const knex = require('knex');
// const envi = process.env.DB_CLIENT || 'development';
// const config = require('./knexfile')[envi];

// const db = knex(config);

// module.exports = db;

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect();
 
client.query('SELECT * FROM "ms_student";', (err, res) => {
  
  // if (err) throw err;
  // for (let row of res.rows) {
  //   console.log(JSON.stringify(row));
  // }
  // client.end();

});