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


///////////////////// END OF PRODUCTION /////////////////////





///////////////////// DEVELOPMENT /////////////////////

router.patch('/editPassword', async (req, res) => {
    const { teacher_id, teacher_password, teacher_password_new } = req.body
    try {
        const teacherRes = await teacher.findTeacherById(teacher_id);
        if (teacherRes) {
            try {
                console.log(teacher_password,teacherRes.teacher_password);
                const passwordMatched = await bcrypt.compare(teacher_password, teacherRes.teacher_password)
                if (passwordMatched) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(teacher_password_new, salt);
                        await student.alterTeacherProfilePassword(teacher_id, hashedPassword);
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





//TODO : alter teacher pass
//TODO : Register teacher
//TODO : Show QR
//TODO : Inquiry
//TODO : manual absen


///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;