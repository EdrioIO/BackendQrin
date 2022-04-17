const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const router = require('./routes/route')
const database = require('./db/database');
const staticPort = 3000;

let channel = [];


app.use(express.json()); // biar bisa parsing json
// app.use(router);

//client request to server to get respond
//req for request , res for respond
app.get('/', (req, res) => {
    res.json({
        number: 13,
        Name: 'edrio'
    })
});

app.post('/api/submit', (req,res)=>{
    const channelSend = req.body;
    channelSend.id = 1;
    channel.push(channelSend);
    res.status(201).json(channelSend);
});

//spesific channel search
app.get('/api/channel/:id', (req,res) =>{
    const {id} = req.params;
    const found = channel.find(channel => channel.id == id);

    if(found){
        res.status(200).json(found);
    }else{
        res.status(404).json({Message : "Channel you are looking aren't exist"})
    }
})


// put completly overwrite daya , disclaimer it could also add new att(be sure the att container have its att especially db)
app.put('/api/channel/:id', (req,res)=>{
    const {id} = req.params;
    const changes = req.body;
    const index = channel.findIndex(channel => channel.id == id); //cari tau index array tempat data ditemukan
    
    if(index != -1){
        // changes = json(req.body);
        channel[index] = changes;
        res.status(200).json(channel[index]);
    }else{
        res.status(404).json({Message : "Channel you are looking aren't exist"})
    }

})

// puts but better (can only specify changed att not all att must be included)
app.patch('/api/channel/:id', (req,res)=>{
    const {id} = req.params;
    changes = req.body;
    const found = channel.find(channel => channel.id == id); 
    console.log(changes)
    if(found){
        // console.log(found);
        // changes = json(req.body);
        Object.assign(found,changes);
        res.status(200).json(found);
    }else{
        res.status(404).json({Message : "Channel you are looking aren't exist"})
    }

})


app.get('/api/submit', (req,res) =>{
    res.status(200).json(channel);
})

app.delete('/api/submit/:id', (req,res)=>{
    const {id} = req.params;

    // find on channel function( onchannel where channel id == id)
    const deleted = channel.find(channel => channel.id == id);
    if(deleted){
        channel = channel.filter(channel => channel.id !== id);
        res.status(200).json(deleted);
    }else{
        res.status(404).json({Message : "Channel you are looking aren't exist"})
    }
})

// Defining get request at '/multiple' route
app.get('/multiple', (req, res) => {
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

module.exports = app
