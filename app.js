'use strict'

var express = require('express');
var app = require('http').createServer(express);
var io = require('socket.io').listen(app);


io.configure('development', function(){
  io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(client){
    var userName;
	console.log("user connected!");
	client.emit('message', 'please insert user name');

	client.on('message', function(message){
        if (!userName) {
			userName = message;
			console.log(userName + ' is connected :)');
			client.emit('message', 'Welcome ' + userName);
			client.broadcast.emit('message', userName + ' is connected');
		}
		else {
			client.emit('message', 'me: ' + message);
			client.broadcast.emit('message', userName + ' says: ' + message);
		}
    });

    client.on('disconnect', function() {
		if (userName) {
			console.log(userName + " left");
			client.broadcast.emit('message', userName + ' left us :(');
		}
		else {
			console.log("anonymous left");
		}
    });
});

module.exports = app;