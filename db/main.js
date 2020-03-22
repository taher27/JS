var time = new Date();
console.log(new Date(time.getTime()))
console.log(addMinutes(time, 15))

function addMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}