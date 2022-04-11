const {Client} = require('pg');


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "admin123",
    database: "QRin"

})

client.connect();

client.query(`select "StudentName" from "MsStudent"`, (err,res)=>{
    if(!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
    }

    client.end;

})