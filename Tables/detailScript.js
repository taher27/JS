    $(document).ready(function() {
      $('#myTable2').DataTable();
    });

function getAllPods() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        statefulsets = myArr.statefulsets;
        pods = myArr.pods;
        var tbody = document.getElementsByTagName("tbody")[0];
        var t = $('#myTable2').DataTable();
        console.log(pods)
        console.log(statefulsets);

        t.clear().draw()
        for (var i = 0; i < pods.length; i++) {
                t.row.add([
                    (i+1),
                    pods[i].metadata.name,
                    pods[i].status.phase,
                    pods[i].spec.containers.length,
                    "15",
                    "12",
                    pods[i].status.phase,
                    
                ]).draw(false);
        }

    var data = "<li>Kind: <span style='color:white'>"+pods[0].metadata.ownerReferences[0].kind+"</span></li><li>Namespace: <span style='color:white'>"+pods[0].metadata.namespace+"</span></li><li>Created: <span style='color:white'>"+pods[0].metadata.creationTimestamp+"</span></li><li>Labels: <span style='color:white'>app:"+pods[0].metadata.labels.app+"</span></li><li>Images: <span style='color:white'>"+pods[0].spec.containers[0].image+"</span></li>"
    document.getElementById("specs").innerHTML = data; 
    document.getElementById("stateHeading").innerHTML=statefulsets[0].metadata.name;
    }
};
                
    var params = getParams(window.location.href);
    console.log(params)

    xmlhttp.open("GET", 'http://localhost:60000/api/scrape/'+params.namespace+'?type=statefulsets,pods&labelSelector=app='+params.state+'&fieldSelector=', true);
    xmlhttp.send();	
}

function getCpuMemorydata() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);

        }
    };
                    
    var params = getParams(window.location.href);
    console.log(params)
    xmlhttp.open("GET", 'http://localhost:60000/api/metrics/'+params.namespace+'?type=pods&labelSelector=app='+params.state+'&fieldSelector=', true);
    xmlhttp.send();	
}

function call(){
    getAllPods();
    getCpuMemorydata();
}

function getParams(url) {
var params = {};
var parser = document.createElement('a');
parser.href = url;
var query = parser.search.substring(1);
var vars = query.split('&');
for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
}
return params;
};

$('div').after('<hr>')