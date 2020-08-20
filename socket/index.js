function connectSocket() {
    console.log("watchNamespaces");
    var socket = new WebSocket('wss://localhost:60001/api/collabWatch');
    socket.onopen = function() {
      console.log('connected to websockets server .....');
      socket.send(JSON.stringify({
        EventType: 3,
        Object: 'LocalKey/11393dbe7fbf81db530d0c6d49f4d8bc'
      }));
    };
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data, event); 
      console.log('received data');
    }  
    socket.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in few seconds.', e.reason);
    };
    socket.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      socket.close();
    };
  }
  connectSocket()