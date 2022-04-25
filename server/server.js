const express = require('express');

// const loginRouter = require('../routes/login-routes');
const userRouter = require('../routes/user');

const server = express();
server.use(express.json());


// server.use('/api/staff', loginRouter);
server.use('/api/user', userRouter);

// server.use('./api/submit') // tambahin route object



module.exports = server;