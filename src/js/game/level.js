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

// Map del SlyBox
var skyBoxEnvMap;

// Modelo de miraflores
var miraflores,mColliders,mGrass,mRoad,mFence,mForest,mAudi,mAudi1,mApart,mHouse,
    mBags0,mBags1,mBags2,mBags3,mBags4,mBags5,
    m10kColumns,m10kWindows,m10kWalls,
    m8kConcrete,m8kRed,m8kWindows,
    m9kRed,m9kConcrete,m9kWindows,m9kA,m9kB;


var body;

var box;

// Colliders
var cGround;
function createMiraflores()
{
  // Obtiene los mesh de miraflores
  miraflores = modelsList[2].scene.children[0];
  mColliders = miraflores.getObjectByName("Colliders");
  mGrass = miraflores.getObjectByName("Plane_1");
  mRoad = miraflores.getObjectByName("Plane_0");
  mFence = miraflores.getObjectByName("Fence");
  mForest = miraflores.getObjectByName("Forest");
  mAudi = miraflores.getObjectByName("Audi");
  mAudi1 = miraflores.getObjectByName("Audi1");
  mApart = miraflores.getObjectByName("Apart");
  mHouse = miraflores.getObjectByName("House");
  mBags0 = miraflores.getObjectByName("SandBags");
  mBags1 = miraflores.getObjectByName("SandBags1");
  mBags2 = miraflores.getObjectByName("SandBags2");
  mBags3 = miraflores.getObjectByName("SandBags3");
  mBags4 = miraflores.getObjectByName("SandBags4");
  mBags5 = miraflores.getObjectByName("SandBags5");
  m10kWalls = miraflores.getObjectByName("Areas:building.001_0");
  m10kColumns = miraflores.getObjectByName("Areas:building.001_2");
  m10kWindows = miraflores.getObjectByName("Areas:building.001_1");
  m8kConcrete = miraflores.getObjectByName("Cube.001_0");
  m8kRed = miraflores.getObjectByName("Cube.001_2");
  m8kWindows = miraflores.getObjectByName("Cube.001_1");
  m9kDarkConcrete = miraflores.getObjectByName("Areas:building.002_1");
  m9kConcrete = miraflores.getObjectByName("Areas:building.002_0");
  m9kWindows = miraflores.getObjectByName("Areas:building.002_2");
  m9kA = miraflores.getObjectByName("Areas:building.002_3");
  m9kB = miraflores.getObjectByName("Areas:building.002_4");


  // Variable para regular brillo de materiales
  var darkness = 0.15;

  // Modifica sombra y materiales del césped
  mGrass.receiveShadow = true;
  mGrass.material.color = new THREE.Color(darkness,darkness,darkness);
  mGrass.material.roughness = 1;

  // Modifica sombra y materiales del camino
  mRoad.receiveShadow = true;
  mRoad.material.color = new THREE.Color(darkness,darkness,darkness);
  mRoad.material.roughness = 1;

  // Cerco
  mFence.material.color = new THREE.Color(darkness*5,darkness*5,darkness*5);
  mFence.material.roughness = 0.95;
  mFence.side = THREE.FrontSide;
  mFence.renderOrder = 1000;

  // Audi
  mAudi.receiveShadow = true;
  mAudi.castShadow = true;
  mAudi.material.color = new THREE.Color(darkness*2,darkness*2,darkness*2);
  mAudi.material.roughness = 0.95;
  mAudi.material.side = THREE.FrontSide;

  // Audi 1
  mAudi1.receiveShadow = true;
  mAudi1.castShadow = true;
  mAudi1.material.color = new THREE.Color(darkness*2,darkness*2,darkness*2);
  mAudi1.material.roughness = 0.95;
  mAudi1.material.side = THREE.FrontSide;

  // Apart
  mApart.receiveShadow = true;
  mApart.castShadow = true;
  mApart.material.color = new THREE.Color(darkness*1.5,darkness*1.5,darkness*1.5);
  mApart.material.roughness = 0.95;
  mApart.material.side = THREE.FrontSide;

  // Bags
  mBags0.receiveShadow = true;
  mBags0.castShadow = true;
  mBags0.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags0.material.roughness = 1;
  mBags0.material.side = THREE.FrontSide;

  // Bags
  mBags1.receiveShadow = true;
  mBags1.castShadow = true;
  mBags1.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags1.material.roughness = 1;
  mBags1.material.side = THREE.FrontSide;

  // Bags
  mBags2.receiveShadow = true;
  mBags2.castShadow = true;
  mBags2.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags2.material.roughness = 1;
  mBags2.material.side = THREE.FrontSide;

  // Bags
  mBags3.receiveShadow = true;
  mBags3.castShadow = true;
  mBags3.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags3.material.roughness = 1;
  mBags3.material.side = THREE.FrontSide;

  // Bags
  mBags4.receiveShadow = true;
  mBags4.castShadow = true;
  mBags4.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags4.material.roughness = 1;
  mBags4.material.side = THREE.FrontSide;

  // Bags
  mBags5.receiveShadow = true;
  mBags5.castShadow = true;
  mBags5.material.color = new THREE.Color(darkness,darkness,darkness);
  mBags5.material.roughness = 1;
  mBags5.material.side = THREE.FrontSide;

  // House
  mHouse.receiveShadow = true;
  mHouse.castShadow = true;
  mHouse.material.color = new THREE.Color(darkness*1.5,darkness*1.5,darkness*1.5);
  mHouse.material.roughness = 0.95;
  mHouse.material.side = THREE.FrontSide;

  // Bosque
  mForest.material.color = new THREE.Color(darkness*5,darkness*5,darkness*5);
  mForest.material.roughness = 1;
  mForest.side = THREE.FrontSide;


  // Modifica sombra y materiales del edificio 10000
  m10kWalls.receiveShadow = true;
  m10kWalls.castShadow = true;
  m10kWalls.material.color = new THREE.Color(darkness*2,darkness*2,darkness*2);
  m10kWalls.material.roughness = 0.95;
  m10kWalls.material.side = THREE.FrontSide;
  m10kColumns.receiveShadow = true;
  m10kColumns.castShadow = true;
  m10kColumns.material.color = new THREE.Color(darkness,darkness,darkness);
  m10kColumns.material.roughness = 1;
  m10kColumns.material.side = THREE.FrontSide;
  m10kWindows.receiveShadow = true;
  m10kWindows.castShadow = true;
  m10kWindows.material.color = new THREE.Color(0,0,0);
  m10kWindows.material.roughness = 0.9;
  m10kWindows.material.side = THREE.FrontSide;

  // Modifica sombra y materiales del edificio 8000
  m8kRed.receiveShadow = true;
  m8kRed.castShadow = true;
  m8kRed.material.color = new THREE.Color(darkness*2,darkness*2,darkness*2);
  m8kRed.material.roughness = 0.95;
  m8kRed.side = THREE.FrontSide;
  m8kConcrete.receiveShadow = true;
  m8kConcrete.castShadow = true;
  m8kConcrete.material.color = new THREE.Color(darkness*2,darkness*2,darkness*2);
  m8kConcrete.material.roughness = 1;
  m8kConcrete.material.side = THREE.FrontSide;

  // Modifica sombra y materiales del edificio 9000
  m9kDarkConcrete.receiveShadow = true;
  m9kDarkConcrete.castShadow = true;
  m9kDarkConcrete.material.color = new THREE.Color(0.01,0.01,darkness/4);
  m9kDarkConcrete.material.roughness = 1;
  m9kDarkConcrete.material.side = THREE.FrontSide;
  m9kConcrete.receiveShadow = true;
  m9kConcrete.castShadow = true;
  m9kWindows.receiveShadow = true;
  m9kWindows.castShadow = true;
  m9kA.receiveShadow = true;
  m9kA.castShadow = true;
  m9kB.receiveShadow = true;
  m9kB.castShadow = true;

  // Añade miraflores a la escena
  scene.add(miraflores);

  var groundMaterial = new CANNON.Material({friction:0});

  for(var i = 0; i<mColliders.children.length; i++)
  {
    var threeShape = mColliders.children[i];
    var pos = threeShape.getWorldPosition();
    var rot = threeShape.getWorldQuaternion();
    var worldBody = new CANNON.Body({ material: groundMaterial,mass: 0,shape: new CANNON.Box(new CANNON.Vec3(threeShape.scale.x,threeShape.scale.y,threeShape.scale.z))});
    worldBody.position.copy(pos);
    worldBody.quaternion.copy(rot);
    physics.add(worldBody);
    groundColliders.push(worldBody);
  }


}

function generateTestingWorld()
{
  cGround = new CANNON.Body({mass: 0, shape: new CANNON.Box(new CANNON.Vec3(60, 60, 1.01))});
  cGround.position.y = -3;
  cGround.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  //groundColliders.push(cGround);
  //physics.add(cGround);



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

  var loader = new THREE.CubeTextureLoader();
  loader.setPath( 'textures/' );
  skyBoxEnvMap= loader.load( [ texturesPathList[4],texturesPathList[5],texturesPathList[6],texturesPathList[7],texturesPathList[8],texturesPathList[9] ] );


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
  ambientLight = new THREE.AmbientLight( 0x666666,7 );

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

  // Crea miraflores
  createMiraflores();


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
  hole.position.set(x+nx*0.02,y+ny*0.02,z+nz*0.02);
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
