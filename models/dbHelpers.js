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

    //User
    findUserForLogin,
    findStudentById,
    findStudentByNIM,
    verifyRegister,
    addStudent,
    addTeacher,
    addCourse,
    addSession,
    addClass,
    addProgram,
    addTakenCourse,
    addTeachedCourse,
    addSessionHeader,
    addAttendance,
    grabAttendData,
    alterPresenceData,
    submitInquiry,
    alterStudentProfilePassword,
    alterStudentProfilePhone,
    alterPresenceDate,
    grabTakenCourse,
    grabCourseSession,
    userAttendance,
    checkRegisteredCourse,


    // teacher 
    findTeacherByNIP,
    findTeacherById,
    showAllTeacher,
    alterTeacherProfilePassword,
    showTeacherRelatedCourse,
    showCourseRelatedSession,
    grabSessionQRCode,
    showGenerationRelatedForSession,
    grabAttendDataLecturerVer,
    manualAttend,
    manualReset,
    displayListAttendance,
    submitInquiryTeacher,
    alterTeacherProfilePhone,
    submitInquiryTeacher,

    // admin
    generateReport,
    showAllCourse,
    registerStudent,
    registerTeacher,
    registerCourse,
    registerSession,
    registerClass,
    registerProgram,
    registerStudentCourse,
    registerTeachedCourse,
    grabStudentData,
    grabStudentCourseNot,
    showInquiryUser,
    reviewInquiryUser,
    showInquiryTeacher,
    reviewInquiryTeacher,
    editStudentData,
    showAllUser,
    showAllTeacher,
    editTeacherData,
    editCoursedata,
    editSessionData,
    showAllClass,
    editClassData,
    showAllProgram,
    editProgramData,
    editCourseTeachedData,
    editCourseTakenData,
    editSessionHeaderData,
    editAttendanceData,
    showAllCourseTeached,
    showAllCourseTaken,
    showAllSessionHeader,
    showStudentGeneration,
    showGenerationList,
    showAllSession,
    grabTeacherCourseNot,
    findSessionHeaderAtt,
    findAttWithSessionHeader

}


/////////////////////ADMIN//////////////////

function showAllSession() {
    return db('ms_session')
}

function showStudentGeneration(student_generation) {
    return db('ms_student')
        .where({ student_generation })
}

function showGenerationList() {
    return db('ms_student')
        .distinct('student_generation')
}

function showAllCourseTaken() {
    return db('ms_course_taken')
}

function showAllSessionHeader() {
    return db('ms_session_header')
        .join('ms_session', 'ms_session.session_id', 'ms_session_header.session_id')
        .join('ms_teacher', 'ms_teacher.teacher_id', 'ms_session_header.teacher_id')
        .join('ms_class', 'ms_class.class_id', 'ms_session_header.class_id')
        .select('ms_session_header.session_header_id', 'ms_session.session_id', 'ms_session.session_name', 'ms_teacher.teacher_id',
            'ms_teacher.teacher_name', 'ms_class.class_id', 'ms_class.class_name', 'ms_session_header.session_date')
}

function showAllCourseTeached() {
    return db('ms_course_teached')
}

function editCourseTakenData(course_taken_id, course_id, student_id) {
    return db('ms_course_taken')
        .where({ course_taken_id })
        .update({ course_id, student_id })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editCourseTeachedData(course_teached_id, course_id, teacher_id) {
    return db('ms_course_teached')
        .where({ course_teached_id })
        .update({ course_id, teacher_id })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editProgramData(program_id, program_name) {
    return db('ms_program')
        .where({ program_id })
        .update({ program_name })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editSessionHeaderData(session_header_id, session_id, teacher_id, class_id, session_date) {
    return db('ms_session_header')
        .where({ session_header_id })
        .update({ session_id, teacher_id, class_id, session_date })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editAttendanceData(attendance_id, session_header_id, student_id, presence_in_time, presence_out_time, presence_in_status, presence_out_status) {
    return db('ms_attendance')
        .where({ attendance_id })
        .update({ session_header_id, student_id, presence_in_time, presence_out_time, presence_in_status, presence_out_status })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function showAllProgram() {
    return db('ms_program')
}

function editClassData(class_id, class_name, latitude, longitude, altitude) {
    return db('ms_class')
        .where({ class_id })
        .update({ class_name, latitude, longitude, altitude })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function showAllClass() {
    return db('ms_class')
}

function reviewInquiryUser(inquiry_id, is_reviewed) {
    return db('ms_inquiry')
        .where({ inquiry_id })
        .update({ is_reviewed })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function reviewInquiryTeacher(inquiry_teacher_id, is_reviewed) {
    return db('ms_inquiry_teacher')
        .where({ inquiry_teacher_id })
        .update({ is_reviewed })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editSessionData(session_id, session_name, base_in_time, base_out_time, qr_code, course_id) {
    return db('ms_session')
        .where({ session_id })
        .update({ session_name, base_in_time, base_out_time, qr_code, course_id })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editCoursedata(course_id, course_name, course_code) {
    return db('ms_course')
        .where({ course_id })
        .update({ course_name, course_code })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function editTeacherData(teacher_id, teacher_nip, teacher_name, teacher_email, teacher_phone, hashed_password, teacher_dob) {
    return db('ms_teacher')
        .where({ teacher_id })
        .update({ teacher_nip, teacher_name, teacher_email, teacher_phone, teacher_password: hashed_password, teacher_dob })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })

}

function showAllTeacher() {
    return db('ms_teacher')
}

function editStudentData(student_id, student_nim, student_name, student_email, student_phone, hashed_password, student_dob, student_study_program, student_generation) {
    return db('ms_student')
        .where({ student_id })
        .update({ student_nim, student_name, student_email, student_phone, student_password: hashed_password, student_dob, student_study_program, student_generation })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })

}

function showInquiryTeacher() {
    return db('ms_inquiry_teacher')
        .join('ms_teacher', 'ms_teacher.teacher_id', 'ms_inquiry_teacher.teacher_id')
        .select('ms_teacher.teacher_id', 'ms_teacher.teacher_nip', 'ms_teacher.teacher_name',
            'ms_inquiry_teacher.inquiry_teacher_id', 'ms_inquiry_teacher.details',
            'ms_inquiry_teacher.inquiry_header', 'ms_inquiry_teacher.is_reviewed')
}

function showInquiryUser() {
    {
        return db('ms_inquiry')
            .join('ms_student', 'ms_student.student_id', 'ms_inquiry.student_id')
            .select('ms_student.student_id', 'ms_student.student_nim', 'ms_student.student_name', 'ms_inquiry.inquiry_id',
                'ms_inquiry.details', 'ms_inquiry.inquiry_header', 'ms_inquiry.is_reviewed')
    }
}

function grabStudentCourseNot(student_id) {
    return db('ms_course')
        .whereNotExists(db.select('*').from('ms_course_taken')
            .where({ student_id })
            .whereRaw('ms_course.course_id = ms_course_taken.course_id'))
}

function grabTeacherCourseNot(teacher_id) {

    return db('ms_course')
        .whereNotExists(db.select('*').from('ms_course_teached')
            .where({ teacher_id })
            .whereRaw('ms_course.course_id = ms_course_teached.course_id'))

}

function findSessionHeaderAtt(session_id, teacher_id, class_id, session_date) {
    return db('ms_session_header')
        .join('ms_session', 'ms_session.session_id', 'ms_session_header.session_id')
        .join('ms_teacher', 'ms_teacher.teacher_id', 'ms_session_header.teacher_id')
        .join('ms_class', 'ms_class.class_id', 'ms_session_header.class_id')
        .select('session_header_id', 'ms_teacher.teacher_id', 'ms_teacher.teacher_name', 'ms_class.class_id'
            , 'ms_class.class_name', 'ms_session.session_id', 'ms_session.session_name', 'ms_session_header.session_date')
        .where(
            {'ms_session_header.session_id' : session_id, 
            'ms_session_header.teacher_id' : teacher_id, 
            'ms_session_header.class_id' : class_id, 
            'ms_session_header.session_date' : session_date }
        )
        .first()
}

function findAttWithSessionHeader(session_header_id) {
    return db('ms_attendance')
    .join('ms_student','ms_student.student_id','ms_attendance.student_id')
    .select('ms_attendance.attendance_id','ms_attendance.session_header_id','ms_student.student_id','ms_student.student_name','ms_student.student_nim',
    'ms_attendance.presence_in_time','ms_attendance.presence_out_time','ms_attendance.presence_in_status','ms_attendance.presence_out_status')
        .where({'ms_attendance.session_header_id' : session_header_id })
}




function grabStudentData() {
    return db('ms_student')
        .select('student_id', 'student_nim', 'student_name')
}

function showAllCourse() {
    return db('ms_course')
}

function registerStudent(student_nim, student_name, student_email, student_phone, hashed_password, student_dob, student_study_program, student_generation) {
    db('ms_student')
        .insert({
            student_nim: student_nim,
            student_name: student_name,
            student_email: student_email,
            student_phone: student_phone,
            student_password: hashed_password,
            student_dob: student_dob,
            student_study_program: student_study_program,
            student_generation: student_generation
        })
}

function registerTeacher(teacher_nip, teacher_name, teacher_email, teacher_phone, hashed_password, teacher_dob) {
    db('ms_teacher')
        .insert({
            teacher_nip: teacher_nip,
            teacher_name: teacher_name,
            teacher_email: teacher_email,
            teacher_phone: teacher_phone,
            teacher_password: hashed_password,
            teacher_dob: teacher_dob,
        }, ['teacher_nip', 'teacher_name', 'teacher_emai', 'teacher_phone', 'teacher_password', 'teacher_dob'])
}

function registerCourse(course_name, course_code) {
    db('ms_course')
        .insert({
            course_name: course_name,
            course_code: course_code
        })
}

function registerSession(session_name, base_in_time, base_out_time, qr_code, course_id) {
    db('ms_session')
        .insert({
            session_name: session_name,
            base_in_time: base_in_time,
            base_out_time: base_out_time,
            qr_code: qr_code,
            course_id: course_id
        })
}

function registerClass(class_name, latitude, longitude, altitude) {
    db('ms_class')
        .insert({
            class_name: class_name,
            latitude: latitude,
            longitude: longitude,
            altitude: altitude
        })
}

function registerProgram(program_name) {
    db('ms_program')
        .insert({
            program_name: program_name
        })
}

function registerStudentCourse(student_id, course_id) {
    {
        db('ms_course_taken')
            .insert({
                student_id: student_id,
                course_id: course_id
            })
    }
}

function registerTeachedCourse(teacher_id, course_id) {
    db('ms_course_teached')
        .insert({
            teacher_id: teacher_id,
            course_id: course_id
        })
}



async function generateReport(course_id, session_id, student_generation) {
    return db('ms_student')
        .join('ms_taken_course', 'ms_student.student_id', 'ms_taken_course.student_id')
        .join('ms_course', 'ms_course.course_id', 'ms_taken_course.course_id')
        .join('ms_session', 'ms_course.course_id', 'ms_session.course_id')
        .join('ms_session_header', 'ms_session_header.session_id', 'ms_session.session_id')
        .join('ms_attendance', 'ms_attendance.session_header_id', 'ms_session_header.session_header_id')
        .select('ms_student')

}








////////////////teacher/////////////////


function submitInquiry(teacher_id, inquiry_header, details) {
    return db('ms_inquiry_teacher').insert({ teacher_id, inquiry_header, details }, ['teacher_id', 'details', 'inquiry_header'])
}

async function alterTeacherProfilePhone(teacher_id, teacher_phone) {
    db('ms_teacher')
        .where({ teacher_id })
        .update({ teacher_phone })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}

function submitInquiryTeacher(teacher_id, details, inquiry_header) {
    return db('ms_inquiry_teacher').insert({ teacher_id, inquiry_header, details }, ['teacher_id', 'details', 'inquiry_header'])
}

function displayListAttendance(session_id, student_generation) {
    return db('ms_session_header')
        .join('ms_attendance', 'ms_attendance.session_header_id', 'ms_session_header.session_header_id')
        .join('ms_student', 'ms_student.student_id', 'ms_attendance.student_id')
        .select('ms_student.student_id', 'ms_student.student_name', 'ms_attendance.presence_in_time',
            'ms_attendance.presence_in_status', 'ms_attendance.presence_out_time', 'ms_attendance.presence_out_status')
        .where({ 'ms_student.student_generation': student_generation, 'ms_session_header.session_id': session_id })
}

function grabAttendDataLecturerVer(student_id, session_id) {
    return db('ms_student')
        .join('ms_attendance', 'ms_student.student_id', 'ms_attendance.student_id')
        .join('ms_session_header', 'ms_session_header.session_header_id', 'ms_attendance.session_header_id')
        .join('ms_session', 'ms_session_header.session_id', 'ms_session.session_id')
        .select('ms_attendance.attendance_id', 'ms_session.base_in_time', 'ms_session.base_out_time')
        .where({ 'ms_student.student_id': student_id, 'ms_session.session_id': session_id })
}

function manualAttend(attendance_id, attend_type, base_in_time, base_out_time) {
    if (attend_type == 'in') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_in_time: base_in_time, presence_in_status: true })
            .returning('*')
            .then(result => {
                console.log('res :' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }

    else if (attend_type == 'out') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_out_time: base_out_time, presence_out_status: true })
            .returning('*')
            .then(result => {
                console.log('res : ' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }
}

function manualReset(attendance_id, attend_type) {
    if (attend_type == 'in') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_in_time: null, presence_in_status: false })
            .returning('*')
            .then(result => {
                console.log('res :' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }

    else if (attend_type == 'out') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_out_time: null, presence_out_status: false })
            .returning('*')
            .then(result => {
                console.log('res : ' + result);
            }).catch(err => {
                console.log('err : ' + err);
            })
    }
}


function showGenerationRelatedForSession(session_id) {
    return db('ms_teacher')
        .join('ms_course_teached', 'ms_course_teached.teacher_id', 'ms_teacher.teacher_id')
        .join('ms_course', 'ms_course_teached.course_id', 'ms_course.course_id')
        .join('ms_session', 'ms_course.course_id', 'ms_session.course_id')
        .join('ms_course_taken', 'ms_course_taken.course_id', 'ms_course.course_id')
        .join('ms_student', 'ms_student.student_id', 'ms_course_taken.student_id')
        .distinct('ms_student.student_generation')
        .where({ 'ms_session.session_id': session_id })
}

function showTeacherRelatedCourse(teacher_id) {
    return db('ms_teacher')
        .join('ms_course_teached', 'ms_course_teached.teacher_id', 'ms_teacher.teacher_id')
        .join('ms_course', 'ms_course_teached.course_id', 'ms_course.course_id')
        .select('ms_course.course_id', 'ms_course.course_name', 'ms_course_teached.course_teached_id')
        .where({ 'ms_teacher.teacher_id': teacher_id })
}



function showCourseRelatedSession(course_id) {
    return db('ms_session')
        .where({ course_id })
}

function grabSessionQRCode(session_id) {
    return db('ms_session')
        .select('qr_code')
        .where({ session_id })
        .first()
}

async function alterTeacherProfilePassword(teacher_id, hashedPassword) {
    db('ms_teacher')
        .where({ teacher_id })
        .update({ teacher_password: hashedPassword })
        .returning('*')
        .then(result => {
            console.log('res :' + result);
        }).catch(err => {
            console.log('err : ' + err);
        })
}


function findTeacherById(teacher_id) {
    return db("ms_teacher")
        .select('*')
        .where({ teacher_id })
        .first()
}


function findTeacherByNIP(teacher_nip) {
    return db("ms_teacher")
        .select('*')
        .where({ teacher_nip })
        .first()
}
function showAllTeacher() {
    return db("ms_teacher")
}


//////////////student/////////////


function checkRegisteredCourse(student_id, session_id) {
    return db('ms_course_taken')
        .join('ms_course', 'ms_course.course_id', 'ms_course_taken.course_id')
        .join('ms_session', 'ms_session.course_id', 'ms_course.course_id')
        .select('ms_course.course_name', 'ms_session.session_name', 'ms_course_taken.student_id')
        .where({ 'ms_course_taken.student_id': student_id, 'ms_session.session_id': session_id })
}

function grabCourseSession(student_id, course_id) {
    return db('ms_course')
        .join('ms_session', 'ms_course.course_id', 'ms_session.course_id')
        .join('ms_session_header', 'ms_session_header.session_id', 'ms_session.session_id')
        .join('ms_attendance', 'ms_attendance.session_header_id', 'ms_session_header.session_header_id')
        .select('ms_session.session_name', 'ms_session.base_in_time', 'ms_session.base_out_time',
            'ms_attendance.presence_in_time', 'ms_attendance.presence_out_time', 'ms_attendance.presence_in_status',
            'ms_attendance.presence_out_status')
        .where({ 'ms_course.course_id': course_id, 'ms_attendance.student_id': student_id })
}

function grabCSession(student_id, course_id) {
    return db('ms_course')
        .join('ms_session', 'ms_course.course_id', 'ms_session.course_id')
}

function userAttendance(student_id) {
    return db('ms_student')
        .join('ms_course_taken', 'ms_student.student_id', 'ms_course_taken.student_id')
        .join('ms_course', 'ms_course_taken.course_id', 'ms_course.course_id')
        .join('ms_session', 'ms_session.course_id', 'ms_course.course_id')
        .join('ms_session_header', 'ms_session.session_id', 'ms_session_header.session_id')
        .join('ms_attendance', 'ms_session_header.session_header_id', 'ms_attendance.session_header_id')
        .select('ms_student.student_id', 'ms_course.course_id', 'ms_course.course_name',
            'ms_course.course_code', 'ms_session.session_id', 'ms_session.session_name', 'ms_session.base_in_time',
            'ms_session.base_out_time', 'ms_attendance.presence_in_time', 'ms_attendance.presence_out_time',
            'ms_attendance.presence_in_status', 'ms_attendance.presence_out_status')
        .where({ 'ms_student.student_id': student_id })
}

function grabTakenCourse(student_id) {
    return db('ms_student')
        .join('ms_course_taken', 'ms_student.student_id', 'ms_course_taken.student_id')
        .join('ms_course', 'ms_course_taken.course_id', 'ms_course.course_id')
        .select('ms_student.student_id', 'ms_course.course_id', 'ms_course.course_name', 'ms_course_taken.course_taken_id')
        .where({ 'ms_student.student_id': student_id })
}

async function alterStudentProfilePhone(student_id, student_phone) {
    db('ms_student')
        .where({ student_id })
        .update({ student_phone })
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



function submitInquiry(student_id, inquiry_header, details) {
    return db('ms_inquiry').insert({ student_id, inquiry_header, details }, ['student_id', 'details', 'inquiry_header'])
}


function grabAttendData(student_id, qr_code) {
    return db('ms_student')
        .join('ms_attendance', 'ms_student.student_id', 'ms_attendance.student_id')
        .join('ms_session_header', 'ms_session_header.session_header_id', 'ms_attendance.session_header_id')
        .join('ms_session', 'ms_session_header.session_id', 'ms_session.session_id')
        .join('ms_class', 'ms_class.class_id', 'ms_session_header.class_id')
        .select('student_nim', 'qr_code', 'latitude', 'longitude', 'altitude', 'presence_in_time', 'presence_out_time', 'base_in_time', 'base_out_time', 'attendance_id', 'ms_session.session_id')
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

function alterPresenceData(attendance_id, attend_type, currentTime, isNotLateIn, isNotLateOut) {
    if (attend_type == 'in') {
        db('ms_attendance')
            .where({ attendance_id: attendance_id })
            .update({ presence_in_time: currentTime.slice(0, 8), presence_in_status: isNotLateIn })
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
            .update({ presence_out_time: currentTime.slice(0, 8), presence_out_status: isLateOut })
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

function addTeacher(teacher) {
    return db('ms_teacher').insert(teacher, ['teacher_id', 'teacher_nip'])
}

function addCourse(course) {
    return db('ms_course').insert(course, ['course_id', 'course_name'])
}

function addSession(session) {
    return db('ms_session').insert(session, ['session_id', 'session_name'])
}

function addClass(room) {
    return db('ms_class').insert(room, ['class_id', 'class_name'])
}

function addProgram(program) {
    return db('ms_program').insert(program, ['program_id'])
}

function addTakenCourse(takenCourse) {
    return db('ms_course_taken').insert(takenCourse, ['course_taken_id'])
}

function addTeachedCourse(teachedCourse) {
    return db('ms_course_teached').insert(teachedCourse, ['course_teached_id'])
}

function addSessionHeader(sessionHeader) {
    return db('ms_session_header').insert(sessionHeader, ['session_header_id'])
}

function addAttendance(attendance) {
    return db('ms_attendance').insert(attendance, ['attendance_id'])
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


