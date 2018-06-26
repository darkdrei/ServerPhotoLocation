'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var celulares = [];


io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets');
  //socket.emit('messages', messages);

  socket.on('autenticated', function(data) {
    console.log('  llegada ', socket.id);
    if (validarExistencia(data.identificador)){
        updateIdConneccion(data.identificador, socket.id);
    }else{
        data["conexion"]=socket.id;
        celulares.push(data);
    }
    console.log(celulares);
    io.to(socket.id).emit('response-autenticacion', {'llego': 'jajajajajaja'});
  });
  
  
  socket.on('solicitar-informacion', function (data) {
    console.log('se deben de identificar ---> ',data);
      console.log('celulares ---> ',celulares);
      socket.broadcast.emit({'estado_servicio':true});
      for(var i=0; i < celulares.length; i++){
        io.to(celulares[i].identificador).emit({'estado_servicio':true});
      }
      console.log('no lo eealizo');
  });

  socket.on('identificarme', function (data) {
      console.log(data);
  });
});


function validarExistencia(identificador){
  for (var i=0; i < celulares.length; i++){
    if(identificador == celulares[i].identificador){
      return true;
    }
  }
  return false;
}

function updateIdConneccion(identificador, value){
  for (var i=0; i < celulares.length; i++){
    if(identificador == celulares[i].identificador){
      celulares[i].conexion=value;
    }
  }


}

module.exports = server;