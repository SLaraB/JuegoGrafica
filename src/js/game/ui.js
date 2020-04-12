/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: ui.js
 **
 ** Descripción: Sección encargada de obtener
 ** acceso a los elementos del DOM, y de
 ** manipular la interfaz de usuario
 **
 *************************************/

// Contenedor del canvas
var gameWindow;

// Contenedor UI
var gameUI, healthBar, ammoBar;

// Contador de kills
var killCounter, aKillCounter, bKillCounter;

// Settings
var settingsWindow,settingsLeaveRoom,settingsMusicLevel,settingsSoundLevel,settingsShadowDistance,settingsShadowQuality;

// Ventana de respawn
var respawnWindow,respawnTitle;

// Ventana de gameOver
var gameOverWindow;

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

// Obtiene los elementos del DOM
function loadUI()
{
    settingsWindow = $("#settingsWindow");
    settingsLeaveRoom = $("#settingsLeave");
    settingsMusicLevel = $("#musicVolSlider");
    settingsSoundLevel = $("#soundVolSlider");
    settingsShadowDistance = $("#shadowDistanceSlider");
    settingsShadowQuality = $("#shadowQualitySlider");

    settingsMusicLevel.on("change",function()
    {
      settings.audio.musicVolume = settingsMusicLevel.val()*0.01;
      soundtrack.setVolume(settings.audio.musicVolume);
      localStorage.setItem("musicVol",settings.audio.musicVolume);
    });

    settingsSoundLevel.on("change",function()
    {
      settings.audio.fxsVolume = settingsSoundLevel.val()*0.01;

      localStorage.setItem("soundVol",settings.audio.musicVolume);
    });

    settingsShadowQuality.on("change",function()
    {
      settings.shadows.quality = settingsShadowQuality.val();

      localStorage.setItem("shadowsQ",settings.shadows.quality);

      if(gameState == "playing")
      {
        /*
        light.shadow.mapSize.width = 256*settings.shadows.quality;
        light.shadow.mapSize.height = 256*settings.shadows.quality;
        scene.remove(light);
        scene.add(light);
        */
      }
    });







    gameWindow = $("#gameWindow");
    gameOverWindow = $("#gameOverWindow");
    gameUI = $("#gameUI");
    respawnWindow = $("#respawnWindow");
    respawnTitle = $("#respawnWindow .title");
    healthBar = $("#healthBar .bar");
    ammoBar = $("#ammoBar .bar");
    crosshair = $("#crosshair");
    serverMessages = $("#serverMessages");
    messagesCont = $("#serverMessages .container");
    damageScreen = $("#damageScreen");
    killCounter = $("#killCounter");
    aKillCounter = $("#killCounter .a .count");
    bKillCounter = $("#killCounter .b .count");
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

    // Obtiene el nombre de usuario usado previamente
    var getter = localStorage.getItem("username");
    if(getter != null)
      // Asigna el nombre de usuario previo al input
      setUsernameInput.val(getter);

    getter = localStorage.getItem("musicVol");
    if(getter != null)
    {
      settingsMusicLevel.val(getter);
      settings.audio.musicVolume = getter;
    }
    else
    {
      settingsMusicLevel.val(0.05);
      settings.audio.musicVolume = 0.05;
    }

    getter = localStorage.getItem("soundVol");
    if(getter != null)
    {
      settingsMusicLevel.val(getter);
      settings.audio.fxsVolume = getter;
    }
    else
    {
      settingsMusicLevel.val(1);
      settings.audio.fxsVolume = 1;
    }

    getter = localStorage.getItem("shadowsQ");
    if(getter != null)
    {
      settingsShadowQuality.val(getter);
      settings.shadows.quality = getter;
    }

}

// Reajusta el tamaño del canvas cuando se cambia el tamaño de la ventana
function resizeScreen()
{
  // Verifica que esté en modo juego
  if(gameState != "loading")
  {
    // Cambia el aspect ratio de la cámara
    player.camera.aspect = window.innerWidth / window.innerHeight;

    // Actualiza la matriz de proyección de la cámara
    player.camera.updateProjectionMatrix();

    // Cambia el tamaño del canvas
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

}

// Asigna el nombre de usuario
function setUserName()
{
  soundtrack.play();
  socket.emit('setUsername', setUsernameInput.val());
}

// Muestra el menú principal
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

function showSettings()
{
  if(gameState == "playing")
    settingsLeaveRoom.show();
  else
    settingsLeaveRoom.hide();

  settingsWindow.show();
}

function hideSettings()
{
  settingsWindow.hide();
}
