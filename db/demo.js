var fetch = require('node-fetch');
var Datastore = require('nedb'),
pods = new Datastore({ filename: './datastore/podsData', autoload: true });
nodes = new Datastore({ filename: './datastore/nodesData', autoload: true });
data = new Datastore({ filename: './datastore/data', autoload: true});

// setInterval(
function loadData(){
    fetch('http://localhost:60000/api/metrics/default')
    .then(res => res.json())
    .then(data => {
        parseData(data);
    })
}
// , 10000);

// loadData()
function parseData(data) {
    data.podmetrics.forEach(item => {
        pods.insert({
                "name": item.metadata.name,
                "cpu": parseInt((item.containers[0].usage.cpu).slice(0, -1))/10000, //remove the last letter from value bcz it is not a number
                "memory": parseInt((item.containers[0].usage.memory).slice(0, -1))/1000,
                "time": item.timestamp,
            }, function (err, newDoc) {  
                // console.log(newDoc);
                console.log('pods Added')  
            });
        });

    data.nodemetrics.forEach(item => {
        nodes.insert({
            "name": item.metadata.name,
            "cpu": parseInt((item.usage.cpu).slice(0, -1))/100000, //remove the last letter from value bcz it is not a number
            "memory": parseInt((item.usage.memory).slice(0, -1))/10000,
            "time": item.timestamp,
        }, function (err, newDoc) {  
            // console.log(newDoc);
            console.log('Nodes Added')  
        });
        
    });
}
function getData(name) { 
    pods.find({"name":name}, function (err, docs) { 
        console.log(docs)
    }); 
}
   
getData("zbio-service-0")