const express = require('express');
const app = express();
const http = require('http');

app.listen("60001", () => {console.log('Server with 60001 port is listening')});
let pods="";


app.get('/api/namespaces', (req, res) => {
    let table="<table style='border: 1px solid black; padding: 5px; margin: 5px;'><tr><th>Name</th><th>Node</th><th>Status</th><th>Age</th><th>CPU</th><th>Memory</th></tr></table>";
    pods.forEach(p => {
        table+="<tr><td>"+p.metadata.name +"</td><td>"+p.spec.nodeName+"</td><td>"+p.status.phase +"</td><td>"+
            p.spec.nodeName+"</td><td>"+p.status.startTime+"</td></tr><br>";
    });
    res.send(table);
})
.on("error", err => {
    console.log("error: "+ err);
});

http.get("http://localhost:60000/api/scrape/default", resp => {
    let data= "";
    resp.on("data", chunk => {
        data += chunk;
    });
    resp.on("end", () => {
        pods = JSON.parse(data).pods;
        //console.log(pods);
        // pods.forEach(p => {
        //     console.log(p.spec);
        // });
        
    });
})
.on("error", err => {
    console.log("error: "+ err);
});