// const http = require('http');

// const scrape = "/api/scrape/default"
// const namespaces = "/api/namespaces"

// console.log(__dirname )

// http.get('http://localhost:60000'+scrape, resp => {
//         let data = "";

//         resp.on("data", chunk => {
//             data += chunk;
//         });

//         resp.on("end", () => {
//             let pods = JSON.parse(data).pods;
//             console.log(pods);
//             document.getElementById('table').innerHTML=pods;
//         });
//     })
//     .on("error", (err) => {
//         console.log("Error: " + err);
//     });


// // function getData(url) {
// //     http.get('http://localhost:60000'+url, resp => {
// //         let data = "";

// //         resp.on("data", chunk => {
// //             data += chunk;
// //         });

// //         resp.on("end", () => {
// //             let pods = JSON.parse(data).pods;
// //             console.log("inside getData" + pods);
// //             // return pods;
// //         });
// //     })
// //     .on("error", (err) => {
// //         console.log("Error: " + err);
// //     });
// // }
