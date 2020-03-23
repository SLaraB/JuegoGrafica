// Velocidad del tiempo
var timeStep = 1/60;

// Para visualizar physics
var cannonDebugRenderer;

// Ventana de renderer con Antialiasing
var renderer;

// Escena visual
var scene;

// Physics
var world;

// Jugador
var player;

// Suelo
var ground;

// Luz
var light;

// Estado del juego
var gameState = "loading";

// Textura del suelo
var groundTexture;

// Material del suelo
var groundMaterial;

// Justa el tamaño del canvas
function resizeScreen()
{
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// Inicializa los componentes del juego
function init()
{
  // Textura del suelo
  groundTexture = texturesList[1];
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.offset.set( 0, 0 );
  groundTexture.repeat.set( 10, 10 );

  // Material del suelo
  groundMaterial = new THREE.MeshPhongMaterial( {

     color: 0x111111,
     specular:0x010101,
     shininess: 0,
     map: groundTexture

  } );

  // Ventana de visualización
  renderer = new THREE.WebGLRenderer({antialias:false});

  // Color para borrar cada frame
  renderer.setClearColor("#070B34");

  // Tamaño del render
  resizeScreen();

  // Añade la ventana al DOM
  document.getElementById("gameWindow").appendChild( renderer.domElement );

  // Escena visual
  scene = new THREE.Scene();

  // Escena de physics
  physics = new CANNON.World();
  physics.gravity.set(0,-9.82,0);
  physics.broadphase = new CANNON.NaiveBroadphase(); // Algoritmo de collisión
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, physics );

  // Luz
  light = new THREE.DirectionalLight( 0xffBB99, 10 );
  light.rotation.x = (Math.PI/4);

  // Jugador
  player = createPlayer();

  // Suelo
  ground = new THREE.Mesh(new THREE.PlaneGeometry( 100, 100, 0 ), groundMaterial);
  ground.position.y = -2;
  ground.rotation.x = window.game.helpers.degToRad(-90);
  ground.collider = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  ground.collider.position.y = -2;
  ground.collider.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);


  // Añade los elementos a la escena visual
  //scene.add( new THREE.AxesHelper( 5 ) ); // Muestra los ejes
  scene.add( player );
  scene.add( light );
  scene.add( ground );


  // Añade los elementos a la escena física
  physics.add( player.collider );
  physics.add( ground.collider );

  // Cambia al estado "Jugando"
  gameState = "playing";





  var imagePrefix = "textures/skyboxes/NY/";
  var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
  var imageSuffix = ".png";

  var materialArray = [];
  for (var i = 0; i < 6; i++)
   materialArray.push( new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    side: THREE.BackSide
   }));

  var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );
  var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
  skyBox.rotation.x += Math.PI / 2;
  scene.add( skyBox );




  // Inicia el juego
  loop();
}






// Render Loop
var loop = function ()
{
  requestAnimationFrame( loop );
  player.updatePlayer();
	inputEvents();
	updatePhysics();


  // Render the scene
  renderer.render(scene, player.camera);
};

function updatePhysics()
{
    // Step the physics world
    physics.step(timeStep);

    // Muestra physics
    //cannonDebugRenderer.update();

}
