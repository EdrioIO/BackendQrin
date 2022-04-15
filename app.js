const express = require('express');
const app = express();

const staticPort = 3000;

const channel = [];
const lesson = [];

app.use(express.json()); // biar bisa parsing json

//client request to server to get respond
//req for request , res for respond
app.get('/', function (req, res){
    res.json({
        number: 13,
        Name: 'edrio'
    })
});

app.post('api/submit', function(req,res){
    const channelSend = req.body;
    channel.push(channelSend);
    res.status(201).json(channelSend);
});

// Defining get request at '/multiple' route
app.get('/multiple', function (req, res) {
    res.json({
        number: 1,
        name: 'John',
        gender: 'female'
    });
});

app.get('/verifyAbsence',function(req, res){

    

    res.json({

    })
})

app.listen(process.env.PORT || staticPort, () => {
    console.log('listening on port 3000');
}) // jalanin di port yang auto / 3000


