const express = require('express');
const qr = require('../QR')
const session = require('express-session')
// const loginRouter = require('../routes/login-routes');
const userRouter = require('../routes/user');
const teacherRouter = require('../routes/teacher')
const adminRouter = require('../routes/admin');
const authRouter = require('../auth/authRoutes');

const server = express();

// const sessionConfig ={
//     name : 'myCookie', // nama cookie
//     secret : process.env.SECRET, // secret untuk membuat cookie aktif
//     cookie : {
//         maxAge : 1000 * 60 * 60, // timespan cookie hidup(dalam satuan ms)
//         secure : false, //ini kalo udah prod klo masih testing false aja
//         httpOnly : true, // prohibit js access from external(true = no access from js)
//     },
//     resave : false,
//     saveUnititialized : true //prod harus false (GDPR Laws)
// }

server.use(express.json());
// server.use(session(sessionConfig));

server.get('/qrtest', async (req,res)=>{
    // const {course_id, session_id} = req.body
    const qr_url = await qr.generateQR("1234567890");
    res.status(200).json({error : false, message : 'qr generated', qr_url})
})

server.get('/', (req,res)=>{
    res.json({message : "this is homepage root for testing"})
})



// server.use('/api/staff', loginRouter);
server.use('/api/user', userRouter);
server.use('/api/admin',adminRouter);
server.use('/api/teacher', teacherRouter);
// server.user('/api/auth')

// server.use('./api/submit') // tambahin route object



module.exports = server;