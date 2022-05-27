
module.exports = {
    getCurrentTime,
    compareBaseTime,
    getTimezoneOffset,
    getCurrentDate   
}

var offset = new Date().getTimezoneOffset();
console.log(offset / 60);

function getTimezoneOffset() {
    var offset = new Date().getTimezoneOffset();
    return (offset / 60)
}

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

// usage: Asia/Jakarta is GMT+7
console.log(convertTZ(new Date(), "Asia/Jakarta").getDate()) // Tue Apr 20 2012 17:10:30 GMT+0700 (Western Indonesia Time)

// Resulting value is regular Date() object
const convertedDate = convertTZ("2012/04/20 10:10:30 +0000", "Asia/Jakarta")
convertedDate.getHours(); // 17

// Bonus: You can also put Date object to first arg
const date = new Date()
convertTZ(date, "Asia/Jakarta")



async function getCurrentTime() {
    return convertTZ(new Date(), "Asia/Jakarta").toTimeString()
}

async function getCurrentDate() {
    return convertTZ(new Date(), "Asia/Jakarta").toDateString();
}

function IntTwoChars(i) {
    return (`0${i}`).slice(-2);
}

function timeSlicer(timeToSlice) {
    const slicedhour = timeToSlice.slice(0, 2)
    const slicedminute = timeToSlice.slice(3, 5)
    const slicedsec = timeToSlice.slice(6, 8)
    return { slicedhour, slicedminute, slicedsec }
}

function compareBaseTime(time1, time2) {
    console.log(time1)
    let times = timeSlicer(time1)

    console.log(Number(times.slicedhour), Number(times.slicedminute), Number(times.slicedsec));
    const time1ToSec = Number(times.slicedhour) * 60 * 60 + Number(times.slicedminute) * 60 + Number(times.slicedsec)
    console.log(time1ToSec)

    let times2 = timeSlicer(time2);
    console.log(Number(times2.slicedhour), Number(times2.slicedminute), Number(times2.slicedsec))
    const time2ToSec = Number(times2.slicedhour) * 60 * 60 + Number(times2.slicedminute) * 60 + Number(times2.slicedsec)
    console.log(time2ToSec)


    const compare = Math.abs(time1ToSec - time2ToSec)
    console.log(compare)

    return compare;
}

