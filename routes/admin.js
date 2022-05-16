const express = require('express');
const admin = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper')
const bodyParser = require('body-parser')

const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

/////////////////////PRODUCTION/////////////////////



///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

// TODO : Register ALL DATA

// TODO : Reporting (JSON to CSV with option be it date or student generation)

router.post('/adminAccess',urlencodedParser, (req, res) => {
    const adminKey = req.body.adminKey

    console.log(adminKey);
    console.log(process.env.ADMIN_KEY);
    if (adminKey == process.env.ADMIN_KEY) {
        
        const adminPass = process.env.ADMIN_ACCESS1;
        console.log(adminPass);
        // TODO : create session that saves adminKey, FE go to homepage(2 menu generate report and register data)
        res.status(200).json({ error: false, message: 'You are authorized', adminPass });
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


router.post('/registerUser', async (req, res) => {

    const { adminPass, student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerStudent(student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation)
            if (adminRes[0]) {
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
    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_dob } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerTeacher(teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_dob)
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Register teacher succeed', adminRes })
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

router.post('/registerCourse', async (req, res) => {
    const { adminPass, course_name, course_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerCourse(course_name, course_code)
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Register course succeed', adminRes })
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

router.post('/showAllCourse', async (req, res) => {

    const { adminPass } = req.body;

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const courseRes = await admin.showAllCourse();
            if (courseRes[0]) {
                res.status(200).json({ error: false, message: 'Grab All Course Succeed', courseRes });
            }
            else {
                res.status(404).json({ error: true, message: 'No Course Registered' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/registerCourseSession', async (req, res) => {

    const { adminPass, course_id, session_name, base_in_time, base_out_time, qr_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.registerSession(session_name, base_in_time, base_out_time, qr_code, course_id)
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Register course succeed', adminRes })
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

router.post('/registerProgram', async (req, res) => {

    const { adminPass, program_name } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const programRes = await admin.registerProgram(program_name)
            if (programRes[0]) {
                res.status(200).json({ error: false, message: 'Register course succeed', programRes })
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

router.post('/showAllStudent', async (req, res) => {

    const {adminPass} = req.bodyS

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const studentRes = await admin.grabStudentData();

            if (studentRes[0]) {
                res.status(200).json({ error: false, message: 'Show all student succeed' });
            } else {
                res.status(404).json({ error: true, message: 'No registered student' })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true, message: 'Show all student failed' })
        }
    }
})

router.post('/courseNot/:student_id', async (req, res) => {

    const {adminPass} = req.body
    const { student_id } = req.params;

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const courseRes = await admin.grabStudentCourseNot(student_id)
            if (courseRes[0]) {
                res.status(200).json({ error: false, message: 'Grab Not Taken Course succeed', courseRes })
            }
            else {
                res.status(404).json({ error: true })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }

    }

})

router.post('/registerStudentCourse', async (req, res) => {

    const { adminPass, student_id, course_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const takenCourseRes = await admin.registerStudentCourse(student_id, course_id)
            if (takenCourseRes[0]) {
                res.status(200).json({ error: false, message: 'Register course succeed', takenCourseRes })
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

router.post('/registerTeachedCourse', async (req, res) => {

    const { adminPass, teacher_id, course_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const teachedCourseRes = await admin.registerTeachedCourse(teacher_id, course_id)
            if (teachedCourseRes[0]) {
                res.status(200).json({ error: false, message: 'Register course succeed', teachedCourseRes })
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



////

router.get

router.get('/courseSession/:course_id', async (req, res) => {

    const { course_id } = req.params;

    try {
        const sessionRes = await admin.showCourseRelatedSession(course_id);
        if (sessionRes[0]) {
            res.status(200).json({ error: false, message: 'Grab course sessions succeed', sessionRes });
        } else {
            res.status(404).json({ error: true, message: 'No session in inputted Course' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Grab Course Sessions failed' });
    }
})

router.get('/genCheck/:session_id', async (req, res) => {
    const { session_id } = req.params;

    try {
        const qrRes = await admin.showGenerationRelatedForSession(session_id)
        if (qrRes) {
            res.status(200).json({ error: false, message: 'Show generation Succeed', qrRes });
        } else {
            res.status(404).json({ error: true, message: 'No session id registered' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Show Generation Failed' })
    }
})

router.get('/classAttendData/:session_id/:student_generation', async (req, res) => {
    const { session_id, student_generation } = req.params

    try {
        const attendRes = await admin.displayListAttendance(session_id, student_generation)
        if (attendRes) {
            res.status(200).json({ error: false, message: 'Show list attendance Succeed', attendRes });
        } else {
            res.status(404).json({ error: true, message: 'No data' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Show Attendance Failed' })
    }
})



///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;