const express = require('express');
const student = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper')

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



router.post('/register', async (req, res) => {
    const credentials = req.body
    const { student_nim, student_name, student_email, student_phone, student_password, student_dob, student_study_program } = credentials;
    try {
        //kalo semuanya ada data
        const uniqueChecker = await student.verifyRegister(student_email, student_phone)
        if (!uniqueChecker) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student_password, salt);
            const finalCredentials = { student_nim, student_name, student_email, student_phone, student_password: hashedPassword, student_dob, student_study_program }

            try {
                const dbHolderInsert = await student.addStudent(finalCredentials)
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

//TODO : MIGRATE THIS TO BE THE MAIN LOGIN ROUTES
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





// app.post('/takencourse', (req,res)=>{

// })

router.patch('/attend', async (req, res) => {
    const { student_id, qr_code, location_x, location_y, location_z, attend_type } = req.body

    try {
        const studentRes = await student.grabAttendData(student_id, qr_code);
        if (studentRes) {
            const userCoor = await new GeoPoint(Number(location_x), Number(location_y));
            const sessionClassCoor = await new GeoPoint(Number(studentRes[0].latitude), Number(studentRes[0].longitude));
            const distance = userCoor.distanceTo(sessionClassCoor, true);
            console.log('distance : ' + distance);
            const heightDiff = Math.abs(Number(location_z) - studentRes[0].altitude);
            console.log('height :'  + heightDiff);


            if (distance > 30 || heightDiff > 5) {
                res.status(400).json({ error: true, message: 'Distance too far from class' });
            }
            else {
                if (attend_type == 'in') {
                    const currentTime = await time.getCurrentTime();
                    console.log('base in time : ' + studentRes[0].base_in_time)
                    const secDiff = time.compareBaseTime(currentTime, studentRes[0].base_in_time);
                    console.log(secDiff);
                    if (secDiff < 1800) {
                        // alter presence in time nya
                        await student.alterPresenceData(studentRes[0].attendance_id, attend_type, currentTime);
                        res.status(200).json({ error: false, message: 'Attend IN Succeeded' });
                    }
                    else {
                        res.status(400).json({ error: true, message: 'Attend time is outside the allocated range' })
                    }
                }
                else if (attend_type == 'out') {
                    const currentTime = await time.getCurrentTime();
                    const secDiff = time.compareBaseTime(currentTime, studentRes[0].base_out_time);
                    if (secDiff < 1800) {
                        // alter presence in time nya
                        await student.alterPresenceData(student_nim, attend_type, currentTime);
                        res.status(200).json({ error: false, message: 'Attend OUT Succeeded' })
                    }
                    else {
                        res.status(400).json({ error: true, message: 'Attend time is outside the allocated range' })
                    }
                }

                else {
                    res.status(404).json({ error: true, message: 'Bad parameter' })
                }
            }
        }
        else {
            res.status(400).json({ error: true, message: 'Attend attempt failed' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'Attend operation failed' })
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

router.patch('/editProfile', async (req, res) => {
    const { student_id, student_password } = req.body;

    try {
        const dbHolder = student.findStudentById(student_id);

        if (dbHolder) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student_password, salt);

            // const uniqueChecker = await student.verifyRegister(student_email, student_phone);

            // if (!uniqueChecker) {
                await student.alterStudentProfile(student_id, hashedPassword)
                res.status(200).json({ error: false, message: 'Edit profile success' });
            // }
            // else {
            //     res.status(400).json({ error: true, message: 'Error' })
            // }
        } else {
            res.status(404).json({ error: true, message: 'No student by id, bad request parameter' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: 'editProfile operation failed' })
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
    // const {attendance_id}
    try {
        student.alterPresenceDate()
        res.status(200).json({ error: false, message: 'finished' });
    } catch (err) {
        res.status(400).json({ error: true, message: 'gagal' });
    }
})

module.exports = router;