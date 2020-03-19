var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/src'));

app.listen(3000, function () {
  console.log('Juego corriendo en la diección http://localhost:3000 !');
});

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
});
