// tempat query untuk knex
// const knex = require('knex');
// const config = require('../database/knexfile');
// const db = knex(config.development);// TODO : ubah ke production nanti

const db = require('../database/dbConfig')
const time = require('./timeHelper')

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
    // courseTakenById,
    // checkQRCode,
    // checkStudentLocation,
    // checkPresenceIn,
    // checkPresenceOut,
    grabAttendData,
    alterPresenceData,
    submitInquiry,
    alterStudentProfilePassword,
    alterStudentProfilePhone,
    alterPresenceDate,
    grabTakenCourse,

}

function grabTakenCourse(student_id){
    return db('ms_student')
    .join('ms_course_taken', 'ms_student.student_id', 'ms_course_taken.student_id')
    .join('ms_course','ms_course_taken.course_id', 'ms_course.course_id')
    .join('ms_session','ms_session.course_id','ms_course.course_id')
    .select('student_id', 'course_id','course_name', 'course_code', 'session_id','session_name')
    .where({ 'ms_student.student_id': student_id})
}

async function alterStudentProfilePhone(student_id,student_phone){
    db('ms_student')
        .where({ student_id })
        .update({ student_phone})
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

async function alterStudentProfilePassword(student_id, hashedPassword) {
    db('ms_student')
        .where({ student_id })
        .update({ student_password: hashedPassword })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}



function submitInquiry(student_id, details) {
    return db('ms_inquiry').insert({ student_id, details }, ['student_id', 'details'])
}


function grabAttendData(student_id, qr_code) {
    return db('ms_student')
        .join('ms_attendance', 'ms_student.student_id', 'ms_attendance.student_id')
        .join('ms_session_header', 'ms_session_header.session_header_id', 'ms_attendance.session_header_id')
        .join('ms_session', 'ms_session_header.session_id', 'ms_session.session_id')
        .join('ms_class', 'ms_class.class_id', 'ms_session_header.class_id')
        .select('student_nim', 'qr_code', 'latitude', 'longitude', 'altitude', 'presence_in_time', 'presence_out_time', 'base_in_time', 'base_out_time', 'attendance_id')
        .where({ 'ms_student.student_id': student_id, 'ms_session.qr_code': qr_code })
}

function alterPresenceDate(attendance_id, dateSample) {
    db('ms_attendance')
        .where({ attendance_id: attendance_id })
        .update({ date: dateSample })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function alterPresenceData(attendance_id, attend_type, currentTime,isNotLateIn,isNotLateOut) {
    if (attend_type == 'in') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_in_time: currentTime.slice(0, 8), presence_in_status : isNotLateIn})
            .returning('*')
            .then(result => {
                console.log('res :' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }

    else {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_out_time: currentTime.slice(0, 8), presence_out_status : isLateOut })
            .returning('*')
            .then(result => {
                console.log('res : ' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }
}


function addStudent(student) {
    return db('ms_student').insert(student, ['student_id', 'student_nim'])
}



// user & student func
function findStudentById(student_id) {
    return db("ms_student")
        .select('*')
        .where({ student_id: student_id })
        .first()
}


function findStudentByNIM(student_nim) {
    return db("ms_student")
        .select('*')
        .where({ student_nim: student_nim })
        .first()
}

function verifyRegister(student_email, student_phone) {
    return db("ms_student")
        .select('*')
        .where({ student_email: student_email })
        .orWhere({ student_phone: student_phone })
        .first()
}

function findUserForLogin(student_nim, student_password) {
    return db("ms_student")
        .where({
            student_nim: student_nim,
            student_password: student_password
        })
        .first()
}

function showAllUser() {
    return db("ms_student")
}

// insert new record
function add(info) {
    const { id } = db("ms_staff".insert(info));
}

function find(info) {
    return db("ms_staff")
}

// find student info by id
function findById(id) {
    return db("ms_staff")
        .where({ id: id })
        .first()
}
// remove record
function deleteById(id) {
    return db("ms_staff")
        .where({ id: id })
        .del()
}

function updateById(id, changes) {
    return (
        db("ms_staff")
            .where({ id: id })
            .update(changes)
            .then(() => {
                return findById(id);
            })
    )
}

function findAttendanceInquiry(attendance_id) {
    return db("ms_attendance as a").join("ms_inquiry as i", "a.id", "i.id")
        .select(
            "a.id as AttendanceID",
            "a.x as AttendanceX",
            "i.id as InquiryID",
            "i.sender as InquirySender"
        )
        .where({ attendance_id: attendance_id })
}

function deleteInquiry(id) {
    return db("ms_inquiry")
        .where({ id: id })
        .del()
}

// update record


