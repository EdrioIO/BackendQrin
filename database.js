require('dotenv').config()

// manual 1 by 1

// const { Client } = require('pg')

// const client = new Client({
//   user: process.env.USER_KEY,
//   host: process.env.HOST_KEY,
//   database: process.env.DATABASE_KEY,
//   password: process.env.PASSWORD_KEY,
//   port: process.env.PORT_KEY,

// ssl: {
//     rejectUnauthorized: false
//   }

// })

// client.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });


// one single url
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

 
client.query<JSON>('SELECT * FROM "MsStudent" ', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
  
});