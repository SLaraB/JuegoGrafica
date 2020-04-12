/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: game.js
 **
 ** Descripción: Sección encargada de generar,
 ** controlar y actualizar todos los aspectos de una partida.
 ** El loop principal se encuentra en esta sección.
 **
 *************************************/

// Velocidad del tiempo
var timeStep = 1/60;

// Para visualizar physics
var cannonDebugRenderer;

// Ventana de renderer con Antialiasing
var renderer;

// Jugador Principal
var player;

// Estado del juego
var gameState = "loading";

// Otros jugadores
var serverPlayers = {};

// Sonidos UI
var uiAudio = new THREE.AudioListener();
var soundtrack;

// Settings del juego
var settings =
{
  audio:
  {
    fxsVolume:1,
    musicVolume:1,
    enabled:true
  },
  shadows:
  {
    enabled:true,
    quality:1,
    distance:1
  },
  debug:
  {
    displayPhysics:false
  }
};

// Inicializa los componentes del juego
function init(msg)
{
  // Ventana de visualización
  renderer = new THREE.WebGLRenderer({antialias:false});

  // Color para borrar cada frame
  renderer.setClearColor("#070B34");

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Añade la ventana al DOM
  gameWindow.html( $(renderer.domElement) );

  // Oculta y centra el puntero en pantalla
  mouseLocker = new THREE.PointerLockControls( null ,  gameWindow[0] );

  //add event listener to your document.body
  gameUI[0].addEventListener('click', function () {
      mouseLocker.lock();
  }, false );

  gameState = "playing";

  // Muestra la interfaz del juego
  gameUI.show();

  // Muestra los puntajes actuales
  aKillCounter.html(msg.teamAKills);
  bKillCounter.html(msg.teamBKills);

  // Genera el mundo ( js/game/level.js )
  generateLevel(msg);

  // Tamaño del render ( js/game/ui.js )
  resizeScreen();

  // Inicia el juego
  loop();
}

// Render Loop
var loop = function ()
{
  // Actualiza las animaciones
  requestAnimationFrame( loop );

  // Actualiza el input
	inputEvents();

  // Actualiza a todos los jugadores
  updatePlayers()

  // Actualiza las sombras
  updateShadows();

  // Actualiza los physics
	updatePhysics();

  // Render the scene
  renderer.render(scene, player.camera);
};

// Actualiza las sombras
function updateShadows()
{
  // Verifica que estén activas
  if(!settings.shadows.enabled) return;

  var shadowDistance = 30;
  // Calcula el rango de las sombras a partir de la posición del jugador principal
  var pPos = player.getPos();
  var angle = (new THREE.Vector3(pPos.x,pPos.y,0)).angleTo ( light.position );
  light.shadow.camera.top = shadowDistance - pPos.x * Math.sin(angle);
  light.shadow.camera.bottom = -shadowDistance - pPos.x * Math.sin(angle);
  light.shadow.camera.left = -shadowDistance - pPos.z;
  light.shadow.camera.right = shadowDistance - pPos.z;
  light.shadow.camera.updateProjectionMatrix();
}

// Actualiza los physics
function updatePhysics()
{
  // CAMBIAR ! SOLO DE PRUEBA !
  box.position.copy(box.body.position);
  box.quaternion.copy(box.body.quaternion);

  // Actualiza la posición de los agujeros de disparo
  updateBulletHoles();

  // Step the physics world
  physics.step(timeStep);

  // Muestra physics
  if(settings.debug.displayPhysics)
    cannonDebugRenderer.update();

}

// Actualiza a todos los jugadores
function updatePlayers()
{

  // Actualiza al jugador principal
  player.updatePlayer();

  // Actualiza a los jugadores de la sala
  for(var key in serverPlayers)
    serverPlayers[key].updatePlayer();

}

// Actualiza las posiciones de los impactos de bala
function updateBulletHoles()
{
  for(var i=0;i<bulletHoles.length;i++)
  {
    bulletHoles[i].position.copy(bulletHoles[i].body.position);
    bulletHoles[i].quaternion.copy(bulletHoles[i].body.quaternion);
  }
}

function playAgain()
{
  serverMessages.html("");
  aKillCounter.html(0);
  bKillCounter.html(0);
  player.respawn();
  gameOverWindow.hide();
}
function leaveRoom()
{
  /*
  socket.emit("leaveRoom");
  gameState = "loading";
  gameUI.hide();
  gameOverWindow.hide();
  gameWindow.hide();
  setUsernameInput.hide();
  setUsernameBtn.hide();
  mainMenuError.hide();
  createServerBtn.show();
  showServersBtn.show();
  mainMenu.show();
  */
  window.location.href = "/";
}
