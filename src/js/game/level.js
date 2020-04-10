/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: level.js
 **
 ** Descripción: Sección encargada de generar
 ** el mundo visual (THREE) y físico (CANNON).
 **
 *************************************/

// Escena visual (THREE.JS)
var scene;

// Escena de physics (CANNON.JS)
var physics;

// Suelo
var ground;

// Colliders de tipo suelo
var groundColliders = [];

// Luz direccional
var light;

// Luz ambiental
var ambientLight

// Impactos de bala
var bulletHoles = [];

// Textura del suelo
var groundTexture;

// Material del suelo
var groundMaterial;

var body;

var box;

function generateTestingWorld()
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

  // Suelo
  ground = new THREE.Mesh(new THREE.PlaneGeometry( 100, 100), groundMaterial);
  ground.position.y = -2;
  ground.lookAt(new THREE.Vector3(0,1,0));
  ground.collider = new CANNON.Body({mass: 0, shape: new CANNON.Box(new CANNON.Vec3(50, 50, 0.01))});
  ground.collider.position.y = -2;
  ground.collider.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  ground.receiveShadow = true;
  groundColliders.push(ground.collider);

  physics.add( ground.collider );
  scene.add( ground );

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

}

function createSkybox()
{
  var materialArray = [];
  for (var i = 4; i < 10; i++)
   materialArray.push( new THREE.MeshBasicMaterial({
    map: texturesList[i],
    side: THREE.BackSide
   }));

  var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );
  var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
  skyBox.rotation.x += Math.PI / 2;
  scene.add( skyBox );
}

function createLights()
{
  // Luz direccional
  light = new THREE.DirectionalLight( 0xffffff, 7,100 );
  light.position.set( 500, 500, 0 );
  light.castShadow = true;

  // Propiedades iniciales de la luz direccional
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 1000;

  // Luz ambiental
  ambientLight = new THREE.AmbientLight( 0x666666,5 );

  // Las añade al mundo visual
  scene.add( light );
  scene.add( ambientLight );

}

function generateLevel(msg)
{
  // Crea la escena visual
  scene = new THREE.Scene();

  // Crea la escena de physics
  physics = new CANNON.World();

  // Asigna la gravedad
  physics.gravity.set(0,-9.82*1.5,0);

  // Asigna el algoritmo de colisiones
  physics.broadphase = new CANNON.NaiveBroadphase();

  // Para visualizar los physics
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, physics );

  // Genera el mundo de prueba
  generateTestingWorld();
  
  // Crea las luces
  createLights();

  // Crea el skybox
  createSkybox();

  // Jugador
  player = createPlayer(msg.team,"playing");
  scene.add( player );
  physics.add( player.collider );

  // Crea a los jugadores de la sala
  msg.users.forEach((item, i) => {
    loadNewPlayer(item);
  });

}

// Particula de fuego al disparar
function createGunFireParticle()
{
  var material = new THREE.SpriteMaterial( { map: texturesList[0],blending: THREE.AdditiveBlending} );
  var sprite = new THREE.Sprite( material );
  sprite.scale.set(0.5,0.5,0.5);
  return sprite;
}

// Impacto de bala
function createBulletHole(x,y,z,nx,ny,nz,body,from)
{
  if(body.hasOwnProperty("class"))return;
  var parent = new THREE.Object3D();
  parent.position.copy(body.position);
  parent.quaternion.copy(body.quaternion);
  var material = new THREE.MeshPhongMaterial( {
     color: 0x111111,
     specular:0x010101,
     shininess: 0,
     map: texturesList[2],
     transparent:true
  } );
  var hole = new THREE.Mesh(new THREE.PlaneGeometry( 0.15, 0.15, 0 ), material);
  hole.lookAt(new THREE.Vector3(nx,ny,nz));
  hole.position.set(x+nx*0.01,y+ny*0.01,z+nz*0.01);
  parent.attach(hole);
  parent.body = body;
  scene.add(parent);
  bulletHoles.push(parent);

  // Add an impulse to the center
  var worldPoint = new CANNON.Vec3(x,y,z);

  var impulse = new CANNON.Vec3(x-from.x,y-from.y,z-from.z);
  impulse.normalize();
  impulse = impulse.scale(2);
  parent.body.applyImpulse(impulse,worldPoint);

  setTimeout(function(){ scene.remove(parent);bulletHoles.shift() }, 10000);

}
