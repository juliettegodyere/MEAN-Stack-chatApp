var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var User = function(){
  var users = {};
  return {
    'add' : function(id, socket){
        users[id] = socket;
    }, 
    'isExist' : function(id){
      return users.hasOwnProperty(id);
    },
    'reconnect' : function(id, socket){
        users[id] = socket;
    },
    'broadcast' : function(id, message){
        users.forEach(function(item){
          if (users[item].socket.connected){
             socket.emit('message', JSON.stringify({username:id, message:message}));
          }
        })
    }
  }
}();

var count = 0;



io.on('connection', function(socket){
    
    count++;

  console.log('a user connected');
  
  socket.on('chat_message', function(msg){
    console.log('New message: ' + msg);
    io.emit('new_message', msg);
  });


  socket.on('reg', function(msg){
     socket['username'] = msg;
    io.emit('new_connection', msg);
    socket.emit('count', count);
    console.log('Registered '+socket.username);
  });

  socket.on('disconnect', function(){
      io.emit('new_disconnection', socket.username);
      socket = null;
      delete socket;
      count--;
      console.log('socket disconnected and deleted');
  })

  socket.on('register', function(id){
    if (User.isExist(id)){
       User.reconnect(id, socket);
    } else {
       User.add(id, socket); 
    }
  });
  
});


http.listen(1337, function(){
  console.log('listening on *:1337');
});

