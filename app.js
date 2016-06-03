var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
  //socket.on('adduser', function(username){
  //  socket.username = username;
  //  socket.emit('updatedate', SERVER,'you are connected');
  //}),

   console.log('a user connected');
  /*
  { username : danet, message : "Hi everybody"}
  */
  socket.on('chat_message', function(msg){
    console.log('New message: ' + msg);
    io.emit('new_message', msg);
  });
  
  // socket.on('blabla', function(msg){
  //   console.log('User said '+msg);
  //   io.emit('message', msg);
  // })

});


http.listen(1337, function(){
  console.log('listening on *:1337');
});

