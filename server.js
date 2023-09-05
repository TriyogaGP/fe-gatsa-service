const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.static(__dirname + "/dist/"));
app.get(/.*/ , function(req,res) {
  res.sendfile(__dirname + "/dist/index.html");
});

// socketio.on('connection', (socket) => {
//   // new socket connected

//   // listen for a 'message' event
//   socket.on('message', (eventData) => {
//     // attach the current time
//     eventData.processed = Date.now();
//     console.log(eventData)
//     // send the message back to the client
//     socket.emit('message', eventData);
//   })
// });

// http.listen(port_socketid, () => {
//   console.log('Server started on port', port_socketid);
// });

app.listen(port);

console.log("Server started..."); 