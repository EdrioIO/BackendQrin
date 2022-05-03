const express = require('express');
const qr = require('../QR')


// const loginRouter = require('../routes/login-routes');
const userRouter = require('../routes/user');

const server = express();
server.use(express.json());

server.get('/qrtest', async (req,res)=>{
    const {course_id, session_id} = req.body
    const qr_url = await qr.generateQR("1234567890");
    res.status(200).json({error : false, message : 'qr generated', qr_url})
})

server.get('/', (req,res)=>{
    res.json({message : "this is homepage root for testing"})
})



// server.use('/api/staff', loginRouter);
server.use('/api/user', userRouter);

// server.use('./api/submit') // tambahin route object



module.exports = server;