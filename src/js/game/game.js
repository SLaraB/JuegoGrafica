// Velocidad del tiempo
var timeStep = 1/60;

// Para visualizar physics
var cannonDebugRenderer;

// Ventana de renderer con Antialiasing
var renderer;

// Escena visual
var scene;

// Physics
var physics;

// Jugador
var player;

// Suelo
var ground;

// Luz
var light;

// Impactos de bala
var bulletHoles = [];

// Estado del juego
var gameState = "loading";

// Textura del suelo
var groundTexture;

// Material del suelo
var groundMaterial;

var body;

var box;


// Oculta y centra el puntero en pantalla
var mouseLocker;

// Contenedor del canvas
var gameWindow;

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
  groundTexture.repeat.set( 20, 20 );

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

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


  // Tamaño del render
  resizeScreen();

  // Añade la ventana al DOM
  gameWindow = document.getElementById("gameWindow");
  gameWindow.appendChild( renderer.domElement );

  // Oculta y centra el puntero en pantalla
  mouseLocker = new THREE.PointerLockControls( null ,  gameWindow );

  //add event listener to your document.body
  gameWindow.addEventListener('click', function () {
      mouseLocker.lock();
  }, false );

  // Escena visual
  scene = new THREE.Scene();

  // Escena de physics
  physics = new CANNON.World();
  physics.gravity.set(0,-9.82,0);
  physics.broadphase = new CANNON.NaiveBroadphase(); // Algoritmo de collisión
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, physics );

  // Luz
  light = new THREE.DirectionalLight( 0xffffff, 7,100 );
  light.position.set( 0.6, 1, 0 );
  light.castShadow = true;
  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024;  // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 1000;     // default
  const d = 15;
  light.shadow.camera.left = d;
  light.shadow.camera.right = -d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  var ambientLight = new THREE.AmbientLight( 0x666666,5 ); // soft white light
  scene.add( ambientLight );

  // Jugador
  player = createPlayer();


  // Suelo
  ground = new THREE.Mesh(new THREE.PlaneGeometry( 30, 30), groundMaterial);
  ground.position.y = -2;
  ground.lookAt(new THREE.Vector3(0,1,0));
  ground.collider = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.01))});
  ground.collider.position.y = -2;
  ground.collider.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  ground.receiveShadow = true;


  // Añade los elementos a la escena visual
  //scene.add( new THREE.AxesHelper( 5 ) ); // Muestra los ejes
  scene.add( player );
  scene.add( light );
  scene.add( ground );


  // Añade los elementos a la escena física
  physics.add( player.collider );
  physics.add( ground.collider );

  var boxGeo = new THREE.BoxGeometry( 1, 1, 1 );
  var boxMaterial = new THREE.MeshPhongMaterial( {
     color: 0x111111,
     shininess: 0,
     map: texturesList[3]
  } );
  box = new THREE.Mesh( boxGeo, boxMaterial );
  box.castShadow = true;
  scene.add( box );

  var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
  body = new CANNON.Body({ mass: 1 });
  body.addShape(shape);
  body.position.set(1,5,0);
  physics.add(body);
  box.body = body;

  // Cambia al estado "Jugando"
  gameState = "playing";





  var imagePrefix = "textures/skyboxes/Sunny/";
  var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
  var imageSuffix = ".jpg";

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
  updateBulletHoles();

  box.position.copy(box.body.position);
  box.quaternion.copy(box.body.quaternion);


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
