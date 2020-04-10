var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var serverIdCounter = 0;
var servers = [];

const PORT = process.env.PORT || 3000;

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
    servers.push({id:serverIdCounter,name:msg.name,pass:msg.pass,creator:socket.username,users:[],date:Date.now(),teamAKills:0,teamBKills:0});
    serverIdCounter++;
    socket.emit("createServerResponse",{status:true});
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

  // Inicio de sesión en servidor
  socket.on('logIntoServer', function(msg)
  {
    if(typeof msg != "object")
    {
      socket.emit('loginResponse',{status:false,msg:"Error de request."});
      return;
    }
    if(!msg.hasOwnProperty("id") || !msg.hasOwnProperty("pass"))
    {
      socket.emit('loginResponse',{status:false,msg:"Request incompleta."});
      return;
    }

    if(typeof msg.id != "number" || typeof msg.pass != "string")
    {
      socket.emit('loginResponse',{status:false,msg:"Request inválida."});
      return;
    }

    for(var i = 0;i<servers.length;i++)
    {
      if(servers[i].id == msg.id && servers[i].pass==msg.pass)
      {

        var teamACount = 0;
        var teamBCount = 0;

        for(var u = 0;u<servers[i].users.length;u++)
        {
          if(servers[i].users[u].team == "A")teamACount++;
          if(servers[i].users[u].team == "B")teamBCount++;
        }

        if(teamACount<teamBCount)
          socket.team = "A";
        else
          socket.team = "B";

        var users = [];

        for(var u = 0;u<servers[i].users.length;u++)
        {
          users.push({username:servers[i].users[u].username,team:servers[i].users[u].team,status:servers[i].users[u].status});
          servers[i].users[u].emit("newUserLogged",{username:socket.username,team:socket.team,status:"loading"});
        }

        servers[i].users.push(socket);
        socket.currentServer = servers[i];

        socket.emit('loginResponse',{status:true,team:socket.team,users:users,teamAKills:servers[i].teamAKills,teamBKills:servers[i].teamBKills});
        return;
      }
    }

    socket.emit('loginResponse',{status:false,msg:"Contraseña incorrecta."});
  });

  socket.on("sendTransform",function(msg)
  {
    if(!socket.hasOwnProperty("currentServer")) return;
    if(!socket.currentServer.hasOwnProperty("users")) return;
    socket.currentServer.users.forEach((item, i) => {
      if(item.username != socket.username)
        item.emit("sendTransform",{
          username:socket.username,
          anim:msg.anim,
          x:msg.x,
          y:msg.y,
          z:msg.z,
          qx:msg.qx,
          qy:msg.qy,
          qz:msg.qz
        });
    });
  });

  socket.on("sendShoot",function(msg)
  {
    msg.username = socket.username;
    if(!socket.hasOwnProperty("currentServer"))return;
    for(var i = 0; i<socket.currentServer.users.length; i++)
      if(socket.currentServer.users[i].username != socket.username)
        socket.currentServer.users[i].emit("sendShoot",msg);
  });

  socket.on("userKilled",function(msg)
  {
    if(!socket.hasOwnProperty("currentServer"))return;
    if(socket.team == "A") socket.currentServer.teamBKills++;
    if(socket.team == "B") socket.currentServer.teamAKills++;

    // Si algun equipo alcanza los 20 kills
    if(socket.currentServer.teamAKills >= 20 || socket.currentServer.teamBKills >= 20)
    {
      for(var i = 0; i<socket.currentServer.users.length; i++)
      {
        socket.currentServer.users[i].emit("gameOver",{teamAKills:socket.currentServer.teamAKills,teamBKills:socket.currentServer.teamBKills});
      }
      socket.currentServer.teamAKills = 0;
      socket.currentServer.teamBKills = 0;
    }
    else
    {
      for(var i = 0; i<socket.currentServer.users.length; i++)
      {
        if(socket.currentServer.users[i].username != socket.username)
        {
          socket.currentServer.users[i].emit("userKilled",{
            username:socket.username,
            killedBy:msg.killedBy,
            teamAKills:socket.currentServer.teamAKills,
            teamBKills:socket.currentServer.teamBKills});
        }
      }
    }

  });

  socket.on('disconnect', function()
  {
    if(socket.hasOwnProperty("currentServer"))
    {
      for(var i = 0; i<socket.currentServer.users.length; i++)
      {
        if(socket.currentServer.users[i].username == socket.username)
        {
          socket.currentServer.users.splice(i,1);
          break;
        }
      }
      for(var i = 0; i<socket.currentServer.users.length; i++)
      {
        socket.currentServer.users[i].emit("userDisconnected",socket.username);
      }
    }
    console.log('Cliente ('+socket.id+') desconectado.');
  });
});


// Se crea el puerto
server.listen(PORT, function () {
  console.log('Juego corriendo en la diección http://localhost:3000 !');
});
