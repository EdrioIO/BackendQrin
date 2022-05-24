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

router.post('/studentData/add', async (req, res) => {

    const { adminPass, student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation } = req.body



    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const student_password = "QRin" + student_nim;
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(student_password, salt);
            const studentEntity = { student_nim, student_name, student_email, student_phone, student_password: hashed_password, student_dob, student_study_program, student_generation }
            await admin.addStudent(studentEntity)
            res.status(200).json({ error: false, message: 'Register student succeed' })

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
                res.status(200).json({ error: false, message: 'Show All student succeed', studentRes })
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

router.patch('/studentData/edit/:student_id', async (req, res) => {
    const { student_id } = req.params;
    const { adminPass, student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program, student_generation, passwordChanged } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            if (passwordChanged) {
                const salt = await bcrypt.genSalt(10);
                const hashed_password = await bcrypt.hash(student_password, salt);
                await admin.editStudentData(student_id, student_nim, student_name, student_email, student_phone, hashed_password, student_dob, student_study_program, student_generation)
            }

            else {
                await admin.editStudentData(student_id, student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program, student_generation)
            }
            res.status(200).json({ error: false, message: 'Register student succeed' })

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
    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_dob } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const defaultPass = "QRin" + teacher_nip
            const salt = await bcrypt.genSalt(10);
            const teacher_password = await bcrypt.hash(defaultPass, salt);
            const teacherEntity = { teacher_name, teacher_password, teacher_nip, teacher_email, teacher_phone, teacher_dob }
            await admin.addTeacher(teacherEntity)
            res.status(200).json({ error: false, message: 'register teacher succeed' })
        }
        catch (err) {
            console.log(err)
            res.status(502).json({ error: true })
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

router.post('/courseSession/:course_id', async (req, res) => {

    const { course_id } = req.params;
    const { adminPass } = req.body

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

router.post('/genCheck/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { adminPass } = req.body;

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

router.post('/classAttendData/:session_id/:student_generation', async (req, res) => {
    const { session_id, student_generation } = req.params
    const { adminPass } = req.body


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

router.patch('/inquiry_user/review', urlencodedParser, async (req, res) => {
    const adminPass = req.body.adminPass;
    const inquiry = req.body.inquiry;

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            for (inq = 0; inq < inquiry.length; inq++) {
                if (inquiry[inq].is_reviewed == true) {
                    await admin.reviewInquiryUser(inquiry[inq].inquiry_id, inquiry[inq].is_reviewed)
                }
            }
            res.status(200).json({ error: false, message: 'Review Inquiry data succeed' });
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    } else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.patch('/inquiry_teacher/review', urlencodedParser, async (req, res) => {
    const adminPass = req.body.adminPass;
    const inquiry = req.body.inquiry;

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            for (inq = 0; inq < inquiry.length; inq++) {
                if (inquiry[inq].is_reviewed == true) {
                    await admin.reviewInquiryTeacher(inquiry[inq].inquiry_teacher_id, inquiry[inq].is_reviewed)
                }
            }
            res.status(200).json({ error: false, message: 'Review Inquiry data succeed' });
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    } else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/teacherData/showAll', async (req, res) => {
    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllTeacher()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'grab Teacher Data Succeed', adminRes });
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

router.patch('/teacherData/edit/:teacher_id', async (req, res) => {

    const { teacher_id } = req.body.params
    const { adminPass, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_password, teacher_dob } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(teacher_password, salt);
            await admin.editTeacherData(teacher_id, teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_password, teacher_dob)

            res.status(200).json({ error: false, message: 'Register teacher succeed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }

    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/courseData/add', async (req, res) => {
    const { adminPass, course_name, course_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const courseEntity = { course_name, course_code }
            await admin.addCourse(courseEntity)
            res.status(200).json({ error: false, message: 'Register course succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/courseData/showAll', async (req, res) => {
    const { adminPass } = req.body;
    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllCourse()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all course succeed', adminRes })
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


router.patch('/courseData/edit/:course_id', async (req, res) => {

    const { course_id } = req.params
    const { adminPass, course_name, course_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            await admin.editCoursedata(course_id, course_name, course_code)
            res.status(200).json({ error: false, message: 'Edit course succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/sessionData/add', async (req, res) => {

    const { adminPass, course_id, session_name, base_in_time, base_out_time, qr_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const sessionEntity = { course_id, session_name, base_in_time, base_out_time, qr_code }
            await admin.addSession(sessionEntity)
            res.status(200).json({ error: false, message: 'Register session succeed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }

})
// tak jadi
router.post('/sessionData/courseSession/:course_id', async (req, res) => {
    const { course_id } = req.params;
    const { adminPass } = req.body

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
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }

})

router.post('/sessionData/showAll', async (req, res) => {
    const { adminPass } = req.body;
    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllSession()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all session succeed', adminRes })
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

router.patch('/sessionData/edit/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { adminPass, course_id, session_name, base_in_time, base_out_time, qr_code } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            await admin.editSessionData(session_id, session_name, base_in_time, base_out_time, qr_code, course_id)

            res.status(200).json({ error: false, message: 'Edit session succeed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }

})

router.post('/roomData/add', async (req, res) => {
    const { adminPass, class_name, longitude, latitude, altitude } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const roomEntity = { class_name, latitude, longitude, altitude }
            await admin.addClass(roomEntity)
            res.status(200).json({ error: false, message: 'Register class succeed' })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/roomData/showAll', async (req, res) => {
    const { adminPass } = req.body;
    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllClass()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all room succeed', adminRes })
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

router.patch('/roomData/edit/:class_id', async (req, res) => {
    const { class_id } = req.params
    const { adminPass, class_name, longitude, latitude, altitude } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.editClassData(class_id, class_name, longitude, latitude, altitude)
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all room succeed', adminRes })
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

router.post('/programData/add', async (req, res) => {

    const { adminPass, program_name } = req.body


    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const programEntiy = { program_name }
            await admin.addProgram(programEntiy)
            res.status(200).json({ error: false, message: 'Register course succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/programData/showAll', async (req, res) => {
    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllProgram()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all program succeed', adminRes })
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

router.patch('/programData/edit/:program_id', async (req, res) => {
    const { program_id } = req.params
    const { adminPass, program_name } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            await admin.editProgramData(program_id, program_name)
            res.status(200).json({ error: false, message: 'Edit Program succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/courseTeachedData/add', async (req, res) => {

    const { adminPass, course_id, teacher_id } = req.body


    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const courseTeachedEntity = { teacher_id, course_id }
            await admin.addTeachedCourse(teacher_id, course_id)
            res.status(200).json({ error: false, message: 'Register course succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/courseTeachedData/showAll', async (req, res) => {
    const adminPass = req.body;

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllCourseTeached()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all program succeed', adminRes })
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


router.patch('/courseTeachedData/edit/:course_teached_id', async (req, res) => {
    const { course_teached_id } = req.params
    const { adminPass, course_id, teacher_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            await admin.editCourseTeachedData(course_teached_id, course_id, teacher_id)
            res.status(200).json({ error: false, message: 'Edit Program succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})



router.post('/courseTakenData/add', async (req, res) => {

    const { adminPass, student_id, course_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const courseTakenEntity = {student_id, course_id}
            await admin.addTakenCourse(courseTakenEntity)
            res.status(200).json({ error: false, message: 'Register course taken succeed'})
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})

router.post('/courseTakenData/showAll', async (req, res) => {
    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showAllCourseTaken()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all course taken succeed', adminRes })
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

router.patch('/courseTakenData/edit/:course_taken_id', async (req, res) => {
    const { course_taken_id } = req.params
    const { adminPass, course_id, student_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            await admin.editCourseTakenData(course_taken_id, course_id, student_id)
            res.status(200).json({ error: false, message: 'Edit Program succeed' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true })
        }
    }
    else {
        res.status(500).json({ error: true, message: 'You are not an admin' })
    }
})


router.post('/studentData/showGen', async (req, res) => {
    const { adminPass } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {
        try {
            const adminRes = await admin.showGenerationList()
            if (adminRes[0]) {
                res.status(200).json({ error: false, message: 'Show all course taken succeed', adminRes })
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

router.post('/courseTakenData/add/:student_generation', async (req, res) => {
    const { student_generation } = req.params;
    const { adminPass, course_id } = req.body

    if (adminPass == process.env.ADMIN_ACCESS1) {

        try {
            const adminRes = await admin.showStudentGeneration(student_generation);
            if (adminRes[0]) {
                for (stu = 0; stu < adminRes.length; stu++) {
                    await admin.registerStudentCourse(adminRes[x].student_id, course_id)
                }
                res.status(200).json({ error: false, message: 'Register course taken succeed', adminRes })
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
///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

// router.post('/sessionHeaderData/add', async (req, res) => {

//     const { adminPass, session_id, teacher_id, class_id, session_date } = req.body

//     if (adminPass == process.env.ADMIN_ACCESS1) {

//         try {
//             const adminRes = await admin.registerStudentCourse(student_id, course_id)
//             if (adminRes[0]) {
//                 res.status(200).json({ error: false, message: 'Register course taken succeed', adminRes })
//             }
//             else {
//                 res.status(501).json({ error: true })
//             }
//         } catch (err) {
//             console.log(err)
//             res.status(500).json({ error: true })
//         }
//     }
//     else {
//         res.status(500).json({ error: true, message: 'You are not an admin' })
//     }
// })














router.post('/courseNot/:student_id', async (req, res) => {

    const { adminPass } = req.body;
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


router.post('/dev', async (req, res) => {

    const { student_nim, student_name, student_email, student_phone, student_dob, student_study_program, student_generation } = req.body
    console
    try {
        const student_password = "QRin" + student_nim;
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(student_password, salt);
        console.log(hashed_password);
        const studentEntity = { student_nim, student_name, student_email, student_phone, student_password: hashed_password, student_dob, student_study_program, student_generation }
        console.log(studentEntity)
        const adminRes = await admin.addStudent(studentEntity)
        res.status(200).json({ error: false, message: 'Register student succeed' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true })
    }
})






///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;