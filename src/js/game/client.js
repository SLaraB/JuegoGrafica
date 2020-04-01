// Socket.io
var socket;

// Contenedor del canvas
var gameWindow;

// Contenedor UI
var gameUI, healthBar, ammoBar;

// Contador de kills
var killCounter, aKillCounter, bKillCounter;

// Mira
var crosshair;

// Efecto de daño
var damageScreen;

// Loading bar
var loadMenu,loadBar,loadInfo;

// Menú principal
var mainMenu;

// Input para asignar nombre de usuario
var setUsernameInput;

// Botón para asignar nombre de usuario
var setUsernameBtn;

// Menú de inicio
var usernameMenu;

// Menú de creación de servidor
var createServerMenu;

// Menú con lista de servidores
var serversListMenu;

// Menú para iniciar sesión
var loginServerMenu;

// Input de password para ingresar a servidor
var loginServerPasswordInput;

// Botón para ingresar a servidor
var loginServerBtn;

// Lista de servidores
var serversList;

// Input de nombre del servidor
var serverNameInput;

// Input de contraseña del servidor
var serverPassInput;

// Mensaje de error al asignar nombre de usuario
var mainMenuError;

// Botón para crear servidor
var createServerBtn;

// Botón para mostrar servidores
var showServersBtn;

// Todos los menus
var allMainMenus;

// Contenedor de mensajes del servidor
var serverMessages, messagesCont;

// --------------------------

var servers = [];
var currentServer = {};

// Cuando termina de cargar la página
$(function () {

    // Se conecta al servidor
    socket = io();

    // Game canvas
    gameWindow = $("#gameWindow");
    gameUI = $("#gameUI");
    healthBar = $("#healthBar .bar");
    ammoBar = $("#ammoBar .bar");
    crosshair = $("#crosshair");
    serverMessages = $("#serverMessages");
    messagesCont = $("#serverMessages .container");
    damageScreen = $("#damageScreen");
    killCounter = $("#killCounter");
    aKillCounter = $("#killCounter .a .count");
    bKillCounter = $("#killCounter .b .count");

    // Obtiene los elementos del DOM
    mainMenu = $("#mainMenu");
    loadMenu = $(".loadMenu");
    loadBar = $(".loadBar");
    loadInfo = $(".loadText");
    usernameMenu = $("#usernameMenu");
    createServerMenu = $("#createServerMenu");
    serverNameInput = $("#serverNameInput");
    serverPassInput = $("#serverPassInput");
    serversListMenu = $("#serversListMenu");
    loginServerMenu = $("#loginServerMenu");
    loginServerPasswordInput = $("#loginServerPasswordInput");
    loginServerBtn = $("#loginServerBtn");
    setUsernameInput = $("#setUsernameInput");
    setUsernameBtn = $("#setUsernameBtn");
    mainMenuError = $("#mainMenuError");
    createServerBtn = $("#createServerBtn");
    showServersBtn = $("#showServersBtn");
    serversList = $(".serversList");
    allMainMenus = $(".mainMenu");

    // Inicia carga de assets
    initWebGL();

    // Muestra los FPS
    //showFPS();

    // Obtiene el nombre de usuario usado previamente
    var prevUsername = localStorage.getItem("username");
    if(prevUsername != null)
      setUsernameInput.val(prevUsername);


    // Respuesta a la asignación de nombre de usuario
    socket.on("usernameSetResponse",function(msg)
    {
      // Si se asigna con éxito
      if(msg.status)
      {
        localStorage.setItem("username",msg.username);
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

    // Respuesta a la asignación de nombre de usuario
    socket.on("createServerResponse",function(msg)
    {
      // Si se asigna con éxito
      if(msg.status)
      {
        showServersListMenu();
      }
      else
      {
        // Muestra el error en pantalla
        mainMenuError.html(msg.msg).show();
      }
    });

    // Respuesta a la asignación de nombre de usuario
    socket.on("serversListResponse",function(msg)
    {
      servers = msg;
      var html = "<table><tr><th>Nombre de sevidor</th><th>Usuarios conectados</th><th>Creador</th></tr>";

      msg.forEach(function(s)
      {
        html += "<tr onclick='showServerLoginMenu("+s.id+")'><td>" + htmlEntities(s.name) + "</td><td>" + s.users + "</td><td>" + htmlEntities(s.creator) + "</td></tr>"
      });


      html += "</table>";

      serversList.html(html);

      allMainMenus.hide();
      mainMenuError.hide();
      serversListMenu.show();
    });

    // Respuesta de login
    socket.on("loginResponse",function(msg)
    {
      if(msg.status)
      {
        mainMenu.hide();
        gameWindow.show();
        crosshair.show();
        init(msg);
      }
      else
      {
        mainMenuError.html(msg.msg).show();
      }
    });

    socket.on("newUserLogged",function(msg)
    {
      if(msg.team == player.team)
        messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha ingresado al equipo <b class='A'>Allies</b>.</div>");
      else
        messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha ingresado al equipo <b class='B'>Enemies</b>.</div>");
      loadNewPlayer(msg);
    });

    // Respuesta de login
    socket.on("sendTransform",function(msg)
    {
      var ply = serverPlayers[msg.username];
      if(ply == undefined)return;
      ply.targetPosition = new CANNON.Vec3(msg.x,msg.y,msg.z);
      ply.rotation.set(msg.qx,msg.qy,msg.qz);
      if(ply.currentAnimation != msg.anim)
      {
        ply.mixer.stopAllAction();
        ply.currentAnimation = msg.anim;
        ply.mixer.clipAction( ply.clips[msg.anim] ).play();
      }
    });

    // Respuesta de login
    socket.on("sendShoot",function(msg)
    {
      var ply = serverPlayers[msg.username];
      if(ply == undefined)return;
      ply.shoot(msg);

    });

    // Cuando muere un jugador
    socket.on("userKilled",function(msg)
    {
      messagesCont.append("<div><b>"+htmlEntities(msg.username)+"</b> ha sido asesinado por <b>"+htmlEntities(msg.killedBy)+"</b>.</div>");
      aKillCounter.html(msg.teamAKills);
      bKillCounter.html(msg.teamBKills);
      var ply = serverPlayers[msg.username];
      ply.mixer.stopAllAction();
      var anim = ply.mixer.clipAction( ply.clips.DIE );
      physics.removeBody(ply.collider);
      anim.setLoop( THREE.LoopOnce );
      anim.clampWhenFinished = true;
      anim.play();
      setTimeout(function()
      {
        ply.model.children[1].castShadow = false;
        ply.weapon.children[0].castShadow = false;
        ply.materialFadeOut = true;
      }, 3000);

    });

    // Respuesta de login
    socket.on("userDisconnected",function(msg)
    {
      messagesCont.append("<div><b>"+htmlEntities(msg)+"</b> se ha desconectado.</div>");
      var ply = serverPlayers[msg];
      scene.remove(ply);
      physics.remove(ply.collider);
      delete ply;

    });



  });

// Asigna el nombre de usuario
function setUserName()
{
  socket.emit('setUsername', setUsernameInput.val());
}

function showMainMenu()
{
  allMainMenus.hide();
  mainMenuError.hide();
  usernameMenu.show();
}

// Muestra el menú para crear un servidor
function showCreateServerMenu()
{
  allMainMenus.hide();
  mainMenuError.hide();
  createServerMenu.show();
}

// Crea el servidor
function createServer()
{
  socket.emit('createServer', {name:serverNameInput.val(),pass:serverPassInput.val()});
}

// Muestra el menú para crear un servidor
function showServersListMenu()
{
  allMainMenus.hide();
  mainMenuError.hide();
  socket.emit('getServersList');
}

// Muestra el menú para iniciar sesión a un servidor
function showServerLoginMenu(id)
{
  serversListMenu.hide();
  mainMenuError.hide();
  currentServer = findObjectById(parseInt(id),servers);
  loginServerMenu.find(".title").html(htmlEntities(currentServer.name));
  loginServerMenu.show();
}

// Solicita el ingreso a servidor
function logIntoServer()
{
  socket.emit('logIntoServer',{id:currentServer.id,pass:loginServerPasswordInput.val()});
}
