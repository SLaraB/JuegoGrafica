// Socket.io
var socket;

// Loading bar
var loadMenu,loadBar,loadInfo;

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

// --------------------------

var servers = [];
var currentServer = {};

// Cuando termina de cargar la página
$(function () {

    // Se conecta al servidor
    socket = io();

    // Obtiene los elementos del DOM
    loadMenu = $(".loadMenu");
    loadBar = $(".loadBar");
    loadInfo = $(".loadText");
    usernameMenu = $("#usernameMenu");
    createServerMenu = $("#createServerMenu");
    serverNameInput = $("#serverNameInput");
    serverPassInput = $("#serverPassInput");
    serversListMenu = $("#serversListMenu");
    loginServerMenu = $("#loginServerMenu");
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
    showFPS();

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
        cancelCreateServer();
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
      serversListMenu.show();
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
  allMainMenus
  mainMenuError.hide();
  serversListMenu.show();
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
