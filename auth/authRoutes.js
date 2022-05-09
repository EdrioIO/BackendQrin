const express = require('express');
const database = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const { user } = require('pg/lib/defaults');

const router = express.Router();

router.post('/register', async (req, res) => {
    const credentials = req.body
    const { student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program } = credentials;
    try {
        //kalo semuanya ada data
        const uniqueChecker = await database.verifyRegister(student_email, student_phone)
        if (!uniqueChecker) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student_password, salt);
            const finalCredentials = { student_nim, student_name, student_email, student_phone, student_password: hashedPassword, student_dob, student_study_program }

            try {
                const dbHolderInsert = await database.addStudent(finalCredentials)
                if (dbHolderInsert) {
                    res.status(200).json({ error: false, message: 'Register Success', dbHolderInsert });
                }
                else {
                    res.status(400).json({ error: true, message: 'Register Failed' });
                }
            } catch (err) {
                res.status(500).json({ error: true, message: 'Insert operation failed' })
            }

        } else {
            res.status(400).json({ error: true, message: 'Value [phone / email ] inputted already existed' });
        }
    } catch (err) {
        res.status(500).json({ error: true, message: 'Register operation failed' })
    }
})


router.post('/login', async (req, res) => {
    const { student_nim, student_password } = req.body;
    try {
        const studentRes = await database.findStudentByNIM(student_nim)
        if (!studentRes) {
            res.status(400).json({ error: true, message: 'Login Error alert' })
        }
        else {
            try {
                const passwordMatched = await bcrypt.compare(student_password, studentRes.student_password)
                if (passwordMatched) {

                    // for cookies session purpose
                    req.session.user = {
                        id: studentRes.student_id,
                        nim : studentRes.student_nim,
                        name: studentRes.student_name,
                        email : studentRes.student_name,
                        phone : studentRes.student_phone,
                        dob : studentRes.student_dob,
                        program : studentRes.student_study_program,
                        gen : studentRes.student_generation
                    }


                    res.status(200).json({ error: false, message: 'Login parameter matched alert'});
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

router.get('/loginTeacher', async (req, res) => {

    const { teacher_nip, teacher_password } = req.body;

    try {
        const teacherRes = await database.findTeacherByNIP(teacher_nip)
        if (!teacherRes) {
            res.status(400).json({ error: true, message: 'Login Error alert' })
        }
        else {
            try {
                const passwordMatched = await bcrypt.compare(teacher_password, teacherRes[0].teacher_password)
                if (passwordMatched) {

                    // for cookies session purpose
                    req.session.user = {
                        id: teacherRes[0].teacher_id,
                        username: teacherRes[0].teacher_name
                    }

                    res.status(200).json({ error: false, message: 'Login parameter matched alert', teacherRes })
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

router.get('/logoutTeacher', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ error: true, message: 'Something wrongs with session when logging out' });
            } else {
                res.status(200).json({ error: false, message: 'Successfuly logged out' });
            }
        })
    } else {
        res.status(200).json({ error: false, message: 'Not Logged in cannot log out' });
    }
})


router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ error: true, message: 'Something wrongs with session when logging out' });
            } else {
                res.status(200).json({ error: false, message: 'Successfuly logged out' });
            }
        })
    } else {
        res.status(200).json({ error: false, message: 'Not Logged in cannot log out' });
    }
})

module.exports = router;