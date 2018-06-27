'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var celulares = [];


io.on('connection', function(socket) {

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
      for(var i=0; i < celulares.length; i++){
        io.to(celulares[i].conexion).emit('estado-servicio', {'servicio':true});
      }
  });

  socket.on('identificarme', function (data) {
      io.to(socket.id).emit('respuesta-identificacion', {'respuesta':true})
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