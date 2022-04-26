const express = require('express');
const student = require('../models/dbHelpers');
const bcrypt = require('bcrypt');


const router = express.Router();

router.post('/showuser', (req,res) =>{
    student.showAllUser().then(student =>{
        if(student){
            res.status(200).json({error: false, student});
        }
        else{
            res.status(404).json({error : true, message : 'No Student Data existed'});
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'});
    })
})

router.post('/login', (req,res)=>{
    const {student_nim, student_password} = req.body;
    student.findUserForLogin(student_nim,student_password)
    .then(student =>{
        if(student){
            res.status(200).json({error: false,message: 'Login parameter matched alert', student});
        }
        else{
            res.status(404).json({error: true, message : 'Login Error : Wrong Credentials',student});
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'});
    })
})

router.post('./profile',(req,res) =>{
    const {student_id} = req.body;
    student.findStudentById(student_id)
    .then(student =>{
        if(student){
            res.status(200).json({error: false,message: 'Login parameter matched alert', student});
        }
        else{
            res.status(400).json({error: true, message : 'Login Error alert'});
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'});
    })
})

router.put('./editprofile',(req,res)=>{
    const {student_id} = req.body;
    student.findStudentById(student_id)
    .then(student =>{
        if(student){
            res.status(200).json({error: false,message: 'Login parameter matched alert', student});
        }
        else{
            res.status(400).json({error: true, message : 'Login Error alert'});
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'});
    })
})

router.post('/register', async(req,res)=>{
    const credentials =  req.body
    const {student_nim, student_name, student_email, student_phone, student_password, student_dob,student_study_program} = credentials;
    if(student_nim && student_name && student_email && student_phone && student_password && student_dob && student_study_program){
        //kalo semuanya ada data
    const uniqueChecker = await student.verifyRegister(student_nim,student_email,student_phone)
        if(!uniqueChecker){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student_password, salt);
            const finalCredentials = {student_nim, student_name, student_email, student_phone, student_password : hashedPassword, student_dob,student_study_program}
            
            student.addStudent(finalCredentials)
            .then(student =>{
                if(student){
                    res.status(200).json({error: false,message: 'Register Success', student});
                }
                else{
                    res.status(404).json({error: true, message : 'Register Failed'});
                }
            }).catch(err => {
                console.log(err)
                res.status(500).json({error : true, message : 'Unable to perform operation'});
            })
        }else{
            res.status(400).json({error : true, message : 'Value inputted already existed'});
        }
    }
})


router.post('/login/bcrypt', (req,res) =>{
    const {student_nim, student_password} = req.body;
    
    student.findStudentByNIM(student_nim)
    .then(student =>{
        
        if(!student){
            res.status(400).json({error : true, message : 'Login Error alert'})
        }
        else{
            try{     
                const passwordMatched = bcrypt.compare(student_password, student.student_password)      
                if(passwordMatched){
                    res.status(200).json({error : false, message :'Login parameter matched alert',student})
                }
                else{
                    res.status(400).json({error: true, message : 'Login Error alert'});
                }
            }catch(err){
                console.log(err)
                res.status(500).json({error : true, message : 'Unable to perform the operation'})
            }
        }
    }).catch(err=>{
        res.status(500).json({error : true, message : 'Unable to perform the operation 2'})
    })
       
})


    
module.exports = router;