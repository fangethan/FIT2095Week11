const express = require('express');
const app = express();


var server = require('http').Server(app);
// io is the socket.io server
// io is the pool of connections
let io = require("socket.io")(server);

let port = 8080;
let path = require('path')

// The backend server should have the following duties:

app.use("/", express.static(path.join(__dirname, "dist/aflapp")));

// Maintain the teams' object
let teamsObj = {
  theText: "Select your team and enter the number of Tickets:",
  teams: [
    { text: "Melbourne", value: 0, count: 0 },
    { text: "Port Adelaide", value: 1, count: 0 },
    { text: "Geelong Cats", value: 2, count: 0 },
    { text: "Brisbane Lions", value: 3, count: 0 },
    { text: "Western Bulldogs", value: 4, count: 0 },
    { text: "Sydney Swans", value: 5, count: 0 },
    { text: "GWS Giants", value: 6, count: 0 },
    { text: "Essendon", value: 7, count: 0 },
    { text: "West Coast", value: 8, count: 0 },
    { text: "St Kilda", value: 9, count: 0 },
    { text: "Fremantle", value: 10, count: 0 },
    { text: "Richmond", value: 11, count: 0 },
    { text: "Carlton", value: 12, count: 0 },
    { text: "Hawthorn", value: 13, count: 0 },
    { text: "Adelaide", value: 14, count: 0 },
    { text: "Gold Coast", value: 15, count: 0 },
    { text: "Collingwood", value: 16, count: 0 },
    { text: "North Melbourne", value: 17, count: 0 },
  ],
};

let counter = 0;

// if an event occurs
// For each new connection
io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);

  // sending to the client
  //   socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
  // sending to all clients except sender
  //   socket.broadcast.emit('broadcast', 'hello friends!');
  // sending to all connected clients
  //   io.emit('an event sent to all connected clients')

  // emit means send
  // io means emit to everybody

  // For each new connection the server must respond with the teams' object
  io.sockets.emit("allTeams", {getAllTeams: teamsObj});

  // For each new purchase that arrives:
  socket.on('purchaseSender', (data) => {
    for (let i = 0; i < teamsObj.teams.length; i++) {
      if (data.value == teamsObj.teams[i].value) {
        // add the number of tickets to the team's counter
        teamsObj.teams[i].count += data.purchaseCount;
        console.log('matches')
        console.log(teamsObj.teams[i].text + ' count: ' + teamsObj.teams[i].count)
        counter += data.purchaseCount
        console.log('counter: ' + counter)
        console.log(teamsObj)
        purchaseObj = {
          newTeam: teamsObj,
          totalCount: counter
        }
      }
    }
    // why can it not do broadcast?
    // does work but the sender won't receive it, other browsers will receive it though
    // socket.broadcast.emit("purchaseResult", purchaseObj);

    // broadcast the updated object (or the updated counter) to all the connected clients (i.e. emit to all).
    io.sockets.emit("purchaseResult", purchaseObj);
  })

  socket.on('increaseSender', (data) => {
    for (let i = 0; i < teamsObj.teams.length; i++) {
        // add the number of tickets to the team's counter
        teamsObj.teams[i].count += data.purchaseCount;
        console.log(teamsObj.teams[i].text + ' count: ' + teamsObj.teams[i].count)
        counter += data.purchaseCount
        console.log('counter: ' + counter)
        increaseObj = {
          newTeam: teamsObj,
          totalCount: counter
        }
      }
    console.log(teamsObj)
    io.sockets.emit("increaseResult", increaseObj);
  })

});

server.listen(port, () => {
  console.log("Listening on port " + port);
  console.log('Server running at http://localhost:8080/');
});




