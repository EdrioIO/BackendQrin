const express = require('express');
const teacher = require('../models/dbHelpers');
const bcrypt = require('bcrypt');
const GeoPoint = require('geopoint');
const time = require('../models/timeHelper');
const { database } = require('pg/lib/defaults');

const router = express.Router();

/////////////////////PRODUCTION/////////////////////
router.get('/showTeacher', async (req, res) => {

    try {
        const teacherRes = await teacher.showAllTeacher();
        if (teacherRes) {
            res.status(200).json({ error: false, message: 'Show All Teacher Operation Succeed',teacherRes});
        } else {
            res.status(404).json({error : true, message : 'There is no registered teacher yet'});
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
                console.log(teacher_password,teacherRes.teacher_password);
                const passwordMatched = await bcrypt.compare(teacher_password,teacherRes.teacher_password)
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

///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

router.get('/loginTeacher', async (req, res) => {

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