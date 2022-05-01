
module.exports={
    compareBaseTime,
}

// current timestamp in milliseconds
// function IntTwoChars(i) {
//   return (`0${i}`).slice(-2);
// }

function IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

function timeSlicer(timeToSlice){
    slicedhour = timeToSlice.slice(0,2)
    slicedminute = timeToSlice.slice(3,5)
    slicedsec = timeToSlice.slice(6,8)
    return slicedhour, slicedminute, slicedsec
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
    
    let hours2, minutes2, seconds2 = timeSlicer(time2);
    console.log(hours2,minutes2,seconds2);
    const time2ToSec = hours2 * 60 * 60 + minutes2 * 60 + seconds2
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