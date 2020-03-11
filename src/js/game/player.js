
function createPlayer()
{
  var mesh;

  // Se crea un objeto vacío
  var object = new THREE.Object3D();

  // Se le asigna el modelo importado
  var model = modelsList[0];
  object.model = model.scene.children[0];
  object.animations = model.animations;
  object.attach(object.model);

  // Le asigna el arma al brazo
  var weapon = modelsList[1];
  object.weapon = weapon.scene;
  object.weapon.scale.set(0.1,0.1,0.1);
  var rightHandBone = object.getObjectByName("mixamorigRightHand");
  rightHandBone.attach(object.weapon);
  object.weapon.position.set(0,0.27,0);
  object.weapon.rotateY(-0.03);

  // Se rota el modelo en 180º
  object.model.rotateY(Math.PI);

  // Animador
  object.mixer = new THREE.AnimationMixer( object.model );

  // Organiza las animaciones, dentro del modelo GLTF importado
  object.clips = {};
  object.clips.RF = THREE.AnimationClip.findByName( object.animations, 'Run F' );
  object.clips.RR = THREE.AnimationClip.findByName( object.animations, 'Run R' );
  object.clips.RB = THREE.AnimationClip.findByName( object.animations, 'Run B' );
  object.clips.RL = THREE.AnimationClip.findByName( object.animations, 'Run L' );
  object.clips.RFR = THREE.AnimationClip.findByName( object.animations, 'Run F R' );
  object.clips.RBR = THREE.AnimationClip.findByName( object.animations, 'Run B R' );
  object.clips.RBL = THREE.AnimationClip.findByName( object.animations, 'Run B L' );
  object.clips.RFL = THREE.AnimationClip.findByName( object.animations, 'Run F L' );
  object.clips.IDLE = THREE.AnimationClip.findByName( object.animations, 'Idle' );

  // Physics
  var shape = new CANNON.Sphere(0.3);
  object.collider = new CANNON.Body({ mass: 1 });
  object.collider.angularDamping = 1;
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0.6, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 1.2, 0));


  // Cámara
  object.camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );

  // Eje de rotación de la camara
  object.cameraRotator = new THREE.Object3D();
  object.cameraRotator.position = object.position;
  object.cameraRotator.position.y = object.position.y + 0.7;

  // Angulo límite vertical de cámara
  object.cameraAngleLimit = window.game.helpers.degToRad(80);

  // Se añade la cámara al eje
  object.cameraRotator.attach(object.camera);
  object.camera.position = object.cameraRotator.position;
  object.camera.position.z = object.cameraRotator.position.z + 2.8;
  object.camera.lookAt(object.cameraRotator.position);
  object.camera.rotateX(0.4);
  object.camera.position.x = object.cameraRotator.position.x + 0.4;


  // Se añade el eje al jugador
  object.attach(object.cameraRotator);

  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {
    // Copia coordenadas de Cannon.js a Three.js
    object.position.copy(object.collider.position);
    object.position.y -= 0.3;

    // Actualiza las animaciones
    object.mixer.update( timeStep );

  }

  return object;
}
