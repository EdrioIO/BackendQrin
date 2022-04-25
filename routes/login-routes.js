const express = require('express');
const staff = require('../models/dbHelpers');

const router = express.Router()

// app.use(router);

//client request to server to get respond
//req for request , res for respond

router.get('/', (req,res)=>{
    res.json({message : "this is homepage root for testing staff router"})
})


router.post('/api/staff', (req,res)=>{
    staff.add(req.body).then(staff =>{
        res.status(200).json(staff);
    }).catch(error => {
        res.status(500).json({message : 'cannot add stuff'})
    })
})

router.get('/api/staff', (req,res) =>{
    staff.find(req.body).then(staff =>{
        res.status(200).json(staff);
    }).catch(error=>{
        req.status(500).json({message : 'cannot display db staff'})
    })
})

router.get('/api/staff/:id', (req,res)=>{
    const {id} = req.params
    staff.findById(req.params.id)
    .then(staff =>{
        if(staff){
            res.status(200).json(staff)
        }
        else{
            res.status(404).json({message : 'Cannot find the id inputted'})
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform operation'})
    })
})

router.delete('/api/staff/:id', (req,res) =>{
    const {id} = req.param.id;
    staff.deleteById(req.params.id)
    .then(count => {
        if(count > 0){
            res.status(200).json({message : 'Successfuly deleted'})
        }
        else{
            res.status(404).json({message : 'Cannot find the record by inputted id'})
        }
    }).catch(err =>{
        res.status(500).json({message : 'Unable to perform delete operation'})
    })
})

router.patch('/api/staff/:id', (req,res) =>{
    const {id} = req.params.id;
    const changes = req.body

    staff.updateById(req.params.id)
    .then(ms_staff =>{
        if(ms_staff){
            res.status(200).json(ms_staff)
        }
        else{
            res.status(404).json({message : 'update not found by inputed id'})
        }
    }).catch(err =>{
        res.status(500).json({message : 'unable to perform update operation'});
    })
})

// adding record to child table
router.post('/api/attendance/:id/inquiry', (req,res) => {
    const {id} = req.params;
    const inq = req.body;

    if(!inq.attendance_id){
        inq["attendance_id"] = parseInt(id, 10);
    }
    // attendance.findById(id).then(attendance =>{
        // if(!attendance){
        //     res.status(404).json({message : 'invalid id'})
        // }
        //check for all required field on init migration
        // if (!requiredNotnullablefield || ....){
            // res.status(400).json({message :'Must provide required att1, req att 2 '})
        // } 
        // xx.functionton to add something(inquiry,id).then(inquiryData => {
        //     if(inquiryData){
        //         res.status(200).json(inquiryData)
        //     }
        // }).catch(err =>{
        //     res.status(500).json({message : 'Error finding data'});
        // })

    // }).catch(err =>{
        // res.status(500).json({message : 'error finding inquiry'})
    // })

    router.get('/api/attendance/:id/inquiry', (req,res) =>{
        const {id} = req.params;
        staff.findAttendanceInquiry(id)
        .then(staff => {
            res.status(200).json(staff);
        }).catch(err =>{
            res.status(500).json({message : "Error retrieving messages"})
        })
    })

})


router.delete('/api/inquiry/:id',(req,res)=>{
    const {id} = req.params;
    staff.deleteInquiry(id)
    .then(count =>{
        if(count > 0){
            res.status(200).json({message : `Message wih id ${id} successfully deleted`})
        }
        else{
            res.status(404).json({message : `No message with ${id} id`});
        }
    }).catch(err => {
        res.status(500).json({message : 'Error with delete inquiry operation'})
    })
})


module.exports = router;