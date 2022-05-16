const express = require('express');
const admin = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper')
const bodyParser = require('body-parser')

const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

/////////////////////PRODUCTION/////////////////////
router.post('/adminAccess', urlencodedParser, (req, res) => {
    const adminKey = req.body.adminKey

    if (adminKey == process.env.ADMIN_KEY) {

        const adminPass = process.env.ADMIN_ACCESS1;
        res.status(200).json({ error: false, message: 'You are authorized', adminPass });
    }

    else {
        res.status(400).json({ error: true, message: 'You are Unauthorized' });
    }
})

router.post('/studentData/add', urlencodedParser, async (req, res) => {

    const { adminPass, student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation } = req.body



    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const student_password = "QRin" + student_nim;
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(student_password, salt);
            const adminRes = await admin.registerStudent(student_nim, student_name, student_email, student_phone, hashed_password, student_dob, student_study_program, student_generation)
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

router.post('/studentData/showAll', async (req, res) => {

    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const studentRes = await admin.showAllUser()
            if (studentRes[0]) {
                res.status(200).json({ error: false, message: 'Register student succeed', studentRes })
            }
            else {
                res.status(501).json({ error: true })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }

    } else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }
})

router.post('/studentData/edit/:student_id', async (req, res) => {
    const student_id = req.params;
    const { adminPass, student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program, student_generation } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(student_password, salt);
            await admin.editStudentData(student_id, student_nim, student_name, student_email, student_phone, hashed_password, student_dob, student_study_program, student_generation)
            res.status(200).json({ error: false, message: 'Register student succeed'})

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }

    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/teacherData/add', async (req, res) => {
    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_password, teacher_phone, teacher_dob } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(teacher_password, salt);
            await admin.editTeacherData(teacher_nip, teacher_name, teacher_email, teacher_phone, hashed_password, teacher_dob)
            res.status(200).json({ error: false, message: 'Edit teacher succeed' })
        }
        catch (err) {
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

router.post('/courseSession/:course_id', urlencodedParser, async (req, res) => {

    const { course_id } = req.params;
    const adminPass = req.body.adminPass;

    if (adminPass == process.env.ADMIN_ACCESS1) {
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
    }
    else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }
})

router.post('/genCheck/:session_id', urlencodedParser, async (req, res) => {
    const { session_id } = req.params;
    const adminPass = req.body.adminPass;

    if (adminPass == process.env.ADMIN_ACCESS1) {
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
    } else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }
})

router.post('/classAttendData/:session_id/:student_generation', urlencodedParser, async (req, res) => {
    const { session_id, student_generation } = req.params
    const adminPass = req.body.adminPass;


    if (adminPass == process.env.ADMIN_ACCESS1) {
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
    } else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }
})

router.post('/inquiry_user', urlencodedParser, async (req, res) => {

    const adminPass = req.body.adminPass;
    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const inquiryRes = await admin.showInquiryUser()

            if (inquiryRes[0]) {
                res.status(200).json({ error: false, message: 'Show Student Inquiry data succeed', inquiryRes });
            }
            else {
                res.status(404).json({ error: true, message: 'No Inquiry data' });
            }

        } catch (err) {
            console.log(err);
            res.status(404).json({ error: true, message: 'No user inquiry yet' })
        }
    } else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }
})


router.post('/inquiry_teacher', urlencodedParser, async (req, res) => {

    const adminPass = req.body.adminPass;

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const inquiryRes = await admin.showInquiryTeacher()

            if (inquiryRes[0]) {
                res.status(200).json({ error: false, message: 'Show Student Inquiry data succeed', inquiryRes });
            }
            else {
                res.status(404).json({ error: true, message: 'No Inquiry data' });
            }
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: true, message: 'No user inquiry yet' })
        }
    } else {
        res.status(400).json({ error: true, message: 'You are unauthorized' })
    }

})

///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////



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

router.post('/teacherData/showAll', async (req, res) => {
    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllTeacher()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'grab Teacher Data Succeed' });
            }
            else {
                res.status(404).json({ error: true, message: 'No Teacher Data' })
            }
        } catch (er) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    } else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/teacherData/edit/:teacher_id', async (req, res) => {

    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_password, teacher_dob } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(teacher_password, salt);
            const adminRes = await admin.registerStudent(teacher_id, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_password, teacher_dob)

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



router.post('/courseNot/:student_id', async (req, res) => {

    const { adminPass } = req.body
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







///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;