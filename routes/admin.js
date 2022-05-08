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

router.get('/adminAccess', (req,res)=>{
    const adminKey = req.body

    if(adminKey == process.env.adminKey){
        // TODO : create session that saves adminKey, FE go to homepage(2 menu generate report and register data)
    }

})

router.get('/generateReport', (req,res) =>{

    const {course_id,session_id, student_generation} = req.body();
    //grab admin key from session

    // to do wrap try catch on if session.adminKey == proccess.env.ADMIN_KEY

    try{
        // const reportRes = admin.
    }catch(err){
        console.log(err);
        res.status(500).json({error : true, message : 'Generate Report Failed'});
    }

})


router.get('/ms_student', (req,res) =>{
    
})



///////////////////// END OF DEVELOPMENT /////////////////////


module.exports = router;