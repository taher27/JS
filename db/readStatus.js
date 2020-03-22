var fs = require('fs');

var data = '';

var readStream = fs.createReadStream('./datastore/nodesData', 'utf8');

readStream.on('data', function(chunk) {
    data += chunk;
}).on('end', function() {
    data = JSON.stringify(data)
    data = JSON.parse(data)
    console.log(data);
});