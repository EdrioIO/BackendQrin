
module.exports={
    getCurrentTime,
    compareBaseTime,

}

// current timestamp in milliseconds
// function IntTwoChars(i) {
//   return (`0${i}`).slice(-2);
// }

// let date_ob = new Date();
// let date = IntTwoChars(date_ob.getDate());
// let month = IntTwoChars(date_ob.getMonth() + 1);
// let year =  IntTwoChars(date_ob.getFullYear());
// let hours = IntTwoChars(date_ob.getHours() - 1);
// let minutes = IntTwoChars(date_ob.getMinutes());
// let seconds = IntTwoChars(date_ob.getSeconds());
// let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;

// console.log(dateDisplay)

async function getCurrentTime(){
    // const getColTimeFromDate = date => date.toTimeString().slice(0,8);
    // const ex = await getColTimeFromDate(new Date());
    // return ex;
    const timeNow = new Date();
    return timeNow;
}

function IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

function timeSlicer(timeToSlice){
    slicedhour = timeToSlice.slice(0,2)
    slicedminute = timeToSlice.slice(3,5)
    slicedsec = timeToSlice.slice(6,8)
    return slicedhour, slicedminute, slicedsec
}

function compareBaseTime(time1, time2){
    let hours = IntTwoChars(time1.getHours());
    let minutes = IntTwoChars(time1.getMinutes());
    let seconds = IntTwoChars(time1.getSeconds());

    const time1ToSec = hours * 60 * 60 + minutes * 60 + seconds

    
    let hours2, minutes2, seconds2 = timeSlicer(time2);
    const time2ToSec = hours2 * 60 * 60 + minutes2 * 60 + seconds2

    const compare = Math.abs(time1ToSec - time2ToSec)

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