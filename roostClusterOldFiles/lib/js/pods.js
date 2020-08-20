function loadData() {
    var kubeNodes = [];
    var pods = [];
    var containers = [];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText)
            var map = {};
        // START kube nodes
        if(data.nodes != null) {
            $.each(data.nodes, function (index, item) {
                map[item.metadata.name] = item.metadata.uid;
                kubeNodes.push({
                    "id": item.metadata.uid,
                    "name": item.metadata.name,
                    "status": "ready",
                    linktype: 'supporting',
                    nodetype: 'node'
                });
            });
        }
        //console.log("2 entry point")    
        if(data.pods != null && data.pods != undefined) {
            data.pods.forEach(item => {
                pods.push({
                    "id": item.PodInfo.metadata.uid,
                    "name": item.PodInfo.metadata.name,
                    "status": item.PodInfo.status.phase,
                    "node": item.PodInfo.spec.nodeName,
                    "namespace": item.PodInfo.metadata.namespace
                });
                var podId = item.PodInfo.metadata.uid;
                var nodeId = map[item.PodInfo.spec.nodeName];
                //console.log("nodeId= "+nodeId)

                // START containers
                if((item.PodInfo.status.containerStatuses.length > 0) || (item.PodInfo.status.containerStatuses != null && item.PodInfo.status.containerStatuses != undefined)) {
                    item.PodInfo.status.containerStatuses.forEach(item => {
                        state = 'unknown';
                        if (item.state.waiting)
                            state = 'waiting';
                        else if (item.state.running)
                            state = 'running';
                        else if (item.state.terminated)
                            state = 'terminated';

                        containers.push({
                            "id": item.containerID,
                            "name": item.name,
                            "image": item.image,
                            "podId": podId,
                            "nodeId": nodeId,
                            "status": state
                        });
                    });
                }
            });
        }
        //console.log(pods)
        buildLinks(kubeNodes, pods, containers);
        };
    }
    xmlhttp.open('POST', `${URL}/api/scrape/${NAMESPACE}?type=nodes,pods&labelSelector&fieldSelector`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
    xmlhttp.send();     //  "fname=Henry&lname=Ford" -> will pass arguments like this in post call.
}

// Start long polling
function poll(type) {
    
}

poll("nodes");
poll("pods");

// loadData();
