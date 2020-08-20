NAMESPACE = "zbio"; // Global namespace to make it use in API, nd dont have to pass it individually.
POD_ARRAY = [];
PODNAME = "zbio-broker-group1-0";
// options: tab-default, tab-screen2
CURRENT_SCREEN = "graphScreen";
currentPod = function(){namespace = "zbio", state = "zbio-broker-group1", token = 0};
SYS_RESOURCES = "all"; // Global System resource variable to make it use in API, nd dont have to pass it individually.
// var systemResources = false;
NAMESPACES_ARRAY = [];
CONTAINER_PODNAME = "";
URL = "https://localhost:60001";
TIME = "0";
CONTAINER_NAME = "zbio-broker";
var KEY = "";
var fs = require('fs');
// KEY = "LocalKey/07ebcef3db1962e500f716d70859ab72";
ROOSTCTL = "/usr/local/bin/roostctl";
CONFIG = "/var/tmp/Roost/.kube/config.roostctl";
CHILD = "";
TOTAL_MEMORY = 0;
TOTAL_CPU = 0;


var Stack = function() {
    this.count = 0;
    this.storage = {};
}

// Adds a value onto the end of the stack
Stack.prototype.push = function(value) {
    this.storage[this.count] = value;
    this.count++;
}

// Removes and returns the value at the end of the stack
Stack.prototype.pop = function() {
    // Check to see if the stack is empty
    if (this.count === 0) {
        return undefined;
    }

    this.count--;
    var result = this.storage[this.count];
    delete this.storage[this.count];
    return result;
}

// Returns the length of the stack
Stack.prototype.size = function() {
    return this.count;
}

function getKey() {
    fs.readFile('/var/tmp/Roost/RoostLocalKey.txt', (err, data) => {
    if (err) {
        console.error(err)
        return
        }
        KEY = data.toString()
        console.log(KEY)
    })
}
getKey();