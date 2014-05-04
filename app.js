var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/'));
	
// This is the port for the web server.
// you will need to go to 10.10.10.100:80 to see it
server.listen(8080);

io.set('log level', 1);

var userID = 0;
var entities = [];

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

	// Assign and imcrement userID on connection
	socket.emit('assignid',userID);
	userID++;
	
	// Server update loop
  setInterval(function(){
  	console.log(entities);
		io.sockets.emit('moving', entities);
  }, 15);  

	// Start listening for mouse move events
	socket.on('sendmove', function (data) {
		entities = data;
	});
	socket.on('removeEntity', function (i) {
		entities[i].remove = true;
	});
});