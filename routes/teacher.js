const express = require('express');
const teacher = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper');
const { database } = require('pg/lib/defaults');
const bodyParser = require('body-parser')

const router = express.Router();

// const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

/////////////////////PRODUCTION/////////////////////
router.get('/showTeacher', async (req, res) => {

    try {
        const teacherRes = await teacher.showAllTeacher();
        if (teacherRes) {
            res.status(200).json({ error: false, message: 'Show All Teacher Operation Succeed', teacherRes });
        } else {
            res.status(404).json({ error: true, message: 'There is no registered teacher yet' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Show Teacher Feature Failed' });
    }
})

router.patch('/editPassword', async (req, res) => {
    const { teacher_id, teacher_password, teacher_password_new } = req.body
    try {
        const teacherRes = await teacher.findTeacherById(teacher_id);
        if (teacherRes) {
            try {
                console.log(teacher_password, teacherRes.teacher_password);
                const passwordMatched = await bcrypt.compare(teacher_password, teacherRes.teacher_password)
                if (passwordMatched) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(teacher_password_new, salt);
                        await teacher.alterTeacherProfilePassword(teacher_id, hashedPassword);
                        res.status(200).json({ error: false, message: 'Password successfuly changed' });
                    } catch (err) {
                        console.log(err)
                        res.status(500).json({ error: true, message: 'Updating password Error' });
                    }
                }
                else {
                    res.status(400).json({ error: true, message: 'Old Password not matched alert' });
                }
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: true, message: 'password compare error' })
            }
        } else {
            res.status(404).json({ error: true, message: 'No teacher with inputed ID' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Edit password operation failed' })
    }
})

router.post('/loginTeacher', async (req, res) => {

    const { teacher_nip, teacher_password } = req.body;

    try {
        const teacherRes = await teacher.findTeacherByNIP(teacher_nip)
        if (!teacherRes) {
            res.status(400).json({ error: true, message: 'Login Error alert' })
        }
        else {
            try {
                const passwordMatched = await bcrypt.compare(teacher_password, teacherRes.teacher_password)
                if (passwordMatched) {

                    // for cookies session purpose
                    // req.session.user = {
                    //     id: teacherRes.teacher_id,
                    //     username: teacherRes.teacher_name
                    // }

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
        console.log(err);
        res.status(500).json({ error: true, message: 'Unable to perform the operation' })
    }
})

router.get('/courseTeached/:teacher_id', async (req, res) => {

    const { teacher_id } = req.params;

    try {
        const courseRes = await teacher.showTeacherRelatedCourse(teacher_id)
        if (courseRes[0]) {
            res.status(200).json({ error: false, message: 'Grab Course Teached Succeed', courseRes });
        } else {
            res.status(404).json({ error: true, message: 'Teacher has no course teached' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Grab teached course failed' });
    }
})

router.get('/courseSession:course_id', async (req, res) => {

    const { course_id } = req.params;

    try {
        const sessionRes = await teacher.showCourseRelatedSession(course_id);
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

router.get('/showQR/:session_id', async (req, res) => {
    const { session_id } = req.params

    try {
        const qrRes = await teacher.grabSessionQRCode(session_id)
        if (qrRes) {
            res.status(200).json({ error: false, message: 'Show QR Succeed', qrRes });
        } else {
            res.status(404).json({ error: true, message: 'No session id registered' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Show QR Failed' })
    }
})

///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

router.get('/genCheck/:session_id', async (req, res) => {
    const { session_id } = req.params;

    try {
        const qrRes = await teacher.showGenerationRelatedForSession(session_id)
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
        const attendRes = await teacher.displayListAttendance(session_id, student_generation)
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


// let sum = 0;
// const numbers = [65, 44, 12, 4];
// numbers.forEach(myFunction);

// function myFunction(item) {
//   sum += item;
// }

router.get('/')

router.get('/manualAtttend', urlencodedParser, async (req, res) => {
    // const {string, array} = req.body

    const session_id = req.body.session_id
    const studentRes = req.body.student
    console.log(studentRes[0].student_name)

    // async function doSomething() {
    //     for (item of items) {
    //         await promiseAction(item)
    //     }
    // }


    try {
        for (student in studentRes) {
            var temps = await teacher.grabAttendDataLecturerVer(data.student_id, data.session_id)
            if (data.check_in_status == 'manual') {
                await teacher.manualAttend(temps[0].attendance_id, "in", temps[0].base_in_time, temps[0].base_out_time) // manual absen sesuai dengan treshold session
            }
            if (data.check_out_status == 'manual') {
                await teacher.manualAttend(temps[0].attendance_id, "out", temps[0].base_in_time, temps[0].base_out_time)
            }
        }

        res.status(200).json({ error: false, message: 'Manual Check Succeed' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Manual Check Operation Failed" })
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





//TODO : alter teacher pass
//TODO : Register teacher
//TODO : Show QR
//TODO : Inquiry
//TODO : manual absen


///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;