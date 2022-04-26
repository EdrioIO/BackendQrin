// tempat query untuk knex
// const knex = require('knex');
// const config = require('../database/knexfile');
// const db = knex(config.development);// TODO : ubah ke production nanti

const db = require('../database/dbConfig')

module.exports = {
    add,
    find,
    findById,
    deleteById,
    updateById,
    findAttendanceInquiry,
    deleteInquiry,
    //start project export
    findUserForLogin,
    findStudentById,
    findStudentByNIM,
    verifyRegister,
    showAllUser,
    addStudent,

}

function addStudent(student){
    return db('ms_student').insert(student, ['student_id', 'student_nim'])
}

// user & student func
function findStudentById(student_id){
    return db("ms_student")
    .where({student_id : student_id})
    .first()
}



function findStudentByNIM(student_nim){
    return db("ms_student")
    .select('*')
    .where({student_nim : student_nim})
    .first()
}

function verifyRegister(student_nim,student_email,student_phone){
    return db("ms_student")
    .where({student_nim : student_nim})
    .orWhere({student_email : student_email})
    .orWhere({student_phone : student_phone})
    .first()
}

function findUserForLogin(student_nim, student_password){
    return db("ms_student")
    .where({student_nim : student_nim, 
            student_password : student_password})
    .first()
}

function showAllUser(){
    return db("ms_student")
}

// insert new record
function add(info){
    const{id} = db("ms_staff".insert(info));
}

function find(info){
    return db("ms_staff")
}

// find student info by id
function findById(id){
    return db("ms_staff")
    .where({id : id})
    .first()
}
// remove record
function deleteById(id){
    return db("ms_staff")
    .where({id : id})
    .del()
}

function updateById(id, changes){
    return(
        db("ms_staff")
        .where({id : id})
        .update(changes)
        .then(()=>{
            return findById(id);
        })
    )
}

function findAttendanceInquiry(attendance_id){
    return db("ms_attendance as a").join("ms_inquiry as i", "a.id", "i.id")
    .select(
        "a.id as AttendanceID",
        "a.x as AttendanceX",
        "i.id as InquiryID",
        "i.sender as InquirySender"
    )
    .where({attendance_id : attendance_id})
}

function deleteInquiry(id){
    return db("ms_inquiry")
    .where({id : id})
    .del()
}

// update record


