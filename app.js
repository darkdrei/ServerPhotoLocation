'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);



io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets');
  socket.emit('messages', messages);

  socket.on('autenticated', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
  });
});

module.exports = server;