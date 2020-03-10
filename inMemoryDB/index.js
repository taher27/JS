const fetch = require('node-fetch');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ pods: [], count: 0 })
  .write()

setInterval(loadData,3000)

function loadData() {
    //fetch data from URL
     fetch("http://localhost:60000/api/metrics/default")
     .then((response) => {
         return response.json()
     })
     .then((data) => {
         data.podmetrics.forEach(item => {
             // Add a post
             db.get('pods')
             .push({ 
                 name: item.metadata.name, 
                 cpu: parseInt((item.containers[0].usage.cpu).slice(0, -1))/10000,
                 memory:parseInt((item.containers[0].usage.memory).slice(0, -1))/1000,
                 time: item.timestamp
                 })
             .write()
             // Increment count
             db.update('count', n => n + 1)
             .write()
         });
     })
     console.log("Added")
 }
// loadData()

function findData(name) {
   var data =  db.get('pods')
            .filter({ name: name })
            .value()
            
    console.log(data)
}
// findData("zbio-broker-group1-0")