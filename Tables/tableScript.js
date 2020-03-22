xmlhttp = new XMLHttpRequest();
var arr;
var ns = "default";
// import podview from './pod-view.js';

function loadNew(ns, state){
    console.log(ns+", "+state);
    getAllPods(ns, state);
    document.getElementById('detailDiv').style.display="block";
    document.getElementById('podDiv').style.display="none";
}

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});


function loadPods(ns){
    if(document.getElementById('podDiv').style.display=="none"){
        console.log("inside if")
        document.getElementById('detailDiv').style.display="none";
        document.getElementById('podDiv').style.display="block";
    }

    var pods, statefulsets;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
			var myArr = JSON.parse(this.responseText);
			console.log(myArr)
            statefulsets = myArr.statefulsets;
            pods = myArr.pods;
            var t = $('#myTable').DataTable();
            console.log(statefulsets);
            console.log(pods)

            t.clear().draw()
            if(statefulsets.length > 0) {
                for (var i = 0; i < statefulsets.length; i++) {
                    sname = statefulsets[i].metadata.name;
                    button= `<button value=`+sname+` onclick="loadNew(ns, this.value)">More >> </button>`
                        t.row.add([
                            (i+1),
                            statefulsets[i].metadata.name,
                            pods[i].metadata.ownerReferences[0].kind,
                            statefulsets[i].metadata.namespace,
                            statefulsets[i].status.readyReplicas+'/'+statefulsets[i].status.replicas,
                            pods[i].status.phase,
                            button

                        ]).draw(false);
                }
            }else{
                for (var i = 0; i < pods.length; i++) {
                    t.row.add([
						(i+1),
						pods[i].metadata.name,
                        // pods[i].spec.containers[0].name,
                        pods[i].metadata.ownerReferences[0].kind,
                        pods[i].metadata.namespace,
                        "1/1",
                        pods[i].status.phase,
                        "More",
                        // `<a href='./moreDetails.html?namespace=`+ns+`&state=`+sname+`'>More</a>`
                    ]).draw(false);
                }
            }
        }
    };

    xmlhttp.open("GET", 'http://localhost:60000/api/scrape/'+ns+'?type=all&labelSelector&fieldSelector', true);
    xmlhttp.send();
}

function loadServices(ns){
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            arr = myArr.services;
            var t = $('#serviceTable').DataTable();
            t.clear().draw();

            var ports = "";    
            for (var i = 0; i < arr.length; i++) {
                arr[i].spec.ports.forEach(element => {
                    ports += element.port + " "
                });

                t.row.add([
                    (i+1),
                    arr[i].metadata.name,
                    arr[i].metadata.namespace,
                    ports,
                    arr[i].spec.ports[0].protocol
                    ]).draw(false);

                    ports = ""
            }
        }
    };
    xmlhttp.open("GET", 'http://localhost:60000/api/scrape/'+ns+'?type=all&labelSelector&fieldSelector', true);
    xmlhttp.send();
}

function loadNamespaces() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            var out="";
            myArr.forEach(item => {
                if(item.metadata.name == "kube-system"){
                    out += "<option value='"+item.metadata.name+"' selected>"+ item.metadata.name+"</option>";
                }
                else{
                    out += "<option value='"+item.metadata.name+"'>"+ item.metadata.name+"</option>";
                }
            });
            document.getElementById("namespaces").innerHTML = out;
        }
    };
    xmlhttp.open("GET", 'http://localhost:60000/api/namespaces', true);
    xmlhttp.send();
}

function pods() {
    loadNamespaces()
    $( "#namespaces" ).change(function() {
        ns = this.value;
        loadPods(ns)
    });
    $(document).ready(function(){
        $('#podTable').DataTable();
    });
}

function services() {
    loadNamespaces()
    
    $( "#namespaces" ).change(function() {
        ns = this.value;
        loadServices(ns)
    });
    
    $(document).ready(function(){
        $('#serviceTable').DataTable();
    });

}

setInterval(() => {
    console.log(ns)
    loadPods(ns)
    loadServices(ns)
}, 10000)

// Details Script starts here......

$(document).ready(function() {
    $('#myTable2').DataTable();
  });

function getAllPods(namespace, state) {
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
              
//   var params = getParams(window.location.href);
//   console.log(params)

  xmlhttp.open("GET", 'http://localhost:60000/api/scrape/'+namespace+'?type=statefulsets,pods&labelSelector=app='+state+'&fieldSelector=', true);
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