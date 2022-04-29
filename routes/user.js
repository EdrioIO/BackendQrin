const express = require('express');
const student = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const loc = require('geopoint');

const router = express.Router();

router.post('/showuser', (req, res) => {
    student.showAllUser().then(student => {
        if (student) {
            res.status(200).json({ error: false, student });
        }
        else {
            res.status(404).json({ error: true, message: 'No Student Data existed' });
        }
    }).catch(err => {
        res.status(500).json({ message: 'Unable to perform operation' });
    })
})

router.post('/login', (req, res) => {
    const { student_nim, student_password } = req.body;
    student.findUserForLogin(student_nim, student_password)
        .then(student => {
            if (student) {
                res.status(200).json({ error: false, message: 'Login parameter matched alert', student });
            }
            else {
                res.status(404).json({ error: true, message: 'Login Error : Wrong Credentials', student });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Unable to perform operation' });
        })
})

router.post('./profile', (req, res) => {
    const { student_id } = req.body;
    student.findStudentById(student_id)
        .then(student => {
            if (student) {
                res.status(200).json({ error: false, message: 'Login parameter matched alert', student });
            }
            else {
                res.status(400).json({ error: true, message: 'Login Error alert' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Unable to perform operation' });
        })
})

router.put('./editprofile', (req, res) => {
    const { student_id } = req.body;
    student.findStudentById(student_id)
        .then(student => {
            if (student) {
                res.status(200).json({ error: false, message: 'Login parameter matched alert', student });
            }
            else {
                res.status(400).json({ error: true, message: 'Login Error alert' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Unable to perform operation' });
        })
})

router.post('/register', async (req, res) => {
    const credentials = req.body
    const { student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program } = credentials;
    if (student_nim && student_name && student_email && student_phone && student_password && student_dob && student_study_program) {
        //kalo semuanya ada data
        const uniqueChecker = await student.verifyRegister(student_nim, student_email, student_phone)
        if (!uniqueChecker) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student_password, salt);
            const finalCredentials = { student_nim, student_name, student_email, student_phone, student_password: hashedPassword, student_dob, student_study_program }

            student.addStudent(finalCredentials)
                .then(student => {
                    if (student) {
                        res.status(200).json({ error: false, message: 'Register Success', student });
                    }
                    else {
                        res.status(404).json({ error: true, message: 'Register Failed' });
                    }
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({ error: true, message: 'Unable to perform operation' });
                })
        } else {
            res.status(400).json({ error: true, message: 'Value inputted already existed' });
        }
    }
})

//TODO : MIGRATE THIS TO BE THE MAIN LOGIN ROUTES
router.post('/login/bcrypt', async (req, res) => {
    const { student_nim, student_password } = req.body;

    try {
        const studentRes = await student.findStudentByNIM(student_nim)
        if (!studentRes) {
            res.status(400).json({ error: true, message: 'Login Error alert' })
        }
        else {
            try {
                const passwordMatched = await bcrypt.compare(student_password, studentRes.student_password)
                if (passwordMatched) {
                    res.status(200).json({ error: false, message: 'Login parameter matched alert', studentRes })
                }
                else {
                    res.status(400).json({ error: true, message: 'Login Error alert' });
                }
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: true, message: 'Unable to perform the operation' })
            }
        }
    } catch (err) {
        res.status(500).json({ error: true, message: 'Unable to perform the operation' })
    }
})


router.get('/dev', (req,res)=>{
    const {student_id} = req.body;

    student.findStudentById(student_id)
    .then(student =>{
        console.log(student.student_id)
    })
})


// app.post('/takencourse', (req,res)=>{

// })

router.post('/attend',async (req,res)=>{
    const {student_nim,qr_code,location_x,location_y,attend_type} = req.body

    student.grabAttendData(student_nim)
    .then(student =>{
        if(student){
            
        }
        else{
            res.status(400).json({error : true, message : 'Attend attempt failed'})
        }
    })

    
})
    



module.exports = router;