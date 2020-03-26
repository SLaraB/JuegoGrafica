var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var serverIdCounter = 0;
var servers = [];

// Ruteo estático para carga de archivos
app.use(express.static(__dirname + "/src"));

// Nuevo cliente
io.on('connection', function(socket)
{
  console.log('Cliente ('+socket.id+') conectado.');

  // Cliente asigna su nombre de usuario
  socket.on('setUsername', function(msg)
  {
    // Verifica que sea un string
    if(typeof msg != "string")
    {
      socket.emit("usernameSetResponse",{status:false,msg:"Error de request."});
      return;
    }

    // Verifica que sea un nombre válido
    if(msg.length == 0)
    {
      socket.emit("usernameSetResponse",{status:false,msg:"Usuario demasiado corto."});
      return;
    }

    // Busca si el nombre de usuario ya existe
    for(var client in io.sockets.sockets)
    {
      if(io.sockets.sockets[client].username == msg)
      {
        socket.emit("usernameSetResponse",{status:false,msg:"Nombre de usuario en uso."});
        return;
      }
    }

    socket.username = msg;
    socket.emit("usernameSetResponse",{status:true,username:msg});

    console.log('Cliente ('+socket.id+') se llama: ' + msg);
  });

  // Cliente asigna su nombre de usuario
  socket.on('createServer', function(msg)
  {
    if(socket.username == undefined || typeof msg != "object")
    {
      socket.emit("createServerResponse",{status:false,msg:"Error de request."});
      return;
    }
    if( !msg.hasOwnProperty("name") || !msg.hasOwnProperty("pass"))
    {
      socket.emit("createServerResponse",{status:false,msg:"Request incompleta."});
      return;
    }
    if( typeof msg.name != "string" || typeof msg.pass != "string")
    {
      socket.emit("createServerResponse",{status:false,msg:"Datos inválidos."});
      return;
    }
    if( msg.name.length == 0 )
    {
      socket.emit("createServerResponse",{status:false,msg:"Nombre de servidor demasiado corto."});
      return;
    }
    if( msg.pass.length == 0 )
    {
      socket.emit("createServerResponse",{status:false,msg:"Contraseña de servidor demasiado corta."});
      return;
    }
    for(var server in servers)
    {
      if(server.name == msg.name)
      {
        socket.emit("createServerResponse",{status:false,msg:"Ya existe un servidor con ese nombre."});
        return;
      }
    }
    servers.push({id:serverIdCounter,name:msg.name,pass:msg.pass,creator:socket.username,users:[],date:Date.now()});
    serverIdCounter++;
    console.log("Nuevo servidor '" + msg.name + "' creado por " + socket.username + ".");
  });

  // Enviar lista de servidores
  socket.on('getServersList', function()
  {
    var serversList = [];
    servers.forEach(function(s)
    {
      serversList.push({id:s.id,name:s.name,users:s.users.length,creator:s.creator});
    });

    socket.emit('serversListResponse',serversList);
  });

  socket.on('disconnect', function()
  {
    console.log('Cliente ('+socket.id+') desconectado.');
  });
});


// Se crea el puerto
server.listen(3000, function () {
  console.log('Juego corriendo en la diección http://localhost:3000 !');
});
