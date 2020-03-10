var xmlhttp = new XMLHttpRequest();

function tablePods(arr) {
    var out = '<thead>'+
            '<tr>'+
                '<th scope="col">#</th>'+
                '<th scope="col">Name</th>'+
                '<th scope="col">Namespace</th>'+
                '<th scope="col">Status</th>'+
                '<th scope="col">Start-time</th>'+
            '</tr>'+
            '</thead><tbody>';
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<tr><th scope="row">'+(i+1)+'</th>'+
            '<td>'+arr[i].metadata.name +'</td>'+
            '<td>'+arr[i].metadata.namespace +'</td>'+
            '<td>'+arr[i].status.phase +'</td>'+
            '<td>'+arr[i].status.startTime +'</td></tr>';
    }
    out +='</tbody>';
    document.getElementById("id01").innerHTML = out;
}

function tableServices(arr) {
    var out = '<thead>'+
            '<tr>'+
                '<th scope="col">#</th>'+
                '<th scope="col">Name</th>'+
                '<th scope="col">Namespace</th>'+
                '<th scope="col">Port</th>'+
                '<th scope="col">Protocol</th>'+
            '</tr>'+
            '</thead><tbody>';
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<tr><th scope="row">'+(i+1)+'</th>'+
            '<td>'+arr[i].metadata.name +'</td>'+
            '<td>'+arr[i].metadata.namespace +'</td>'+
            '<td>'+arr[i].spec.ports[0].port +'</td>'+
            '<td>'+arr[i].spec.ports[0].protocol +'</td></tr>';
    }
    out +='</tbody>';
    document.getElementById("id01").innerHTML = out;
}

function tableDeployments(arr) {
    var out = '<thead>'+
            '<tr>'+
                '<th scope="col">#</th>'+
                // '<th scope="col">Name</th>'+
                // '<th scope="col">Namespace</th>'+
                // '<th scope="col">Status</th>'+
                // '<th scope="col">Start-time</th>'+
            '</tr>'+
            '</thead><tbody>';
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<tr><th scope="row">'+(i+1)+'</th>'+
            // '<td>'+arr[i].metadata.name +'</td>'+
            // '<td>'+arr[i].metadata.namespace +'</td>'+
            // '<td>'+arr[i].status.phase +'</td>'+
            // '<td>'+arr[i].status.startTime +'</td>'+
            '</tr>';
    }
    out +='</tbody>';
    document.getElementById("id01").innerHTML = out;
}

function tableReplicas(arr) {
    var out = '<thead>'+
    '<tr>'+
        '<th scope="col">#</th>'+
        // '<th scope="col">Name</th>'+
        // '<th scope="col">Namespace</th>'+
        // '<th scope="col">Status</th>'+
        // '<th scope="col">Start-time</th>'+
    '</tr>'+
    '</thead><tbody>';
var i;
for(i = 0; i < arr.length; i++) {
out += '<tr><th scope="row">'+(i+1)+'</th>'+
    // '<td>'+arr[i].metadata.name +'</td>'+
    // '<td>'+arr[i].metadata.namespace +'</td>'+
    // '<td>'+arr[i].status.phase +'</td>'+
    // '<td>'+arr[i].status.startTime +'</td>'+
    '</tr>';
}
out +='</tbody>';
document.getElementById("id01").innerHTML = out;
}

function getPods(url){
    document.getElementById('heading1').innerHTML="Pods";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr.pods);
            if(myArr.pods != null) {
                tablePods(myArr.pods);
            }
            else{
                document.getElementById("nodata").innerHTML = "No Data available";
            }
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}

function getServices(url){
    document.getElementById('heading1').innerHTML="Services";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr.services);
            tableServices(myArr.services);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}

function getDeployments(url){
    document.getElementById('heading1').innerHTML="Deplyments";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr.deployments);
            if(myArr.deployments != null) {
                tableDeployments(myArr.deployments);
            }
            else{
                document.getElementById("nodata").innerHTML = "No Data available";
            }
           
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}

function getReplicas(url){
    document.getElementById('heading1').innerHTML="Replicasets";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr.replicasets);
            tableReplicas(myArr.replicasets);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}


function callHttp(url, str,){
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         var myArr = JSON.parse(this.responseText);
    //         console.log(myArr.pods);
    //         str(myArr.pods);
    //     }
    // };
    // xmlhttp.open("GET", url, true);
    // xmlhttp.send();  
}