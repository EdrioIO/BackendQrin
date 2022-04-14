const { Client } = require('pg')

const client = new Client({
  user: 'axgmnmooasvcsg',
  host: 'ec2-52-86-56-90.compute-1.amazonaws.com',
  database: 'dadbpgie5t1j5t',
  password: '1254a4ae582a6dd1e5458e3ae19f8561789a45b25ce6bbaf969d765264cbef46',
  port: 5432,
})

client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});