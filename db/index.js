var express = require("express");
var app = express();
var fs = require('fs');
var cors = require('cors')
var Datastore = require('nedb'),
pods = new Datastore({ filename: './datastore/podsData', autoload: true });


app.use(cors())

var data = '';
// var readStream = fs.createReadStream('./datastore/data.json', 'utf8');
//     readStream.on('data', function(chunk) {
//         data += chunk;
//     }).on('end', function() {
//         // console.log(data);
//         return data;
//     });



app.get("/url", (req, res, next) => {
    pods.find({"name":"zbio-service-0"}, function (err, docs) { 
        res.send(docs)
    }); 
    // data = JSON.stringify(data);
    // data = JSON.parse(data);
    // res.send(data)
});


app.listen(3000, () => {
 console.log("Server running on port 3000");
});

