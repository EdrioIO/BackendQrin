const dotenv = require('dotenv').config();
const server = require('./server/server');

const port = process.env.PORT_KEY || 3000;

server.listen(port, () => {
    console.log(`listening on port ${port}\n`);
}) // jalanin di port yang di auto assign / 3000


