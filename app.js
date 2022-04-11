const express = require('express');
const app = express();

app.use(express.json()); // biar bisa parsing json

app.get('/', function (req, res) {
    res.json({
        number: 13
    });
});

// Defining get request at '/multiple' route
app.get('/multiple', function (req, res) {
    res.json({
        number: 1,
        name: 'John',
        gender: 'female'
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
}) // jalanin di port 3000


