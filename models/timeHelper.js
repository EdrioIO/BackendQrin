const { DateTime } = require("luxon");


module.exports={
    getCurrentTime,
    compareBaseTime,
    getTimezoneOffset
}

// current timestamp in milliseconds
// function IntTwoChars(i) {
//   return (`0${i}`).slice(-2);
// }
var offset = new Date().getTimezoneOffset();
console.log(offset / 60);

function getTimezoneOffset(){
    var offset = new Date().getTimezoneOffset();
    return (offset / 60)
}

// var timeNow = new Date()
// console.log(timeNow.getHours(),timeNow.getMinutes(),timeNow.getSeconds(),timeNow.getTime())
// console.log(timeNow.toLocaleTimeString())
// var userTimezoneOffset = timeNow.getTimezoneOffset() * 60000;

// var finalTime = new Date(timeNow.getTime() - (userTimezoneOffset));
// console.log(finalTime.getHours(),finalTime.getMinutes(),finalTime.getSeconds(),finalTime.getTime())
// console.log(finalTime.toLocaleTimeString());


function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

// usage: Asia/Jakarta is GMT+7
console.log(convertTZ(new Date(), "Asia/Jakarta")) // Tue Apr 20 2012 17:10:30 GMT+0700 (Western Indonesia Time)

// Resulting value is regular Date() object
const convertedDate = convertTZ("2012/04/20 10:10:30 +0000", "Asia/Jakarta") 
convertedDate.getHours(); // 17

// Bonus: You can also put Date object to first arg
const date = new Date()
convertTZ(date, "Asia/Jakarta") 



async function getCurrentTime(){
    // const getColTimeFromDate = date => date.toTimeString().slice(0,8);
    // const ex = await getColTimeFromDate(new Date());
    // return ex;
    // var timeNow = new Date()
    // var userTimezoneOffset = timeNow.getTimezoneOffset() * 60000;
    // var finalTime = new Date(timeNow.getTime() - (userTimezoneOffset));
    
    return convertTZ(new Date(), "Asia/Jakarta")
}

// let date = new Date();
// console.log(date)
// var tz = date.toString().split("GMT")[1].split(" (")[0];
// tz = tz.substring(1,5);
// let hOffset = parseInt(tz[0]+tz[1]);
// let mOffset = parseInt(tz[2]+tz[3]);
// let offsets = date.getTimezoneOffset() * 60 * 1000;
// let localTime = date.getTime();
// let utcTime = localTime + offsets;
// let austratia_brisbane = utcTime + (3600000 * hOffset) + (60000 * mOffset);
// let customDate = new Date(austratia_brisbane);

// let data = {
//     day: customDate.getDate(),
//     month: customDate.getMonth() + 1,
//     year: customDate.getFullYear(),
//     hour: customDate.getHours(),
//     min: customDate.getMinutes(),
//     second: customDate.getSeconds(),
//     raw: customDate,
//     stringDate: customDate.toString()
// }


// console.log(data)

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
    console.log(time1)
    let times = timeSlicer(time1)

    console.log(times.slicedhour,times.slicedminute,times.slicedsec);
    const time1ToSec = times.slicedhour * 60 * 60 + times.slicedminute * 60 + times.slicedsec
    console.log(time1ToSec)
    
    let times2 = timeSlicer(time2);
    console.log(times2.slicedhour,times2.slicedminute,times2.slicedsec)
    const time2ToSec = times2.slicedhour * 60 * 60 + times2.slicedminute * 60 + times2.slicedsec
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