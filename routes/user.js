const express = require('express');
const student = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper')

const router = express.Router();

/////////////////////////PRODUCTION////////////////////////////////////


router.post('/login', async (req, res) => {
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

router.patch('/attend', async (req, res) => {
    const { student_id, qr_code, location_x, location_y, location_z, attend_type } = req.body
    let isNotLateIn = false;
    let isNotLateOut = false;
    try {
        const studentRes = await student.grabAttendData(student_id, qr_code);
        const isRegistered = await student.checkRegisteredCourse(student_id,studentRes[0].session_id)

        if (studentRes && isRegistered) {
            const userCoor = await new GeoPoint(Number(location_x), Number(location_y));
            const sessionClassCoor = await new GeoPoint(Number(studentRes[0].latitude), Number(studentRes[0].longitude));
            const distance = userCoor.distanceTo(sessionClassCoor, true);
            console.log('distance : ' + distance);
            const heightDiff = Math.abs(Number(location_z) - studentRes[0].altitude);
            console.log('height :' + heightDiff);

            // if (distance > 30 || heightDiff > 5) {
            //     res.status(400).json({ error: true, message: 'Distance too far from class' });
            // }
            // else {
                if (attend_type == 'in') {
                    const currentTime = await time.getCurrentTime();
                    console.log('base in time : ' + studentRes[0].base_in_time)
                    const secDiff = time.compareBaseTime(currentTime, studentRes[0].base_in_time);
                    console.log(secDiff);
                    if (secDiff < 1800) {
                        // alter presence in time nya
                        isNotLateIn = true;
                        await student.alterPresenceData(studentRes[0].attendance_id, attend_type, currentTime, isNotLateIn, isNotLateOut);
                        res.status(200).json({ error: false, message: 'Attend IN Succeeded (in time)' });
                    }
                    else {
                        isNotLateIn = false;
                        await student.alterPresenceData(studentRes[0].attendance_id, attend_type, currentTime, isNotLateIn, isNotLateOut);
                        res.status(200).json({ error: false, message: 'Attend IN Succeeded (late time)' });
                    }
                }
                else if (attend_type == 'out') {
                    const currentTime = await time.getCurrentTime();
                    const secDiff = time.compareBaseTime(currentTime, studentRes[0].base_out_time);
                    if (secDiff < 1800) {
                        // alter presence in time nya
                        isNotLateOut = true;
                        await student.alterPresenceData(student_nim, attend_type, currentTime, isNotLateIn, isNotLateOut);
                        res.status(200).json({ error: false, message: 'Attend OUT Succeeded' })
                    }
                    else {
                        isNotLateOut = false;
                        await student.alterPresenceData(studentRes[0].attendance_id, attend_type, currentTime, isNotLateIn, isNotLateOut);
                        res.status(200).json({ error: false, message: 'Attend IN Succeeded (late time)' });
                    }
                }
                else {
                    res.status(404).json({ error: true, message: 'Bad parameter' })
                }
            }
        // }
        else {
            res.status(400).json({ error: true, message: 'Attend attempt failed' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Attend operation failed (Student not exist or not registered to course)' })
    }
})

router.post('/inquiry', async (req, res) => {
    const { student_id, details } = req.body

    try {
        const dbHolder = await student.submitInquiry(student_id, details)
        if (dbHolder) {
            res.status(200).json({ error: false, message: "Inquiry submitted succesfully" });
        }
        else {
            res.status(400).json({ error: true, message: "Error" })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: true, message: 'Inquiry operation failed' });
    }
})

router.get('/takenCourse/:student_id/course/:course_id', async(req,res)=>{
    const{course_id, student_id} = req.params;
    try{
        const sessionRes = await student.grabCourseSession(student_id,course_id);

        if(sessionRes[0]){
            res.status(200).json({sessionRes});
        }
        else{
            res.status(404).json({error : true, message : 'No session on inputed course'});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error : true, message : 'Grab Course Session failed'});
    }
})

router.get('/takenCourse/:student_id', async (req, res) => {
    const { student_id } = req.params;
    console.log(student_id)
    try {
        const takenCourseRes = await student.grabTakenCourse(student_id);

        if (takenCourseRes[0]) {
            res.status(200).json({takenCourseRes})
        }
        else {
            res.status(404).json({ error: true, message: 'No Taken Course data on id was found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'takenCourse operation failed' });
    }
})

router.patch('/editPassword', async (req, res) => {
    const { student_id, student_password, student_password_new } = req.body
    try {
        studentRes = await student.findStudentById(student_id);
        if (studentRes) {
            try {
                const passwordMatched = await bcrypt.compare(student_password, studentRes.student_password)
                if (passwordMatched) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(student_password_new, salt);
                        await student.alterStudentProfilePassword(student_id, hashedPassword);
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
            res.status(404).json({ error: true, message: 'No student with inputed ID' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Grab student by ID error' })
    }
})

router.patch('/editPhone', async (req, res) => {
    const { student_id, student_phone } = req.body
    try {
        const studentRes = await student.findStudentById(student_id);

        if (studentRes) {
            try {
                await student.alterStudentProfilePhone(student_id, student_phone)
                res.status(200).json({ error: false, message: 'Phone number changed succesfully' })
            } catch (err) {
                console.log(err);
                res.status(404).json({ error: true, message: 'Failed on altering phone number' })
            }
        } else {
            res.status(404).json({ error: true, message: 'Student with inputed ID not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error on grabbing student data') // todo
    }

})

router.get('/getAttendance/:student_id', async (req, res) => {
    const { student_id } = req.params;

    try {
        const attendDataRes = await student.student
        if (attendDataRes) {
            res.status(200).json({ error: false, message: 'Grab attend data operation succeed' })
        } else {
            res.status(404).json({ error: true, message: 'No Data matches the criteria' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Get Attendance Failed' })
    }
})

/////////////////////////END of PRODUCTION////////////////////////



////////////////////DEVELOPMENT/////////////////////////

router.get('/dev', async (req, res) => {
    const { student_nim, qr_code, location_x, location_y, location_z, attend_type } = req.body

    console.log(student_nim, qr_code, location_x, location_y, location_z, attend_type);

    try {
        const dbHolder = await student.grabAttendData(student_nim, qr_code)
        if (dbHolder) res.status(200).json({ message: 'apakah ada data', dbHolder })
        else res.status(404).json({ error: true, dbHolder })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true })
    }
})



router.patch('/dev2', async (req, res) => {
    const { attendance_id, attend_type } = req.body;
    try {
        const updatedData = await student.alterPresenceData(attendance_id, attend_type, '08:35:00')
        res.status(200).json({ error: false, message: 'finished' });
    } catch (err) {
        res.status(400).json({ error: true, message: 'gagal' });
    }
})

router.patch('/dev3', async (req, res) => {
    const {student_id, session_id} = req.body
    try {
        const temps = await student.checkRegisteredCourse(student_id,session_id)
        if(temps){
            res.status(200).json({ error: false, message: 'finished' ,temps});
        }else{
            res.status(203).json({error : true, message : 'error'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: true, message: 'gagal' });
    }
})

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





////////////////////END OF DEVELOPMENT/////////////////////////

module.exports = router;