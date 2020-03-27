
function createServerPlayer(username,status,team)
{
  var mesh;
  // Se crea un objeto vacío
  var object = new THREE.Object3D();

  object.username = username;
  object.status = status;
  object.team = team;

  // Se le asigna el modelo importado
  var model =  modelsList[2];
  object.model = model.scene.children[0];
  object.animations = model.animations;
  object.attach(object.model);
  object.model.children[1].castShadow = true;

  // Le asigna el arma al brazo
  var weapon = modelsList[3];
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

  // Physics
  var shape = new CANNON.Sphere(0.3);
  object.collider = new CANNON.Body({ mass: 1 });
  object.collider.angularDamping = 1;
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0.6, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 1.2, 0));


  /*
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
  */
  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {
    // Copia coordenadas de Cannon.js a Three.js
    object.position.copy(object.collider.position);
    object.position.y -= 0.3;

    // Actualiza las animaciones
    object.mixer.update( timeStep );

  }

  /*
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
  */

  //object.walkSoundLoop();
  return object;
}
