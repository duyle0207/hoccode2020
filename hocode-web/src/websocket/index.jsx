// api/index.js
var socket = new WebSocket("ws://localhost:8081/ws");

let connectWebSocket = cb => {
  console.log("connecting");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = msg => {
    console.log(msg);
    cb(msg);
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = msg => {
  socket.send(JSON.stringify({
    type: 1,
    body: "body nè"
  }));
};

export { connectWebSocket, sendMsg };