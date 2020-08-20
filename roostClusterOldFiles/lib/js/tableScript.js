const { ipcRenderer } = require('electron'); // added this for terminal view.
const { spawn, exec } = require('child_process');  //added this for live fetching of logs. 
const kill = require('tree-kill');

var tempPodScreen = "tab-default"; // this variable will update for table screens when screen will switch between graph and table screen
var ScreenFlag = false // added this flag to control swtiching division when prev-next button is used

$('.tab-content-default').hide();
$('#tab-default').show();

var stack_Next = new Stack();
var stack_Prev = new Stack();
stack_Prev.push("tab-default");

// System Resources dropdown control
$('#resources').change(() => {
    SYS_RESOURCES = $('#resources').val();
    console.log(SYS_RESOURCES);
    if(document.getElementById("tableScreen").style.display ==  "block") {
        $('.tab-content-default').hide();
        $('#tab-default').show(); 
    }
    pushForPreviousButton(CURRENT_SCREEN);
    CURRENT_SCREEN = "tab-default";

    loader();
    loadPods();

    if(SYS_RESOURCES != "all") {
        $("#systemResourcesDiv").hide()
    }
    else {
        $("#systemResourcesDiv").show()
    }
})

// NameSpace dropdown control
$('#select-box').change(function () {
    // if(CHILD != "") {
    //     console.log("Kill process")
    //     console.log(CHILD.pid)
    //     CHILD.kill('SIGINT');
    // }
    // document.getElementById("podLogsData").innerHTML = "";
    document.getElementById("containerLogsData").innerHTML = "";
    switchScreen();
});

// Page2 pods log dropdown control   -> comment out in view(UI)
// $("#podlogPods").on('change click' ,function() {
//     CONTAINER_PODNAME = $("#podlogPods").val();
//     TIME = "0";
//     console.log("click podlogpods")
//     loadContainerPods();
    
//     if(prevPodName == CONTAINER_PODNAME) {
//         getLogsData(CONTAINER_PODNAME, CONTAINER_NAME);
//     } else {
//         getLogsData(CONTAINER_PODNAME, "")
//     }
// });

// $("#podlogContainer").on('change click' , function() {
//     CONTAINER_NAME = $("#podlogContainer").val();
//     TIME = "0";    
//     getLogsData(CONTAINER_PODNAME, CONTAINER_NAME)
// });

// page3 container logs dropdown control
$('#logContainer').on('change click' , () => {
    CONTAINER_NAME = $('#logContainer').val();
    TIME = "0";
    
    getLogsData(CONTAINER_PODNAME, CONTAINER_NAME)
})

$(document).ready(function () {
    var podTable = $('#podTable').DataTable();
    // $("#podTable td:nth-last-child(1)").css("text-align","right");

    $('#podTable tbody').on('click', 'tr', function () {
        // if(CHILD != "") {
        //     console.log("Kill process")
        //     console.log(CHILD.pid)
        //     CHILD.kill('SIGINT')
        // }
        // document.getElementById("podLogsData").innerHTML = "";
        document.getElementById("containerLogsData").innerHTML = "";
        if(SYS_RESOURCES != "pods") {
            ScreenFlag = false;
            var data = podTable.row( this ).data();
            CURRENT_SCREEN = "tab-screen2"
            currentPod.namespace = NAMESPACE;
            currentPod.state = data[1];
            console.log(NAMESPACE, data[1],data[2]);

            if(data[2] == "Statefulsets") {
                currentPod.token = 1;
                loadNew(NAMESPACE, data[1], 1);
            }
            else if(data[2] == "Deployments") {
                currentPod.token = 2;
                loadNew(NAMESPACE, data[1], 2);
            }
            else if(data[2] == "Daemonsets"){
                currentPod.token = 3;
                loadNew(NAMESPACE, data[1], 3);
            }
            else if(data[2] == "Replicasets"){
                currentPod.token = 4;
                loadNew(NAMESPACE, data[1], 4);
            }
            else if(data[2] == "Pods"){
                ScreenFlag = true;
                CONTAINER_PODNAME = data[1];
                CURRENT_SCREEN = "tab-screen3"
                callContainerPage()
            }
        }
        else if (SYS_RESOURCES == "pods") {
            var data = podTable.row( this ).data();
            ScreenFlag = true;
            CONTAINER_PODNAME = data[1];
            CURRENT_SCREEN = "tab-screen3"
            callContainerPage()
        }
        pushForPreviousButton('tab-default');
    });
    
    // page 3(container data) will launch  
    var statefulTable = $('#statefulTable').DataTable();

    $('#statefulTable tbody').on('click', 'tr', function () {
        // if(CHILD != "") {
        //     CHILD.kill('SIGINT')
        // } 
        // document.getElementById("podLogsData").innerHTML = "";
        document.getElementById("containerLogsData").innerHTML = "";
        var data = statefulTable.row( this ).data();
        ScreenFlag = false; //bcz screen3 will call from screen 2 in this case.
        CURRENT_SCREEN = "tab-screen3"
        currentPod.namespace = NAMESPACE;
        CONTAINER_PODNAME = data[0];

        callContainerPage();
        pushForPreviousButton('tab-screen2');
    });

    $('#containerTable').DataTable();
    $('#eventsTable').DataTable();
});

$(".carousel-control-next").click(function() {
    var id = stack_Next.pop();
    // console.log("id: "+id);
    if((id !== undefined) && (CURRENT_SCREEN != "tab-screen3")) {
        $(".tab-content-default").hide();
        $('#'+id).show();
        CURRENT_SCREEN = id;
        console.log("CURRENT_SCREEN: "+CURRENT_SCREEN);
        if(CURRENT_SCREEN == "tab-screen3") {
            if(ScreenFlag == false) {
                pushForPreviousButton("tab-screen2");
            }
            else {
                pushForPreviousButton("tab-default");
            }
        }
        else if (CURRENT_SCREEN == "tab-screen2") {
            pushForPreviousButton("tab-default");
        }
    }
});

$(".carousel-control-prev").click(function() {
    if(CURRENT_SCREEN != "tab-default") {
        stack_Next.push(CURRENT_SCREEN);
        var id = stack_Prev.pop();
        console.log("Previous screen: " + CURRENT_SCREEN);
        console.log("Current screen: " + id);
        if(id !== undefined) {
            $(".tab-content-default").hide();
            $('#'+id).show();
            CURRENT_SCREEN = id;
        }
        else {
            $(".tab-content-default").hide();
            $('#tab-default').show();
            CURRENT_SCREEN = "tab-default";
        }
    }
});

// update stack when user changes the screen
function pushForPreviousButton(selectedTabId) {
    // console.log(selectedTabId)
    if(selectedTabId) {
        stack_Prev.push(selectedTabId)
     }   
}

// refresh logic - starts here
function loader() {
    $(".loader-overlay").toggle();
    setTimeout(() => {
        $(".loader-overlay").toggle();
    }, 2000)
}

function refresh() {
    // checkSystemResources()
    if(CURRENT_SCREEN == "tab-default") {
        loadNamespaces()
        loadPods();
        loader();
    }
    else if(CURRENT_SCREEN == "tab-screen2") {
        loadNew(currentPod.namespace, currentPod.state, currentPod.token)
        loader();
    }
    else if(CURRENT_SCREEN == "tab-screen3") {
        callContainerPage(CONTAINER_PODNAME)
        loader()
    }
    else if(CURRENT_SCREEN == "graphScreen") {
        // loadData(namespace)
        reloadGraph()
        loader();
    }
}

// refresh logic - ends here

// displaying screen according to filters
function switchScreen() {
    console.log(CURRENT_SCREEN)
    // pushForPreviousButton(CURRENT_SCREEN);
    if(document.getElementById("tableScreen").style.display ==  "block") {
        $('.tab-content-default').hide();
        $('#tab-default').show()
    }

    CURRENT_SCREEN = "tab-default";

    NAMESPACE = $('#select-box').val();
    // document.getElementById("namespaceHeading").innerHTML = NAMESPACE;

    loader();
    loadPods();

    if(SYS_RESOURCES != "all") {
        $("#systemResourcesDiv").hide();
    }
    else {
        $("#systemResourcesDiv").show();
    }
}

function flipScreen() {
    $('#tableScreen').toggle();  //Screen Toggle
    $('#graphScreen').toggle();  //Screen Toggle
   
    $('#tableToggle').toggle(); // icons flip
    $('#graphToggle').toggle(); // icons flip

    $('.carousel-control-prev').toggle();
    $('.carousel-control-next').toggle();

    if(document.getElementById("tableScreen").style.display !=  "block") {
        tempPodScreen = CURRENT_SCREEN;
        CURRENT_SCREEN = "graphScreen";
    } else {
        CURRENT_SCREEN = tempPodScreen;
    }
}

// toggle between graph view and table view
$('#tableToggle').show(); // icons flip
$('#graphToggle').hide(); // icons flip

$('.carousel-control-prev').hide();
$('.carousel-control-next').hide();

$('.main-screen').show();
$('#podGraph').hide();

$('#graphScreen').show();
$('#tableScreen').hide();

function loadNew(NAMESPACE, state, token) {
    // console.log(NAMESPACE+ ", " + state +", "+ token);
    if(token == 1) {
        getAllStatefulsets(NAMESPACE, state);
    }
    else if(token == 2){
       getAllDeployments(NAMESPACE, state)
    }
    else if(token == 3){
        getAllDaemonsets(NAMESPACE, state)
    }
    else if(token == 4){
        getAllReplicasets(NAMESPACE, state);
     }
    $('.tab-content-default').hide();
    $('#' + "tab-screen2").show();

}

// function diff_minutes(dt1) {
//     dt2 = new Date(Date.now())
//     var diff =(dt2.getTime() - dt1.getTime()) / 1000;
//     diff /= 60;
//     return Math.abs(Math.round(diff));
  
//  }

//  //minutes to hour (and days) converter
// function ConvertMinutes(num) {
//     d = Math.floor(num/1440); // 1440 = 60*24
//     h = Math.floor((num-(d*1440))/60);
//     m = Math.round(num%60);
//     s = Math.floor(d % 3600 % 60);
   
//     if(isNaN(d) == true) {
//         d = 0;
//     }
//     if(isNaN(h) == true) {
//         h = 0;
//     }
//     if(isNaN(m) == true) {
//         m = 0;
//     }
//     if(isNaN(s) ==  true) {
//         s = 0;
//     }

//     if(m <= 0) {
//         return(s + " sec");
//     } 
//     else {
//         if(d>0){
//             return(d + "d " + h + "h "+m+"m");
//         }else{
//             return(h + "h "+m+"m");
//         }
//     }
// }

function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' seconds ago';   
    }
    
    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    
    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }
    
    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    
    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

// landing page data loaded from here
function loadPods() {
    var pods, statefulsets, deployments, daemonsets, counter=0;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
                if (this.status === 200) {
                    var myArr = JSON.parse(this.responseText);
                    // // console.log(myArr);
                    statefulsets = myArr.statefulsets;
                    replicasets = myArr.replicasets;
                    pods = myArr.pods;
                    deployments = myArr.deployments;
                    daemonsets = myArr.daemonsets;
                    nodes = myArr.nodes;
                    TOTAL_MEMORY = parseInt((nodes[0].status.allocatable.memory).toString().slice(0, 4));
                    // console.log(TOTAL_MEMORY)
                    // console.log("-> Loadpods()")

                    var t = $('#podTable').DataTable();
                    t.clear().draw();
                    // Statefulsets
                    if((statefulsets != null) && ((SYS_RESOURCES == "statefulsets") || (SYS_RESOURCES == "all"))) {
                        for (var i = 0; i < statefulsets.length; i++) {
                            sname = statefulsets[i].metadata.name;
                            sdate = new Date(statefulsets[i].metadata.creationTimestamp);
                            sdate = timeDifference(new Date(), sdate);
                            sname_cpu = 0;
                            sname_memory = 0;
                            for(var j=0; j<pods.length; j++) {
                                if(sname == pods[j].PodInfo.metadata.labels.app) {
                                    // sname_cpu += Math.round(pods[j].Cpu/1000000);
                                    // sname_memory += Math.round(pods[j].Memory/1000000);
                                    sname_cpu += Math.round(pods[j].Cpu/1000000);
                                    sname_memory += Math.round(pods[j].Memory/1000000);
                                }
                            }
                            // button = `<button value=` + sname + ` onclick="loadNew(NAMESPACE, this.value, 1)">More >> </button>`;
                            t.row.add([
                                (++counter),
                                statefulsets[i].metadata.name,
                                "Statefulsets",
                                statefulsets[i].status.readyReplicas + '/' + statefulsets[i].status.replicas,
                                sname_cpu.toFixed(2) + "m",
                                sname_memory.toFixed(2) + "Mi",
                                sdate,
                            ]).draw(false);
                        }
                    }

                    // Replicasets
                    if((replicasets != null) && ((SYS_RESOURCES == "replicasets")  || (SYS_RESOURCES == "all"))) {
                        for (var i = 0; i < replicasets.length; i++) {
                            sname = replicasets[i].metadata.name;
                            sdate = new Date(replicasets[i].metadata.creationTimestamp);
                            sdate = timeDifference(new Date(), sdate);
                            sname_cpu = 0;
                            sname_memory = 0;
                            for(var j=0; j<pods.length; j++) {
                                if(pods[j].PodInfo.metadata.ownerReferences != undefined) {
                                    if(pods[j].PodInfo.metadata.ownerReferences[0].name == sname) {
                                        sname_cpu += Math.round(pods[j].Cpu/1000000);
                                        sname_memory += Math.round(pods[j].Memory/1000000);
                                    }
                                }
                            }
                            // button = `<button value=` + sname + ` onclick="loadNew(namespace, this.value, 1)">More >> </button>`;
                            t.row.add([
                                (++counter),
                                replicasets[i].metadata.name,
                                "Replicasets",
                                replicasets[i].status.readyReplicas + '/' + replicasets[i].status.replicas,
                                sname_cpu.toFixed(2) + "m",
                                sname_memory.toFixed(2) + "Mi",
                                sdate,
                            ]).draw(false);
                        }
                    }

                    // Deployments
                    if((deployments != null) && ((SYS_RESOURCES == "deployments,replicasets") || (SYS_RESOURCES == "all"))) {
                        for (var i = 0; i < deployments.length; i++) {
                            sname = deployments[i].metadata.name;
                            sdate = new Date(deployments[i].metadata.creationTimestamp);
                            sdate = timeDifference(new Date(), sdate);
                            sname_cpu = 0;
                            sname_memory = 0;
                            for (var j = 0; j < pods.length; j++) {
                                for (var k = 0; k < replicasets.length; k++) {
                                    if(pods[j].PodInfo.metadata.ownerReferences != undefined) {
                                        if(pods[j].PodInfo.metadata.ownerReferences[0].uid == replicasets[k].metadata.uid) {
                                            for (var l=0; l<deployments.length; l++) { 
                                                if((deployments[l].metadata.uid == replicasets[k].metadata.ownerReferences[0].uid) && (deployments[l].metadata.name == sname)) {
                                                    sname_cpu += Math.round(pods[j].Cpu/1000000);
                                                    sname_memory += Math.round(pods[j].Memory/1000000);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            t.row.add([
                                (++counter),
                                deployments[i].metadata.name,
                                "Deployments",
                                deployments[i].status.readyReplicas + '/' + deployments[i].status.replicas,
                                sname_cpu.toFixed(2) + "m",
                                sname_memory.toFixed(2) + "Mi",
                                sdate,
                            ]).draw(false);
                        }
                    }

                    // Daemonsets
                    if((daemonsets != null) && ((SYS_RESOURCES == "daemonsets") || (SYS_RESOURCES == "all"))) {
                        for (var i = 0; i < daemonsets.length; i++) {
                            sname = daemonsets[i].metadata.name;
                            sdate = new Date(daemonsets[i].metadata.creationTimestamp);
                            sdate = timeDifference(new Date(), sdate);
                            sname_cpu = 0;
                            sname_memory = 0;
                            for(var j=0; j<pods.length; j++) {
                                if(pods[j].PodInfo.metadata.ownerReferences[0].name == sname) {
                                    sname_cpu += Math.round(pods[j].Cpu/1000000);
                                    sname_memory += Math.round(pods[j].Memory/1000000);
                                }
                            }
                            t.row.add([
                                (++counter),
                                daemonsets[i].metadata.name,
                                "Daemonsets",
                                daemonsets[i].status.numberReady + '/' + daemonsets[i].status.currentNumberScheduled,
                                sname_cpu.toFixed(2) + "m",
                                sname_memory.toFixed(2) + "Mi",
                                sdate,
                            ]).draw(false);
                        }
                    }

                    // Pods
                    if((pods != null) && (SYS_RESOURCES == "all" || SYS_RESOURCES == "pods")) {
                        for (var i = 0; i < pods.length; i++) {  
                            sdate = new Date(pods[i].PodInfo.metadata.creationTimestamp);
                            sdate = timeDifference(new Date(), sdate)
                            t.row.add([
                                (++counter),
                                pods[i].PodInfo.metadata.name,
                                "Pods",
                                "1/1",
                                (pods[i].Cpu/1000000).toFixed(2) + "m",
                                (pods[i].Memory/1000000).toFixed(2) + "Mi",
                                sdate,
                            ]).draw(false);
                        }
                    }
                } else {
                    var t = $('#podTable').DataTable();
                    t.clear().draw();
                }
            }
    };
    // http://localhost:60000/api/scrape/kube-system?type=statefulsets,deployments,daemonsets&fieldSelector=&labelSelector=
     
    if(SYS_RESOURCES == "all") {
        xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=statefulsets,deployments,daemonsets,replicasets,pods,nodes&labelSelector&fieldSelector`, true);
    } else {
        xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=${SYS_RESOURCES},pods,nodes&labelSelector&fieldSelector`, true);
    }
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function loadNamespaces() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4) {  
        var out = "";
        if (this.status === 200) {
            var oldNamespace = JSON.parse(this.responseText)
            // clear NameSpace array here to avoid duplication of data.
            NAMESPACES_ARRAY = [];
            oldNamespace.forEach(item => {
                NAMESPACES_ARRAY.push(item.metadata.name);
            });
        
            document.getElementById("select-box").innerHTML = out;

            NAMESPACES_ARRAY.forEach(item => {
                if(item == NAMESPACE) {
                    out += "<option value='"+item+"' selected>"+ item+"</option>";
                }
                else {
                    out += "<option value='"+item+"'>"+ item+"</option>";
                }
            });
            document.getElementById("select-box").innerHTML = out;
        } else {
            console.log("LoadNamespace failed.");
            document.getElementById("select-box").innerHTML = out;
        }
    }
  };
     
    xmlhttp.open('POST', `${URL}/api/namespaces`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();     //  "fname=Henry&lname=Ford" -> will pass arguments like this in post call.
}

// initial call for the namespace and landing page table data.
// loadNamespaces();
// loadPods();

// fileter namespace according to the value of checkSystemResources
function filterNamespace(NAMESPACE, str) {
   var out = ""

   for (let i = 0; i < NAMESPACE.length; i++) {
       if(!str.includes(NAMESPACE[i]))
       {
            out += "<option value='"+ NAMESPACE[i] +"'>"+ NAMESPACE[i] +"</option>";
       }
   }
   document.getElementById("select-box").innerHTML = out;
}

function terminalCall(containerPodName, namespace, conName) {
    console.log("terminal called", containerPodName, namespace, conName);
    // window.parent.postMessage(containerPodName+","+namespace+","+containerName,"*");
    
    console.log('Terminal call')
    ipcRenderer.sendToHost('podTerminal',containerPodName+","+namespace+","+conName)
}

// this call fetch the data for the whole page, except table data 
function getAllPodsData(NAMESPACE, podnames, type, state, podRunning, podObject) {
    // console.log(podObject)
    
    if(podObject != undefined) {
        data = '<h5 class="text-uppercase">Configuration</h5>'+'<p class="row mb-1">'+'<span class="col-3 text-muted text-uppercase">Kind</span>'+'    <span class="col-9"> '+ type +' </span>'+'</p>'+'<p class="row mb-1">'+'    <span class="col-3 text-muted text-uppercase">Namespace</span>'+'    <span class="col-9"> '+ NAMESPACE +' </span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Created</span>'+'    <span class="col-9">'+ podObject.PodInfo.metadata.creationTimestamp + '</span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Labels</span>'+'<span class="col-9"><mark style="color: #e5e6eb">app: ' +  podObject.PodInfo.metadata.labels.app  + '</mark></span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Images</span>'+'    <span class="col-9">' + podObject.Containers[0].ContainerInfo.image + '</span>'+'</p>';
    } else {
        data = '<h5 class="text-uppercase">Configuration</h5>'+'<p class="row mb-1">'+'<span class="col-3 text-muted text-uppercase">Kind</span>'+'    <span class="col-9"> '+ type +' </span>'+'</p>'+'<p class="row mb-1">'+'    <span class="col-3 text-muted text-uppercase">Namespace</span>'+'    <span class="col-9"> '+ NAMESPACE +' </span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Created</span>'+'    <span class="col-9"> ~ </span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Labels</span>'+'<span class="col-9"><mark style="color: #e5e6eb">app: ~ </mark></span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Images</span>'+'    <span class="col-9"> ~ </span>'+'</p>';
    }
    document.getElementById("specifications").innerHTML = data;
    
    // Stateful set heading added
    // left
    headLeft = '<p class="mb-0 text-muted text-uppercase">' + type + '</p><h1 class="h2" >' + state + '</h1>';
    document.getElementById("headingLeft").innerHTML= headLeft;
    
    // right
    headRight = '<p class="text-muted text-uppercase mb-0">' + podRunning.running + '/' + podRunning.total + ' pods</p> <p><span class="text-success pr-1"><i class="fas fa-check"></i></span>Running</p>';
    document.getElementById("headingRight").innerHTML = headRight;

    // YAML loaded
    getYamlData(NAMESPACE, type, state);
    
    // Events data loaded
    // getEventsData(podnames);
}

// Next 4 methods fetch the data for the screen 2 depends on call.

function getAllStatefulsets(NAMESPACE, state) {
    type = "statefulset";
    runningpod = 0;
    POD_ARRAY = [];
    
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                statefulsets = myArr.statefulsets;
                pods = myArr.pods;
                // console.log(myArr);
                
                podnames = "";
                logPods = "";
                // logContainer = "";
                podObject = null;

                podRunning = function() {
                    running = 0;
                    total = 0;
                }

                // TOTAL_MEMORY is initialised globally
                totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                // console.log(pods[0].Containers[0].ContainerInfo.resources.requests)
                // var resourceObject = function() {}
                requestCpu = 0;
                limitCpu = 0;
                requestMemory = 0;
                limitMemory = 0;

                podCpu = 0;
                podMemory = 0;
                
                var t = $('#statefulTable').DataTable();
                t.clear().draw();
                if(pods != null) {
                    podRunning.total = pods.length;
                    for (var i = 0; i < pods.length; i++) {
                        podObject = pods[i]
                        podnames += pods[i].PodInfo.metadata.name + ",";
                        POD_ARRAY.push(pods[i].PodInfo.metadata.name);
                        logPods += "<option value="+pods[i].PodInfo.metadata.name+">"+pods[i].PodInfo.metadata.name+"</option>"

                        // pods[i].Containers.forEach(item => {
                        //     logContainer += "<option value="+item.ContainerInfo.name+">"+item.ContainerInfo.name+"</option>"
                        // });
                        podstatus = "";
                        podCpu += Math.round(pods[i].Cpu/1000000); 
                        podMemory += Math.round(pods[i].Memory/(1024*1024));

                        if (pods[i].PodInfo.status.phase == "Running") {
                            runningpod++;
                            podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span>' + pods[i].PodInfo.status.phase;
                        } 
                        else if(pods[i].PodInfo.status.phase == "Running" && pods[i].PodInfo.metadata.deletionTimestamp != undefined) {
                            podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Terminating';
                        }
                        else if(pods[i].PodInfo.status.phase == "Pending" && pods[i].PodInfo.metadata.deletionTimestamp == undefined) {
                            podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Creating';
                        } else {
                            podstatus = ''+ pods[i].PodInfo.status.phase;
                        }
                        
                        t.row.add([
                            pods[i].PodInfo.metadata.name,
                            pods[i].PodInfo.status.phase,
                            pods[i].Containers.length,
                            // '<div class="table-progress">'+
                            //     '<div class="progress">'+
                            //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[i].Cpu/1000000000)+'%" aria-valuenow="'+Math.round(pods[i].Cpu/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                            //     '</div>'+
                            // '</div>'+
                            // Math.round(pods[i].Cpu/1000000)+'m',
                            (pods[i].Cpu/1000000).toFixed(2)+'m',
                            // '<div class="table-progress">'+
                            //     '<div class="progress">'+
                            //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round((pods[i].Memory/10000) / totalMemory) +'%" aria-valuenow="'+Math.round(pods[i].Memory/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                            //     '</div>'+
                            // '</div>'+
                            (pods[i].Memory/1000000).toFixed(2)+'Mi',
                            podstatus
                        ]).draw(false);
                    }

                    if((pods[0].Containers[0].ContainerInfo.resources.requests != undefined) || (pods[0].Containers[0].ContainerInfo.resources.limits != undefined)) {
                        // Check for request Cpu/Memory first if not then limit and if both value are not present set an arbitary value 
    
                        if(pods[0].Containers[0].ContainerInfo.resources.requests.cpu != undefined) {
                            totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                            requestCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                        }
                        else if(pods[0].Containers[0].ContainerInfo.resources.limits.cpu != undefined) {
                            totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod; 
                            limitCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod;
                        }
                        else {
                            totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                        }
    
                        if(pods[0].Containers[0].ContainerInfo.resources.requests.memory != undefined) {
                            TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                            requestMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                        }
                        else if(pods[0].Containers[0].ContainerInfo.resources.limits.memory != undefined) {
                            TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                            limitMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                        }
                        else {
                            TOTAL_MEMORY = 1939;
                        }
                    }
                   
                    if(requestCpu == 0) {
                        requestCpu = "NOT SET";
                    }
                    if(limitCpu == 0) {
                        limitCpu = "NOT SET";
                    }
                    if(requestMemory == 0) {
                        requestMemory = "NOT SET";
                    }
                    if(limitMemory == 0) {
                        limitMemory = "NOT SET";
                    }

                    _Memory = (podMemory * 100) / TOTAL_MEMORY;
                    _Cpu = podCpu/totalCpu;
                    podRunning.running = runningpod;
                    // console.log(pods);
                    // console.log(podCpu+" "+podMemory);
                    getCpuMemorydata(podCpu, podMemory, _Cpu , _Memory, requestCpu, limitCpu, requestMemory, limitMemory);
                    getAllPodsData(NAMESPACE, podnames, type, state, podRunning, podObject);
                    // document.getElementById("podlogPods").innerHTML = logPods;
                    // document.getElementById("podlogContainer").innerHTML = logContainer;
                }
            } else {
                // document.getElementById("podlogPods").innerHTML = ""; // if call is not successful
            }
        }
    };

    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=statefulsets,pods,nodes&labelSelector=app=${state}&fieldSelector=`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function getAllDeployments(NAMESPACE, state) {
    type = "deployment";
    runningpod = 0;
    POD_ARRAY = [];

    // document.getElementById("podlogContainer").innerHTML = "";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                deployments = myArr.deployments;
                replicasets = myArr.replicasets;
                pods = myArr.pods;
                // console.log(pods);
                // console.log(deployments);
                // console.log(replicasets);
                podnames = "";
                podCpu = 0;
                podMemory = 0;
                logPods = "";
                // logContainer = "";
                podObject = null;

                podRunning = function() {
                    running = 0;
                    total = 0;
                }

                // TOTAL_MEMORY is initialized globally
                totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;

                requestCpu = 0;
                limitCpu = 0;
                requestMemory = 0;
                limitMemory = 0;

                var t = $('#statefulTable').DataTable();
                t.clear().draw();
                if(pods != null) {
                    podRunning.total = pods.length;
                    // console.log(pods.length)
                    for (var i = 0; i < pods.length; i++) {
                       for (var j = 0; j < replicasets.length; j++) {
                           if(pods[i].PodInfo.metadata.ownerReferences != undefined) {
                               if(pods[i].PodInfo.metadata.ownerReferences[0].uid == replicasets[j].metadata.uid) {
                                   for (var k=0; k<deployments.length; k++) { 
                                       if((deployments[k].metadata.uid == replicasets[j].metadata.ownerReferences[0].uid) && (deployments[k].metadata.name == state)) {
                                           podObject = pods[i];
                                           podnames += pods[i].PodInfo.metadata.name + ",";
                                           POD_ARRAY.push(pods[i].PodInfo.metadata.name);
                                           logPods += "<option value="+pods[i].PodInfo.metadata.name+">"+pods[i].PodInfo.metadata.name+"</option>";
                                           podstatus = "";
                                           podCpu += Math.round(pods[i].Cpu/1000000); 
                                           podMemory += Math.round(pods[i].Memory/(1024*1024));
               
                                           if (pods[i].PodInfo.status.phase == "Running") {
                                               runningpod++;
                                               podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span>' + pods[i].PodInfo.status.phase;
                                           } 
                                           else if(pods[i].PodInfo.status.phase == "Running" && pods[i].PodInfo.metadata.deletionTimestamp != undefined) {
                                               podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Terminating';
                                           }
                                           else if(pods[i].PodInfo.status.phase == "Pending" && pods[i].PodInfo.metadata.deletionTimestamp == undefined) {
                                               podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Creating';
                                           } else {
                                               podstatus = ''+ pods[i].PodInfo.status.phase;
                                           }
                                           
                                           t.row.add([
                                               pods[i].PodInfo.metadata.name,
                                               pods[i].PodInfo.status.phase,
                                               pods[i].Containers.length,
                                            //    '<div class="table-progress">'+
                                            //        '<div class="progress">'+
                                            //            '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[i].Cpu/1000000000)+'%" aria-valuenow="'+Math.round(pods[i].Cpu/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                            //        '</div>'+
                                            //    '</div>'+
                                               (pods[i].Cpu/1000000).toFixed(2)+'m',
                                            //    '<div class="table-progress">'+
                                            //        '<div class="progress">'+
                                            //            '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round((pods[i].Memory/10000) / totalMemory) +'%" aria-valuenow="'+Math.round(pods[i].Memory/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                            //        '</div>'+
                                            //    '</div>'+
                                               (pods[i].Memory/1000000).toFixed(2)+'Mi',
                                               podstatus,
                                               // '<a class="text-info" title="Edit"><span class="pr-2"><i class="fas fa-edit"></i></span></a>'+
                                               // '<a class="text-muted" title="Delete"><span><i class="fas fa-trash"></i></span></a>',
                                           ]).draw(false);
                                       }
                                   }
                               }
                           }
                        }
                    }
                } 
                
                if((pods[0].Containers[0].ContainerInfo.resources.requests != undefined) || (pods[0].Containers[0].ContainerInfo.resources.limits != undefined)) {
                    // Check for request Cpu/Memory first if not then limit and if both value are not present set an arbitary value 

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                        requestCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod; 
                        limitCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else {
                        totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                    }

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                        requestMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                        limitMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else {
                        TOTAL_MEMORY = 1939;
                    }
                }
               
                if(requestCpu == 0) {
                    requestCpu = "NOT SET";
                }
                if(limitCpu == 0) {
                    limitCpu = "NOT SET";
                }
                if(requestMemory == 0) {
                    requestMemory = "NOT SET";
                }
                if(limitMemory == 0) {
                    limitMemory = "NOT SET";
                }
                
                _Memory = (podMemory * 100) / TOTAL_MEMORY;
                _Cpu = podCpu/totalCpu;
                podRunning.running = runningpod;

                getCpuMemorydata(podCpu, podMemory, _Cpu , _Memory, requestCpu, limitCpu, requestMemory, limitMemory);
                getAllPodsData(NAMESPACE, podnames, type, state, podRunning, podObject);
                // document.getElementById("podlogPods").innerHTML = logPods;
                // document.getElementById("podlogContainer").innerHTML = logContainer;
            }
        }
    };
     
    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=pods,deployments,replicasets&labelSelector=&fieldSelector=`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function getAllDaemonsets(NAMESPACE, state) {
    type = "daemonsets";
    runningpod = 0;
    POD_ARRAY = [];
    // document.getElementById("podlogContainer").innerHTML = "";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                // daemonsets = myArr.daemonsets;
                pods = myArr.pods;
                // console.log(pods);
                podnames = "";
                podCpu = 0;
                podMemory = 0;
                logPods = "";
                // logContainer = "";
                podObject = null;
                podRunning = function() {
                    running = 0;
                    total = 0;
                }

                // TOTAL_MEMORY is initialized globally
                totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;

                requestCpu = 0;
                limitCpu = 0;
                requestMemory = 0;
                limitMemory = 0;

                var t = $('#statefulTable').DataTable();
                t.clear().draw();

                if(pods != null) {
                    podRunning.total = pods.length;
                    for (var i = 0; i < pods.length; i++) {
                        if(pods[i].PodInfo.metadata.ownerReferences[0].name == state) {
                            podObject = pods[i]
                            podnames += pods[i].PodInfo.metadata.name + ",";
                            POD_ARRAY.push(pods[i].PodInfo.metadata.name);
                            logPods += "<option value="+pods[i].PodInfo.metadata.name+">"+pods[i].PodInfo.metadata.name+"</option>"
                            // pods[i].Containers.forEach(item => {
                            //     logContainer += "<option value="+item.ContainerInfo.name+">"+item.ContainerInfo.name+"</option>"
                            // });
                            podstatus = "";
                            podCpu += Math.round(pods[i].Cpu/1000000); 
                            podMemory += Math.round(pods[i].Memory/(1024*1024)); 
        
                            if (pods[i].PodInfo.status.phase == "Running") {
                                runningpod++;
                                podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span>' + pods[i].PodInfo.status.phase;
                            } 
                            else if(pods[i].PodInfo.status.phase == "Running" && pods[i].PodInfo.metadata.deletionTimestamp != undefined) {
                                podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Terminating';
                            }
                            else if(pods[i].PodInfo.status.phase == "Pending" && pods[i].PodInfo.metadata.deletionTimestamp == undefined) {
                                podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Creating';
                            } else {
                                podstatus = ''+ pods[i].PodInfo.status.phase;
                            }
                            
                            t.row.add([
                                pods[i].PodInfo.metadata.name,
                                pods[i].PodInfo.status.phase,
                                pods[i].Containers.length,
                                // '<div class="table-progress">'+
                                //     '<div class="progress">'+
                                //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[i].Cpu/1000000000)+'%" aria-valuenow="'+Math.round(pods[i].Cpu/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                //     '</div>'+
                                // '</div>'+
                                (pods[i].Cpu/1000000).toFixed(2)+'m',
                                // '<div class="table-progress">'+
                                //     '<div class="progress">'+
                                //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round((pods[i].Memory/10000) / totalMemory) +'%" aria-valuenow="'+Math.round(pods[i].Memory/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                //     '</div>'+
                                // '</div>'+
                                (pods[i].Memory/1000000).toFixed(2)+'Mi',
                                podstatus,
                                // '<a class="text-info" title="Edit"><span class="pr-2"><i class="fas fa-edit"></i></span></a>'+
                                // '<a class="text-muted" title="Delete"><span><i class="fas fa-trash"></i></span></a>',
                            ]).draw(false);
                        }
                    }
                }

                if((pods[0].Containers[0].ContainerInfo.resources.requests != undefined) || (pods[0].Containers[0].ContainerInfo.resources.limits != undefined)) {
                    // Check for request Cpu/Memory first if not then limit and if both value are not present set an arbitary value 

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                        requestCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod; 
                        limitCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else {
                        totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                    }

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                        requestMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                        limitMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else {
                        TOTAL_MEMORY = 1939;
                    }
                }
               
                if(requestCpu == 0) {
                    requestCpu = "NOT SET";
                }
                if(limitCpu == 0) {
                    limitCpu = "NOT SET";
                }
                if(requestMemory == 0) {
                    requestMemory = "NOT SET";
                }
                if(limitMemory == 0) {
                    limitMemory = "NOT SET";
                }

                
                _Memory = (podMemory * 100) / TOTAL_MEMORY;
                _Cpu = podCpu/totalCpu;
                podRunning.running = runningpod

                getCpuMemorydata(podCpu, podMemory, _Cpu , _Memory, requestCpu, limitCpu, requestMemory, limitMemory);
                getAllPodsData(NAMESPACE, podnames, type, state, podRunning, podObject);
                // document.getElementById("podlogPods").innerHTML = logPods;
            } else {
                // document.getElementById("podlogPods").innerHTML = "";
            }
        }
    };
    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=pods&labelSelector=&fieldSelector=`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function getAllReplicasets(NAMESPACE, state) {
    type = "replicasets";
    runningpod = 0;
    POD_ARRAY = [];

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                // statefulsets = myArr.statefulsets;
                pods = myArr.pods;
                // console.log(pods);
                podnames = "";
                podCpu = 0;
                podMemory = 0;
                logPods = "";
                // logContainer = "";
                podObject = null;
                podRunning = function() {
                    running = 0;
                    total = 0;
                }

                // TOTAL_MEMORY is initialized globally
                totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                
                requestCpu = 0;
                limitCpu = 0;
                requestMemory = 0;
                limitMemory = 0;

                var t = $('#statefulTable').DataTable();
                t.clear().draw();
                if(pods != null) {
                    podRunning.total = pods.length;
                    for (var i = 0; i < pods.length; i++) {
                        if(pods[i].PodInfo.metadata.ownerReferences != undefined) {
                            if(pods[i].PodInfo.metadata.ownerReferences[0].name == state) {
                                podObject = pods[i]
                                podnames += pods[i].PodInfo.metadata.name + ",";
                                POD_ARRAY.push(pods[i].PodInfo.metadata.name);
                                logPods += "<option value="+pods[i].PodInfo.metadata.name+">"+pods[i].PodInfo.metadata.name+"</option>"
                                // pods[i].Containers.forEach(item => {
                                //     logContainer += "<option value="+item.ContainerInfo.name+">"+item.ContainerInfo.name+"</option>"
                                // });
                                podstatus = "";
                                podCpu += Math.round(pods[i].Cpu/1000000); 
                                podMemory += Math.round(pods[i].Memory/(1024*1024));  
            
                                if (pods[i].PodInfo.status.phase == "Running") {
                                    runningpod++;
                                    podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span>' + pods[i].PodInfo.status.phase;
                                } 
                                else if(pods[i].PodInfo.status.phase == "Running" && pods[i].PodInfo.metadata.deletionTimestamp != undefined) {
                                    podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Terminating';
                                }
                                else if(pods[i].PodInfo.status.phase == "Pending" && pods[i].PodInfo.metadata.deletionTimestamp == undefined) {
                                    podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Creating';
                                } else {
                                    podstatus = ''+ pods[i].PodInfo.status.phase;
                                }
                                
                                t.row.add([
                                    pods[i].PodInfo.metadata.name,
                                    pods[i].PodInfo.status.phase,
                                    pods[i].Containers.length,
                                    // '<div class="table-progress">'+
                                    //     '<div class="progress">'+
                                    //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[i].Cpu/1000000000)+'%" aria-valuenow="'+Math.round(pods[i].Cpu/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                    //     '</div>'+
                                    // '</div>'+
                                    (pods[i].Cpu/1000000).toFixed(2)+'m',
                                    // '<div class="table-progress">'+
                                    //     '<div class="progress">'+
                                    //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round((pods[i].Memory/10000) / totalMemory) +'%" aria-valuenow="'+Math.round(pods[i].Memory/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                                    //     '</div>'+
                                    // '</div>'+
                                    (pods[i].Memory/1000000).toFixed(2)+'Mi',
                                    podstatus,
                                    // '<a class="text-info" title="Edit"><span class="pr-2"><i class="fas fa-edit"></i></span></a>'+
                                    // '<a class="text-muted" title="Delete"><span><i class="fas fa-trash"></i></span></a>',
                                ]).draw(false);
                            }
                        }
                    }
                }

                if((pods[0].Containers[0].ContainerInfo.resources.requests != undefined) || (pods[0].Containers[0].ContainerInfo.resources.limits != undefined)) {
                    // Check for request Cpu/Memory first if not then limit and if both value are not present set an arbitary value 

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                        requestCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.cpu != undefined) {
                        totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod; 
                        limitCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)) * runningpod;
                    }
                    else {
                        totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                    }

                    if(pods[0].Containers[0].ContainerInfo.resources.requests.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                        requestMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else if(pods[0].Containers[0].ContainerInfo.resources.limits.memory != undefined) {
                        TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                        limitMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2)) * runningpod;
                    }
                    else {
                        TOTAL_MEMORY = 1939;
                    }
                }
               
                if(requestCpu == 0) {
                    requestCpu = "NOT SET";
                }
                if(limitCpu == 0) {
                    limitCpu = "NOT SET";
                }
                if(requestMemory == 0) {
                    requestMemory = "NOT SET";
                }
                if(limitMemory == 0) {
                    limitMemory = "NOT SET";
                }

                // console.log(totalCpu,TOTAL_MEMORY)
                // console.log(requestCpu, limitCpu, requestMemory, limitMemory);
                
                _Memory = (podMemory * 100) / TOTAL_MEMORY;
                _Cpu = podCpu/totalCpu;
                podRunning.running = runningpod

                getCpuMemorydata(podCpu, podMemory, _Cpu , _Memory, requestCpu, limitCpu, requestMemory, limitMemory);
                getAllPodsData(NAMESPACE, podnames, type, state, podRunning, podObject);
                // document.getElementById("podlogPods").innerHTML = logPods;
                // document.getElementById("podlogContainer").innerHTML = logContainer;
            } else {
                // document.getElementById("podlogPods").innerHTML = "";
            }
        }
    };

     
    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=pods&labelSelector=&fieldSelector=`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

//ToDo:  check for no data
function getCpuMemorydata(podCpu, podMemory, _Cpu, _Memory, reqCpu, limitCpu, reqMemory, limitMemory) {
    
    _Memory = Math.round(_Memory)
    _Cpu = Math.round(_Cpu * 10);

    console.log(podCpu+","+podMemory);
    console.log(_Cpu+","+_Memory);
    if(isNaN(_Memory) == true || _Memory == Infinity) {
        _Memory = 0;
    }
    if(isNaN(_Cpu) == true|| _Cpu == Infinity) {
        _Cpu = 0;
    }
    _Cpu = _Cpu.toFixed(2);
    _Memory = _Memory.toFixed(2);

    cpuData='<div class="text-center">'+'<p class="text-uppercase text-muted display-6">cpu</p>'+'<div class="donut">'+'    <p class="count">' + _Cpu + '%</p>'+'    <svg  width="80" height="80" viewbox="0 0 40 40" x="0" y="0"> <circle id="" class="circle-animation" r="15.915" cy="20" cx="20" stroke-width="2" stroke="#6C757D" fill="none"/>'+'        <circle class="donut-segment" r="15.91549430918954" cy="20" cx="20" fill="transparent" stroke-width="2" stroke-dasharray="'+_Cpu+' '+(100-_Cpu)+'" stroke-dashoffset="25"></circle>'+'    </svg>'+'</div>'+'</div>'+'<p class="row fs-14 text-uppercase">'+'    <span class="col-6 text-muted">Usage</span>'+'    <span class="col-6 text-right">' + podCpu + 'm</span>'+'</p>'+'<p class="row fs-14 text-uppercase">'+'    <span class="col-6 text-muted">Requested</span>'+'    <span class="col-6 text-right">' + reqCpu + '</span> </p> <p class="row fs-14 text-uppercase">'+'    <span class="col-6 text-muted">Limit</span>  <span class="col-6 text-right">' + limitCpu + '</span> </p>';
    memoryData = '<div class="text-center">'+'<p class="text-uppercase text-muted display-6">Memory</p>'+'<div class="donut">'+'    <p class="count">' + _Memory + '%</p>'+'    <svg  width="80" height="80" viewbox="0 0 40 40" x="0" y="0"> <circle id="" class="circle-animation" r="15.915" cy="20" cx="20" stroke-width="2" stroke="#6C757D" fill="none"/>'+'        <circle class="donut-segment" r="15.91549430918954" cy="20" cx="20" fill="transparent" stroke-width="2" stroke-dasharray="'+_Memory+' '+(100-_Memory)+'" stroke-dashoffset="25"></circle>'+'    </svg>'+'</div>'+'</div>'+'<p class="row fs-14">'+'<span class="col-6 text-muted text-uppercase">Usage</span>'+'<span class="col-6 text-right">' + podMemory + 'Mi</span>'+'</p>'+'<p class="row fs-14 text-uppercase">'+'<span class="col-6 text-muted">Requested</span>'+'<span class="col-6 text-right">' + reqMemory + '</span> </p> <p class="row fs-14 text-uppercase">'+'<span class="col-6 text-muted">Limit</span> <span class="col-6 text-right">' + limitMemory + '</span> </p>';
    
    if(CURRENT_SCREEN == "tab-screen2") {
        document.getElementById("cpuUsageData").innerHTML =  cpuData;
        document.getElementById("memoryUsageData").innerHTML = memoryData;
    }
    else if(CURRENT_SCREEN == "tab-screen3") {
        document.getElementById("containerCpuUsageData").innerHTML =  cpuData;
        document.getElementById("containerMemoryUsageData").innerHTML = memoryData;
    }

}

function getYamlData(NAMESPACE, type, state){
    // // console.log(NAMESPACE, type, state)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
                yaml = JSON.parse(this.responseText)
                yaml = jsyaml.load(JSON.stringify(yaml));
                var convjson = JSON.stringify(yaml, undefined, 2)
                convjson = convjson.replace( /[{}]/g, '' );
                convjson = convjson.replace(/['"]+/g, '')
                convjson = convjson.replace(/\\/g, '"')
                document.getElementById("yamlData").innerHTML = convjson;

                var block = document.getElementById('yamlData')
                Prism.highlightElement(block);
            } else {
                document.getElementById("yamlData").innerHTML = "";
            }
        }
    }

    xmlhttp.open('POST', `${URL}/api/spec/${NAMESPACE}?type=${type}&labelSelector=${state}`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

function getEventsData(podset) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
            if (this.status === 200) {
            event = JSON.parse(this.responseText)
            event = event.EventObjects;
            // // console.log(event)
            var t = $('#containerEventsTable').DataTable();
            t.clear().draw();
                event.forEach(element => {
                    element.Events.forEach(item => {
                        t.row.add([
                            // reason, type, object, kind, message, Time
                            item.reason,
                            item.type,
                            item.metadata.name,
                            item.involvedObject.kind,
                            item.message,
                            item.lastTimestamp
                        ]).draw(false);
                    });
                }); 
            } else {
            var t = $('#containerEventsTable').DataTable();
                t.clear().draw();
            }
        }
    }
     
    xmlhttp.open('POST', `${URL}/api/events/${NAMESPACE}?type=pod&labelSelector=&objectSelector=${podset}`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

var prevContainerName = "";
var prevPodName = "";

function spawnLogs(pod_name,container_name){
    var logs = "No logs....";
    // document.getElementById("podLogsData").innerHTML = "";
    document.getElementById("containerLogsData").innerHTML = "";
    

    if(container_name == "") {
        // console.log("without container")
        CHILD = spawn(ROOSTCTL,['--kubeconfig',CONFIG,'logs',pod_name,'-n',NAMESPACE,'-f']);

    }
    else {
        // console.log("with container")
        CHILD = spawn(ROOSTCTL,['--kubeconfig',CONFIG,'logs',pod_name,'-n',NAMESPACE,'-c',container_name,'-f']);
    }

    CHILD.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
        // CHILD = "";
    });

    CHILD.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);

        if((prevContainerName != container_name) || (prevPodName != pod_name)) {
            // document.getElementById("podLogsData").innerHTML = "";
            document.getElementById("containerLogsData").innerHTML = "";
        }
        prevPodName = pod_name
        prevContainerName = container_name;  // updating prevContainer name

        if(CURRENT_SCREEN == "tab-screen2") {
            // document.getElementById("podLogsData").innerHTML += data;
        } else if(CURRENT_SCREEN == "tab-screen3") {
            document.getElementById("containerLogsData").innerHTML += data;
        }
        
    });
    CHILD.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        logs = "Couldn't fetch the logs check the pod/container status.";
        if(CURRENT_SCREEN == "tab-screen2") {
            // document.getElementById("podLogsData").innerHTML = logs;
        } else if(CURRENT_SCREEN == "tab-screen3") {
            document.getElementById("containerLogsData").innerHTML = logs;
        }
    });

}

function getLogsData(pod_name, container_name) {
        if(CHILD == ""){
            console.log("First Instance")
            spawnLogs(pod_name,container_name)
        }
        else{
            console.log("Another instances")
            // CHILD.kill('SIGINT')
            kill(CHILD.pid,'SIGKILL',function(err){
                console.log(err)
                CHILD=""
                spawnLogs(pod_name,container_name)
                
            })
            
        }
    // if(CHILD != "") {
    //     console.log("Kill process")
    //     console.log(CHILD.pid)
    //     // CHILD.kill('SIGINT');
    //     CHILD.kill('SIGINT')
    // }
    
    

    // exec(logUrl, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`exec error: ${error}`);
    //       logs = "Couldn't fetch the logs check the pod/container status.";
    //     //   return;
    //     } else {
    //         console.log("Logs starts here", pod_name, container_name);
    //         console.log(`stdout: ${stdout}`);
    //         console.error(`stderr: ${stderr}`);
    //         logs = stdout;
    //         if((prevContainerName != container_name) || (prevPodName != pod_name)) {
    //             document.getElementById("podLogsData").innerHTML = "";
    //             document.getElementById("containerLogsData").innerHTML = "";
    //         }
    //         prevPodName = pod_name
    //         prevContainerName = container_name;  // updating prevContainer name
    //         // console.log(logs);
            
    //         if(logs != "") { // checking if logs is empty or not: if empty it won't call same function again
    //             if(CURRENT_SCREEN == "tab-screen2") {
    //                 document.getElementById("podLogsData").innerHTML = logs;
    //             } else if(CURRENT_SCREEN == "tab-screen3") {
    //                 document.getElementById("containerLogsData").innerHTML = logs;
    //             }
    //         }
    //         else {
    //             document.getElementById("podLogsData").innerHTML = "";
    //             document.getElementById("containerLogsData").innerHTML = "";
    //         }
    //     }
    //   });
      
}

// System workloads data manipulation

$('#systemResources').click(function() {
    checkSystemResources()
});

function checkSystemResources() {
    systemNS = "zbio kube-node-lease kube-public kube-system";

    if(document.getElementById("systemResources").checked == true){
        filterNamespace(NAMESPACES_ARRAY, "");
        loader();
        loadPods();
        reloadGraph(NAMESPACE)
    }
    else if(document.getElementById("systemResources").checked == false){
        NAMESPACE = "default";
        // document.getElementById("namespaceHeading").innerHTML = NAMESPACE;
        filterNamespace(NAMESPACES_ARRAY, systemNS);
        loader();
        loadPods();
        reloadGraph(NAMESPACE)
    }
}

function callContainerPage() {
    loadContainerPage()
    $('.tab-content-default').hide();
    $('#' + "tab-screen3").show();
}

function loadContainerPage() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {  
                if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                // console.log(myArr);
                pods = myArr.pods;
                // console.log(pods);
                containerCpu = 0, containerMemory = 0;
                containerName = "";
                // console.log(nodes)
                // totalCpu = pods[0].Cpu;
                totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                //TOTAL_MEMORY is already initalized globally
                // console.log(TOTAL_MEMORY)

                requestCpu = 0;
                limitCpu = 0;
                requestMemory = 0;
                limitMemory = 0;

                var t = $('#containerTable').DataTable();
                t.clear().draw();
                // Pods
                    for (let j = 0; j < pods[0].Containers.length; j++) {
                        containerCpu += Math.round(pods[0].Containers[j].Cpu/1000000)
                        containerMemory += Math.round(pods[0].Containers[j].Memory/(1024*1024))
                        cname = pods[0].Containers[j].ContainerInfo.name;
                        CONTAINER_NAME = cname;
                        containerName += '<option value="'+cname+'" selected>'+cname+'</option>';
                        podstatus = "";
                        terminalButton = '<button class="text-info button_terminal" title="Update" value=' + CONTAINER_NAME + ' onclick="terminalCall(CONTAINER_PODNAME, NAMESPACE, this.value)" disabled><span class="pr-2"><i style="font-size: 12px; color: grey" class="fas fa-terminal"></i></span></button>'

                        if(pods[0].PodInfo.status.containerStatuses[0].state.running != undefined) {
                            podstatus = '<span class="text-success pr-1"><i class="fas fa-check"></i></span> Running';
                            terminalButton = '<button class="text-info button_terminal" title="Update" value=' + CONTAINER_NAME + ' onclick="terminalCall(CONTAINER_PODNAME, NAMESPACE, this.value)"><span class="pr-2"><i style="font-size: 12px" class="fas fa-terminal"></i></span></button>';
                        }
                        else if(pods[0].PodInfo.status.containerStatuses[0].state.waiting != undefined) {
                            podstatus = ''+pods[0].PodInfo.status.containerStatuses[0].state.waiting.reason;
                        } 
                        else {
                            podstatus = 'not running';
                        }

                        console.log(CONTAINER_NAME, CONTAINER_PODNAME);
                        t.row.add([
                            pods[0].Containers[j].ContainerInfo.name,
                            // '<div class="table-progress">'+
                            //     '<div class="progress">'+
                            //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[0].Containers[j].Cpu/1000000000)+'%" aria-valuenow="'+Math.round(pods[0].Containers[j].Cpu/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                            //     '</div>'+
                            // '</div>'+
                            (pods[0].Containers[j].Cpu/1000000).toFixed(2)+'m',
                            // '<div class="table-progress">'+
                            //     '<div class="progress">'+
                            //         '<div class="progress-bar bg-info" role="progressbar" style="width: '+Math.round(pods[0].Containers[j].Memory/1000000)+'%" aria-valuenow="'+Math.round(pods[0].Containers[j].Memory/1000000)+'" aria-valuemin="0" aria-valuemax="100"></div>'+
                            //     '</div>'+
                            // '</div>'+
                            (pods[0].Containers[j].Memory/(1024*1024)).toFixed(2)+'Mi',
                            podstatus,
                            terminalButton,
                        ]).draw(false);
                    }

                    if((pods[0].Containers[0].ContainerInfo.resources.requests != undefined) || (pods[0].Containers[0].ContainerInfo.resources.limits != undefined)) {
                        // Check for request Cpu/Memory first if not then limit and if both value are not present set an arbitary value 
    
                        if(pods[0].Containers[0].ContainerInfo.resources.requests.cpu != undefined) {
                            totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1));
                            requestCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.cpu).toString().slice(0,-1));
                        }
                        else if(pods[0].Containers[0].ContainerInfo.resources.limits.cpu != undefined) {
                            totalCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1)); 
                            limitCpu = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.cpu).toString().slice(0,-1));
                        }
                        else {
                            totalCpu = (myArr.clusterinfo.Cpu / myArr.clusterinfo.NodeCount) * 1000;
                        }
    
                        if(pods[0].Containers[0].ContainerInfo.resources.requests.memory != undefined) {
                            TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2));
                            requestMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.requests.memory).toString().slice(0,-2));
                        }
                        else if(pods[0].Containers[0].ContainerInfo.resources.limits.memory != undefined) {
                            TOTAL_MEMORY = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2));
                            limitMemory = parseInt((pods[0].Containers[0].ContainerInfo.resources.limits.memory).toString().slice(0,-2));
                        }
                        else {
                            TOTAL_MEMORY = 1939;
                        }
                    }
                   
                    if(requestCpu == 0) {
                        requestCpu = "NOT SET";
                    }
                    if(limitCpu == 0) {
                        limitCpu = "NOT SET";
                    }
                    if(requestMemory == 0) {
                        requestMemory = "NOT SET";
                    }
                    if(limitMemory == 0) {
                        limitMemory = "NOT SET";
                    }
                    
                _Cpu = containerCpu/totalCpu;    
                _Memory = (containerMemory * 100) / (TOTAL_MEMORY);    // containerMemory/PodMemory
                
                getCpuMemorydata(containerCpu, containerMemory, _Cpu, _Memory, requestCpu, limitCpu, requestMemory, limitMemory);

                labelapp = " ~ ";
                if(pods[0].PodInfo.metadata.labels != undefined){
                    labelapp = pods[0].PodInfo.metadata.labels.app
                }

                containerSpecsData = '<h5 class="text-uppercase">Configuration</h5>'+'<p class="row mb-1">'+'    <span class="col-3 text-muted text-uppercase">Namespace</span>'+'    <span class="col-9"> '+ pods[0].PodInfo.metadata.namespace +' </span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Created</span>'+'    <span class="col-9">'+ pods[0].PodInfo.metadata.creationTimestamp + '</span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Labels</span>'+'<span class="col-9"><mark style="color: #e5e6eb">app: ' + labelapp + '</mark></span>'+'</p>'+'<p class="row">'+'    <span class="col-3 text-muted text-uppercase">Images</span>'+'    <span class="col-9">' + pods[0].Containers[0].ContainerInfo.image + '</span>'+'</p>';
                document.getElementById("containerSpecifications").innerHTML = containerSpecsData;  
                
                // Left
                headLeft = '<p class="mb-0 text-muted text-uppercase"> Pod </p><h1 class="h2" >' + CONTAINER_PODNAME + '</h1>'
                document.getElementById("containerHeadingLeft").innerHTML= headLeft;
                
                // Right
                headRight = '<p class="text-muted text-uppercase mb-0">' + pods[0].Containers.length + ' container</p> <p><span class="text-success pr-1"><i class="fas fa-check"></i></span>Running</p>';
                document.getElementById("containerHeadingRight").innerHTML = headRight;
                
                // Events Data
                getEventsData(CONTAINER_PODNAME);

                // logs Data
                document.getElementById("logContainer").innerHTML = containerName;
                // document.getElementById("podlogContainer").innerHTML = containerName;
                // console.log("-> In loadContainerPage: "+ CONTAINER_PODNAME, CONTAINER_NAME)
                // TIME = "0";
                getLogsData(CONTAINER_PODNAME, CONTAINER_NAME);
            } else {
                var t = $('#containerTable').DataTable();
                t.clear().draw();

                document.getElementById("containerSpecifications").innerHTML = ""; 
                document.getElementById("containerHeadingLeft").innerHTML = ""; 
                document.getElementById("containerHeadingRight").innerHTML = "";

            }
        }
    };
    // http://localhost:60000/api/scrape/zbio?type=pods&labelSelector&fieldSelector=metadata.name=zbio-broker-group1-1   -> Future use
     
    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=pods&labelSelector&fieldSelector=metadata.name=${CONTAINER_PODNAME}`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();
}

// ToDo: -> new http post method for method call - check 

// var httpPost = function(urlPath, postJsonBody, callbackFn) {
//     var options, request, self;
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//     options = url.parse(urlPath);
//     options.method = "POST";
//     options.rejectUnauthorized = false;
//     options.headers = {
//       'ZBIO_CLUSTER_KEY': this.restAPIKey,
//       'Content-Type': 'application/json'
//     };
//     self = this;
//     request = https.request(options, function(response) {
//       var responseChunks;
//       responseChunks = [];
//       response.setEncoding('utf8');
//       response.on('data', function(chunk) {
//         responseChunks.push(chunk);
//       });
//       response.on('end', function() {
//         var body, e;
//         if (response.statusCode === 200) {
//           body = responseChunks.join('');
//           try {
//             body = JSON.parse(body);
//           } catch (error) {
//             e = error
//             callbackFn("", 'Error parsing JSON!', e);
//             return;
//           }
//           try {
//             callbackFn(body);
//           } catch (error) {
//             e = error;
//             callbackFn("", 'Some error, try again', e);
//           }
//         } else {
//           return callbackFn("", 'Status:', response.statusCode);
//         }
//       });
//     });
//     request.write(postJsonBody);
//     request.end();
//     return request.on('error', function(e) {
//       console.error(e);
//       callbackFn("", 'error', e);
//     });
//   }
