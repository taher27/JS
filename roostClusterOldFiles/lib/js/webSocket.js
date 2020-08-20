var url = 'wss://localhost:60001/api/watch/all+all/pods';
var url2 = 'wss://localhost:60001/api/globalWatch';
var flag = false;
var time = 5000;
var LastDeletedPod = "";
var checkForDeletingPod = false;
var checkForDeletingState = false;

ZbEvent = {
  EventType: 3,
  Object: KEY
}
// console.log(typeof ZbEvent)

function connected() {
  loadNamespaces();
  loadPods();
  loadData();
}

function connectSocket1() {
  var socket = new WebSocket(url);

  socket.onopen = function() {
    console.log("socket connected");
    console.log("send:", ZbEvent)
    socket.send(JSON.stringify(ZbEvent)); // sending Key as a message body.
    // subscribe to some channels
    //.... some message the I must send when I connect.....
  };

  socket.onmessage = function(event) {
    data = JSON.parse(event.data)
    console.log(event)
    console.log(data)

    if(data.Object.metadata.namespace == NAMESPACE) {
      loadPods();
      setTimeout(() => {
        reloadGraph();
        loadPods();
      }, 3000)
    } 
    
    if(flag == false) {
      flag = true;
      connected()
    }

    LastDeletedPod  = data.Object.metadata.name;
    LastEvent = data.EventType;

    console.log(LastDeletedPod +"=="+ CONTAINER_PODNAME);
    console.log(POD_ARRAY);

    if(LastDeletedPod == CONTAINER_PODNAME) {
      checkForDeletingPod = true;
    }

    POD_ARRAY.forEach(item => {
      if(LastDeletedPod == item) {
        console.log(LastDeletedPod +"=="+ item);
        checkForDeletingState = true;
      }
    });
    
    if((LastEvent == 1) && (checkForDeletingPod == true) || (checkForDeletingState == true)) {
        checkForDeletingPod = false;
        LastEvent = 0;
        $('.tab-content-default').hide();
        $('#tab-default').show();
        loadPods();
    }
    
  }  

  socket.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in few seconds.', e.reason);
    if(flag == true) {
      flag = false;
      setTimeout(() => {
        console.log("Clear Data from pages.")
        window.location.reload(true)
      }, 5000)
    }
    setTimeout(function() {
      connectSocket1();
    }, time);
  };

  socket.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    socket.close();
  };
}

function connectSocket2() {
  var socket2 = new WebSocket(url2);

  socket2.onopen = function() {
    console.log("socket2 connected for namespace");
    console.log("send:", ZbEvent)
    socket2.send(JSON.stringify(ZbEvent)); // sending Key as a message body.
  };

  socket2.onmessage = function(event) {
    console.log("connection2 refresh");
    console.log(event)
    data = JSON.parse(event.data);
    // console.log(data.ObjectType)

    if(data.ObjectType == "namespaces") {
      loadNamespaces()
    }
    else if(data.ObjectType == "ZBCLUSTER") {
      setTimeout(() => {
        console.log("Clear Data from pages.")
        window.location.reload(true)
      }, 5000)
    }
  }  

  socket2.onclose = function(e) {
    console.log('Socket2 is closed. Reconnect will be attempted in few seconds.', e.reason);
    setTimeout(function() {
      connectSocket2();
    }, time);
  };

  socket2.onerror = function(err) {
    console.error('Socket2 encountered error: ', err.message, 'Closing socket');
    socket2.close();
  };
}

setTimeout(() => {
  // connected();
  connectSocket1(); // socket1 connection method
  connectSocket2(); // socket2 connection method
}, 3000)