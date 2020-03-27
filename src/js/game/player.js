
function createPlayer(team,status)
{
  var mesh;
  // Se crea un objeto vacío
  var object = new THREE.Object3D();
  object.team = team;
  object.status = status;

  // Se le asigna el modelo importado
  var model = modelsList[0];
  object.model = model.scene.children[0];
  object.animations = model.animations;
  object.attach(object.model);
  object.model.children[1].castShadow = true;

  // Le asigna el arma al brazo
  var weapon = modelsList[1];
  object.weapon = weapon.scene;
  object.weapon.scale.set(0.1,0.1,0.1);
  var rightHandBone = object.getObjectByName("mixamorigRightHand");
  rightHandBone.attach(object.weapon);
  object.weapon.position.set(0,0.27,0);
  object.weapon.rotateY(-0.03);

  // Gun Fire Particle
  object.gunFireParticle = createGunFireParticle();
  object.weapon.attach(object.gunFireParticle);
  object.gunFireParticle.position.set(0.2,2,4);
  object.gunFireParticle.visible = false;

  // Se rota el modelo en 180º
  object.model.rotateY(Math.PI);

  //
  object.walking = false;

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

  object.currentAnimation = "IDLE";
  object.prevAnimation = "none";

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

  // instantiate a listener
  object.audioListener = new THREE.AudioListener();
  object.camera.add( object.audioListener );


  // Mira
  object.aim = new THREE.Object3D();
  object.camera.attach(object.aim);
  object.aim.position.set(0,0,-60);

  // Camera RayCast
  object.ray = new CANNON.Ray();


  // Se añade el eje al jugador
  object.attach(object.cameraRotator);

  object.shoot = function()
  {
    object.gunFireParticle.visible = true;
    var cPos = object.camera.getWorldPosition();
    var aPos = object.aim.getWorldPosition();

    // instantiate audio object
    var shootSound = new THREE.Audio( object.audioListener );
    shootSound.setBuffer(soundsList[0]);
    shootSound.detune = (Math.random()*700)-350;
    //shootSound.play();

    if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(cPos.x,cPos.y,cPos.z),to:new CANNON.Vec3(aPos.x,aPos.y,aPos.z)}))
    {

      var hitPos = object.ray.result.hitPointWorld;
      var hitNormal = object.ray.result.hitNormalWorld;
      createBulletHole(hitPos.x,hitPos.y,hitPos.z,hitNormal.x,hitNormal.y,hitNormal.z,player.ray.result.body);
    }
    setTimeout(function(){ object.gunFireParticle.visible = false; }, 50);
  }

  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {
    // Copia coordenadas de Cannon.js a Three.js
    object.position.copy(object.collider.position);
    object.position.y -= 0.3;

    // Actualiza las animaciones
    object.mixer.update( timeStep );

    socket.emit("sendTransform",{
      anim:object.currentAnimation,
      x:object.collider.position.x,
      y:object.collider.position.y,
      z:object.collider.position.z,
      qx:object.rotation.x,
      qy:object.rotation.y,
      qz:object.rotation.z
    });

  }

  object.walkSoundLoop = function()
  {
    if(object.walking)
    {
      // instantiate audio object
      var stepSound = new THREE.Audio( object.audioListener );
      stepSound.setBuffer(soundsList[1]);
      stepSound.detune = (Math.random()*700)-350;
      //stepSound.play();
    }
    setTimeout(object.walkSoundLoop, 325);
  }

  object.walkSoundLoop();
  return object;
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
function createBulletHole(x,y,z,nx,ny,nz,body)
{
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
  var g = player.gunFireParticle.getWorldPosition();

  var impulse = new CANNON.Vec3(x-g.x,y-g.y,z-g.z);
  impulse.normalize();
  impulse = impulse.scale(2);
  parent.body.applyImpulse(impulse,worldPoint);

  setTimeout(function(){ scene.remove(parent);bulletHoles.shift() }, 10000);

}

// Actualiza las posiciones de los impactos
function updateBulletHoles()
{
  for(var i=0;i<bulletHoles.length;i++)
  {
    bulletHoles[i].position.copy(bulletHoles[i].body.position);
    bulletHoles[i].quaternion.copy(bulletHoles[i].body.quaternion);
  }
}
