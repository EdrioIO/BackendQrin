const db = require('./dbHelpers')


module.exports={
    getCurrentTime,
    compareBaseTime,

}

// current timestamp in milliseconds
// function IntTwoChars(i) {
//   return (`0${i}`).slice(-2);
// }







async function getCurrentTime(){
    // const getColTimeFromDate = date => date.toTimeString().slice(0,8);
    // const ex = await getColTimeFromDate(new Date());
    // return ex;
    const timeNow = new Date();
    return timeNow;
}

// const date_ob = db.getTimeDev();
// let date = IntTwoChars(date_ob.getDate());
// let month = IntTwoChars(date_ob.getMonth() + 1);
// let year =  IntTwoChars(date_ob.getFullYear());
// let hours = IntTwoChars(date_ob.getHours());
// let minutes = IntTwoChars(date_ob.getMinutes());
// let seconds = IntTwoChars(date_ob.getSeconds());
// let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;
// console.log(hours,minutes,seconds)


function IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

function timeSlicer(timeToSlice){
    const slicedhour = timeToSlice.slice(0,2)
    const slicedminute = timeToSlice.slice(3,5)
    const slicedsec = timeToSlice.slice(6,8)
    return {slicedhour, slicedminute, slicedsec}
}



// const curdate = getCurrentTime();
//     let hourx = IntTwoChars(curdate.getHours());
//     let minutesx = IntTwoChars(curdate.getMinutes());
//     let secondsx = IntTwoChars(curdate.getSeconds());
//     console.log(hourx,minutesx,secondsx)

function compareBaseTime(time1, time2){
    let hours = IntTwoChars(time1.getHours());
    let minutes = IntTwoChars(time1.getMinutes());
    let seconds = IntTwoChars(time1.getSeconds());

    console.log(hours,minutes,seconds);
    const time1ToSec = (hours) * 60 * 60 + minutes * 60 + seconds
    console.log(time1ToSec)
    
    let times = timeSlicer(time2);
    console.log(times.slicedhour,times.slicedminute,times.slicedsec)
    const time2ToSec = times.slicedhour * 60 * 60 + times.slicedminute * 60 + times.slicedsec
    console.log(time2ToSec)
    const compare = Math.abs(time1ToSec - time2ToSec)
    console.log(compare)

    return compare
}

// function getDifferenceInDays(date1, date2) {
//     const diffInMs = Math.abs(date2 - date1);
//     return diffInMs / (1000 * 60 * 60 * 24);
//   }
  
//   function getDifferenceInHours(date1, date2) {
//     const diffInMs = Math.abs(date2 - date1);
//     return diffInMs / (1000 * 60 * 60);
//   }
  
//   function getDifferenceInMinutes(date1, date2) {
//     const diffInMs = Math.abs(date2 - date1);
//     return diffInMs / (1000 * 60);
//   }
  
//   function getDifferenceInSeconds(date1, date2) {
//     const diffInMs = Math.abs(date2 - date1);
//     return diffInMs / 1000;
//   }
  
//   const date1 = new Date('7/13/2010');
//   const date2 = new Date('7/12/2010');
//   console.log(getDifferenceInDays(date1, date2));
//   console.log(getDifferenceInHours(date1, date2));
//   console.log(getDifferenceInMinutes(date1, date2));
//   console.log(getDifferenceInSeconds(date1, date2));