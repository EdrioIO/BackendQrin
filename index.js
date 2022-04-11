var express = require('express');

var app = express();

//GET
//POST
//PUT
//DELETE

app.get('/', function(req,res){
    res.send('this is home page');
})

app.get('/about', function(req,res){
    res.send('this is about page');
})

app.get('/contact', function(req,res){
    res.send('this is contact page');
})

var students = {
    1 : 'Mark',
    2 : 'Tom',
    3 : 'John'
}

app.get('/student/:id', function(req,res){
    res.send('You have requested to see the student name : ' + students[req.params.id]);
})

app.listen(3000, function(){
    console.log('Server is live on port 3000');
});