const express = require('express');
const admin = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper')

const router = express.Router();

/////////////////////PRODUCTION/////////////////////



///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

// TODO : Register ALL DATA

// TODO : Reporting (JSON to CSV with option be it date or student generation)

router.get('/adminAccess', (req, res) => {
    const adminKey = req.body

    if (adminKey == process.env.ADMIN_KEY) {
        const adminPass = process.env.ADMIN_ACCESS1;
        // TODO : create session that saves adminKey, FE go to homepage(2 menu generate report and register data)
        res.status(200).json({ error: false, message: 'You are authorized', pass });
    }

    else {
        res.status(400).json({ error: true, message: 'You are Unauthorized' });
    }

})

router.get('/generateReport', (req, res) => {

    const { course_id, session_id, student_generation } = req.body();
    //grab admin key from session

    // to do wrap try catch on if session.adminKey == proccess.env.ADMIN_KEY

    try {
        // const reportRes = admin.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Generate Report Failed' });
    }

})


router.post('/registerUser',async (req, res) => {

    const { adminPass, student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerStudent(student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation)
            if (adminRes) {
                res.status(200).json({ error: false, message: 'Register student succeed', adminRes })
            }
            else {
                res.status(501).json({ error: true })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }

    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/registerTeacher', async (req, res) => {
    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_dob} = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerTeacher(teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_dob)
            if (adminRes) {
                res.status(200).json({ error: false, message: 'Register teacher succeed', adminRes})
            }
            else {
                res.status(501).json({ error: true })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/registerCourse', async (req,res)=>{
    const {adminPass, course_name,course_code} = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerCourse(course_name,course_code)
            if (adminRes) {
                res.status(200).json({ error: false, message: 'Register course succeed', adminRes})
            }
            else {
                res.status(501).json({ error: true })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }

})

///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;