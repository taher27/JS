// const fs = require("fs");
// var $ = require("jQuery")
const filePath = '/tmp/.roost';
var value = "";
var dt = new Date()
document.getElementById("data").innerHTML += "<span style='float:right;'>"+dt.getHours()+":"+dt.getMinutes()+" "+dt.getSeconds()+"</span>";
// function loadData() {
//         fs.watch(filePath,(eventType,filename) => {
//             fs.readFile('/tmp/.roost', (err, data) => { 
//                 if (err) throw err; 
//                 value += "<p id='data'>" + data.toString() +"</p>";
//                 document.getElementById("demo").innerHTML = value
//                 console.log(data.toString()); 
//             });
//         });
    
// }

// loadData()