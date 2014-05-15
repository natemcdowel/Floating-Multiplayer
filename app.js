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
var score = [];
var entities = [];
var scoreLimit = 25;

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

	// Assign and imcrement userID on connection
	socket.emit('assignid',userID);
	score.push({hit:0});
	userID++;

	// Server update loop
	setInterval(function(){
		io.sockets.emit('moving', entities);
	}, 15);

	// Start listening for mouse move events
	socket.on('sendMove', function (data) {
		// for (i = 0; i < data.length; i += 1) {
		// 	if (data[i].remove) {
		// 		data.splice(i, 1);
		// 	}
		// }
		entities = data;
	});

	socket.on('removeEntity', function (i, userID, entityID) {
		score[userID].hit++;
		io.sockets.emit('updateScore', score);
		// if (!entities[i] || !entities[i].remove) {
		// 	entities[i] = {};
		// }
		for (i = 0; i < entities.length; i += 1) {
            if (entities[i] && entities[i].id) {
                if (parseInt(entities[i].id) == parseInt(entityID)) {
                	console.log(entityID);
                	entities[i].remove = true;
                }
            }
        }

		if (score[userID].hit >= scoreLimit) {
			io.sockets.emit('gameOver', userID);
		}
	});
});