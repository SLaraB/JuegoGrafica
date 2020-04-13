/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: client.js
 **
 ** Descripción: Sección encargada de entablar
 ** la conexión web sockets con el servidor y
 ** recibir mensajes de éste.
 **
 *************************************/

// Socket.io
var socket;

// Almacena las salas de juego disponibles
var servers = [];

// Almacena la sala de juego seleccionada
var currentServer = {};

// Se conecta al servidor vía web sockets
function connectToServer()
{
    // Se conecta al servidor ( Utiliza la información del dominio por defecto )
    socket = io();

    // Crea las funciones para recibir mensajes del servidor
    listenToServerMessages();

}

// Funciones para manejar mensajes del servidor
function listenToServerMessages()
{

  // Respuesta a la asignación de nombre de usuario
  socket.on("usernameSetResponse",function(msg)
  {
    // Si se asigna con éxito
    if(msg.status)
    {
      // Almacena el nombre de usuario en el caché del navegador
      localStorage.setItem("username",msg.username);

      // Ingresa al menú principal
      setUsernameInput.hide();
      setUsernameBtn.hide();
      mainMenuError.hide();
      createServerBtn.show();
      showServersBtn.show();
    }
    else
    {
      // Muestra el error en pantalla
      mainMenuError.html(msg.msg).show();
    }
  });

  // Respuesta a la creación de una sala de juego
  socket.on("createServerResponse",function(msg)
  {
    // Si se crea la sala con éxito
    if(msg.status)
    {
      // Muestra la lista de salas de juegos
      showServersListMenu();
    }
    else
    {
      // Muestra el error en pantalla
      mainMenuError.html(msg.msg).show();
    }
  });

  // Mensaje con la lista de salas de juegos disponibles
  socket.on("serversListResponse",function(msg)
  {
    // Almacena la lista de salas
    servers = msg;

    // Imprime la lista de salas en pantalla en formato tabla
    var html = "<table><tr><th>Nombre de sala</th><th>Usuarios conectados</th><th>Creador</th></tr>";

    msg.forEach(function(s)
    {
      html += "<tr onclick='showServerLoginMenu("+s.id+")'><td>" + htmlEntities(s.name) + "</td><td>" + s.users + "</td><td>" + htmlEntities(s.creator) + "</td></tr>"
    });

    html += "</table>";

    // Asigna el html
    serversList.html(html);

    // Muestra la lista
    allMainMenus.hide();
    mainMenuError.hide();
    serversListMenu.show();
  });

  // Respuesta al iniciar sesión en una sala de juego
  socket.on("loginResponse",function(msg)
  {
    // Si se ingresa con éxito
    if(msg.status)
    {
      // Esconde los menús
      mainMenu.hide();

      // Muestra la interfaz del juego
      gameWindow.show();
      crosshair.show();

      // Cargá el juego - js/game/game.js
      init(msg);
    }
    else
    {
      // Muestra el error
      mainMenuError.html(msg.msg).show();
    }
  });

  // Notifica que un nuevo usuario ha ingresado a la sala
  socket.on("newUserLogged",function(msg)
  {
    // Verifica que sea del mismo equipo, e imprime la notificación en pantalla
    if(msg.team == player.team)
      messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha ingresado al equipo <b class='A'>Allies</b>.</div>");
    else
      messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha ingresado al equipo <b class='B'>Enemies</b>.</div>");

    // Se crea un nuevo jugador en la simulación local - js/game/serverPlayer.js
    loadNewPlayer(msg);
  });

  // Obtiene la posición, rotación y animación actual de un jugador
  socket.on("sendTransform",function(msg)
  {
    // Obtiene al jugador almacenado localmente
    var ply = serverPlayers[msg.username];

    // Verifica que esté previamente almacenado
    if(ply == undefined)return;

    // Actualiza su posición en la simulación actual
    ply.targetPosition.set(msg.x,msg.y,msg.z);

    // Actualiza su rotación en la simulación actual
    ply.rotation.set(msg.qx,msg.qy,msg.qz);

    // Si su animación actual es distinta a la anterior
    if(ply.currentAnimation != msg.anim)
    {
      // Se detienen todas las animaciones
      ply.mixer.stopAllAction();

      // Se asigna la nueva animación
      ply.currentAnimation = msg.anim;

      // Se reproduce la nueva animación
      ply.mixer.clipAction( ply.clips[msg.anim] ).play();
    }
  });

  // Notifica que un usuario ha realizado un disparo
  socket.on("sendShoot",function(msg)
  {
    // Si se está en modo juego
    if(gameState == "playing")
    {
      if(msg.status)
      {
        // Muestra la animación de "daño" en pantalla
        damageScreen.addClass("active").show();

        // Oculta la animación de daño despues de 200 milisegundos
        setTimeout(function(){ damageScreen.removeClass("active").hide();}, 200);

        // Resta vida al jugador principal
        player.setHealth(player.health - 10,msg.by);
      }

      // Obtiene al jugador almacenado localmente
      var ply = serverPlayers[msg.by];

      // Verifica que esté previamente almacenado
      if(ply == undefined)return;

      // Se simula el disparo localmente
      ply.shoot();
    }
  });

  /* OLD
  // Notifica que un usuario ha realizado un disparo
  socket.on("sendShoot",function(msg)
  {
    // Obtiene al jugador almacenado localmente
    var ply = serverPlayers[msg.username];

    // Verifica que esté previamente almacenado
    if(ply == undefined)return;

    // Se simula el disparo localmente
    ply.shoot(msg);
  });
  */
  // Notifica que un usuario ha reaparecido
  socket.on("userRespawned",function(user)
  {
    // Obtiene al jugador almacenado localmente
    var ply = serverPlayers[user];

    // Verifica que esté previamente almacenado
    if(ply == undefined)return;

    // Realiza su respawn
    ply.respawn();
  });

  // Si se termina el juego
  socket.on("gameOver",function(msg)
  {
    input.keys.up = false;
    input.keys.left = false;
    input.keys.right = false;
    input.keys.down = false;
    input.keys.shift = false;
    input.keys.space = false;

    gameState = "gameOver";
    gameOverWindow.find(".title").hide();

    if(msg.winnerTeam == player.team)
      gameOverWindow.find(".A").show();
    else
      gameOverWindow.find(".B").show();

    var a = msg.scoresA;
    var b = msg.scoresB;

    var htmlA = "<tr><th>Usuario</th><th>Kills</th><th>Deaths</th></tr>";

    for(var i = 0; i < a.length;i++)
      htmlA += "<tr><td>"+htmlEntities(a[i].username)+"</td><td>"+a[i].kills+"</td><td>"+a[i].deaths+"</td><td></tr>";

    var htmlB = "<tr><th>Usuario</th><th>Kills</th><th>Deaths</th></tr>";

    for(var i = 0; i < b.length;i++)
      htmlB += "<tr><td>"+htmlEntities(b[i].username)+"</td><td>"+b[i].kills+"</td><td>"+b[i].deaths+"</td><td></tr>";

    if(player.team == "A")
    {
      gameOverWindow.find(".allies table").html(htmlA);
      gameOverWindow.find(".enemies table").html(htmlB);
    }
    else
    {
      gameOverWindow.find(".allies table").html(htmlB);
      gameOverWindow.find(".enemies table").html(htmlA);
    }

    gameOverWindow.fadeIn(2000,function(){
      // Crea a los jugadores de la sala
      for(var key in serverPlayers)
      {
        scene.remove(serverPlayers[key]);
        physics.removeBody(serverPlayers[key].collider);
      }

      mouseLocker.unlock();
    });

  });

  // Notifica que un jugador ha muerto
  socket.on("userKilled",function(msg)
  {
    // Imprime la notificación en pantalla
    messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha sido asesinado por <b>"+htmlEntities(msg.killedBy)+"</b>.</div>");

    // Asigna el puntaje actual de cada equipo
    aKillCounter.html(msg.teamAKills);
    bKillCounter.html(msg.teamBKills);

    // Obtiene al jugador asesinado
    var ply = serverPlayers[msg.username];

    // Verifica que esté previamente almacenado
    if(ply == undefined)return;

    // Sonido de muerte
    var sound = new THREE.PositionalAudio( player.audioListener );
    ply.model.add(sound);
    sound.setRefDistance(soundRange);
    sound.setVolume(settings.audio.fxsVolume);
    sound.setBuffer( soundsList[6] );
    sound.play();
    setTimeout(function(){ ply.model.remove(sound); delete sound;}, 200);

    // Detiene todas sus animaciones
    ply.mixer.stopAllAction();


    // Reproduce la animación de muerte
    var anim = ply.mixer.clipAction( ply.clips.DIE );
    anim.setLoop( THREE.LoopOnce );
    anim.clampWhenFinished = true;
    anim.play();

    // Realiza un fade out del personaje a los 3 segundos
    setTimeout(function()
    {
      // Desactiva las sombras
      ply.model.children[1].castShadow = false;
      ply.weapon.children[0].castShadow = false;

      // Comienza el fade out
      ply.materialFadeOut = true;
    }, 3000);

  });

  // Notifica que un usuario se ha desconectado
  socket.on("userDisconnected",function(msg)
  {
    // Imprime la notificación en pantalla
    messagesCont.append("<div><b>"+htmlEntities(msg)+"</b> se ha desconectado.</div>");

    // Obtiene al jugador desconectado
    var ply = serverPlayers[msg];

    // Verifica que esté previamente almacenado
    if(ply == undefined)return;

    // Lo elimina de la escena
    scene.remove(ply);

    // Elimina sus colisiones
    physics.remove(ply.collider);

    // Lo elimina del la lista
    delete serverPlayers[msg];

  });
}
