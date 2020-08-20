var ns = "default"

function loadData(ns) {
    console.log("inside load data");
    var pods = [];
    var containers = [];
    var services = [];
    console.log(pods)

    $.getJSON("http://localhost:60000/api/scrape/"+ns+"?type=services&labelSelector&fieldSelector", null, function (servicedata) {
        var map = {};
        // START kube nodes
        $.each(servicedata.services, function (sindex, sitem) {
            map[sitem.metadata.name] = sitem.metadata.uid;
            services.push({
                "id": sitem.metadata.uid,
                "name": sitem.metadata.name,
                "status": "ready",
                linktype: 'supporting',
                nodetype: 'node'
            });

            $.getJSON("http://localhost:60000/api/scrape/"+ns+"?type=pods&labelSelector=app%3D" + sitem.metadata.name + "&fieldSelector", null, function (data) {
                $.each(data.pods, function (index, item) {
                    pods.push({
                        "id": item.metadata.uid,
                        "name": item.metadata.name,
                        "status": item.status.phase,
                        "node": sitem.metadata.name,
                        "namespace": item.metadata.namespace
                    });
                    var podId = item.metadata.uid;
                    var nodeId = sitem.metadata.uid;

                    // START containers
                    $.each(item.status.containerStatuses, function (index, item) {
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
                        })
                    });
                });
                buildLinks(services, pods, containers);
            });
        });
    });
}

loadData(ns);

// Start long polling
function poll(type) {
    // //http://localhost:8001/api/v1/
    // oboe("http://localhost:8001/api/v1/" + type + "?watch")
    //     .done(function (evt) {
    //         console.log(evt);
    //         //handleWebSocketMessage(evt)
    //     });
}

poll("nodes");
poll("pods");

