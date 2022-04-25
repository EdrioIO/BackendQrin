const express = require('express');
const temp = require('../models/dbHelpers');

const router = express.Router()

router.post('/showuser', (req,res) =>{
    temp.showAllUser().then(temp =>{
        if(temp){
            res.status(200).json({error: false, temp});
        }
        else{
            res.status(404).json({error : true, message : 'No Student Data existed'})
        }
    })
})

router.post('/login', (req,res)=>{
    const {student_nim, student_password} = req.body
    temp.findUserByNIM(student_nim,student_password)
    .then(temp =>{
        if(temp){
            res.status(200).json({error: false,message: 'Login parameter matched alert', temp})
        }
        else{
            res.status(404).json({error: true, message : 'Login Error alert'})
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'})
    })
})

module.exports = router;