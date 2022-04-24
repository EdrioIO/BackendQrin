const express = require('express');

const loginRouter = require('../routes/login-routes');

const server = express();
server.use(express.json());

server.get('/', (req,res)=>{
    res.json({message : "this is homepage root for testing"})
})

server.use('/api/staff', loginRouter);
server.use('./api/submit')


module.exports = server;