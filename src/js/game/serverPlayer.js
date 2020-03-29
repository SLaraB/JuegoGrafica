
function createServerPlayer(username,status,team,human,gun)
{
  var mesh;
  // Se crea un objeto vacío
  var object = new THREE.Object3D();

  object.username = username;
  object.status = status;
  object.team = team;

  // Se le asigna el modelo importado
  var model =  human;
  object.model = model.scene.children[0];
  object.animations = model.animations;
  object.attach(object.model);
  object.model.children[1].castShadow = true;

  // Le asigna el arma al brazo
  var weapon = gun;
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
  object.walking = true;

  if(team == player.team)
    object.usernameText = makeTextSprite( username ,{r:122,g:201,b:67,a:1});
  else
    object.usernameText = makeTextSprite( username ,{r:248,g:37,b:37,a:1});

  object.usernameText.baseSize = new THREE.Vector3(object.usernameText.scale.x,object.usernameText.scale.y,1);
  object.usernameText.position.set(object.position.x,object.position.y+2,object.position.z);

  object.add(object.usernameText);

  object.targetPosition = new CANNON.Vec3(0,0,0);

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

  object.currentAnimation = "RF";

  // Physics
  var shape = new CANNON.Sphere(0.3);
  object.collider = new CANNON.Body({ mass: 1 });
  object.collider.angularDamping = 1;
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 0.6, 0));
  object.collider.addShape(shape, new CANNON.Vec3( 0, 1.2, 0));

  // Camera RayCast
  object.ray = new CANNON.Ray();


  object.shoot = function(msg)
  {
    object.gunFireParticle.visible = true;

    // instantiate audio object
    /*
    var shootSound = new THREE.Audio( object.audioListener );
    shootSound.setBuffer(soundsList[0]);
    shootSound.detune = (Math.random()*700)-350;
    */
    //shootSound.play();

    if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(msg.cx,msg.cy,msg.cz),to:new CANNON.Vec3(msg.ax,msg.ay,msg.az)}))
    {
      // Si acierta al jugador principal
      if(object.ray.result.body.hasOwnProperty("owner"))
      {
        damageScreen.addClass("active").show();
        setTimeout(function(){ damageScreen.removeClass("active").hide();}, 200);
      }
      var hitPos = object.ray.result.hitPointWorld;
      var hitNormal = object.ray.result.hitNormalWorld;
      createBulletHole(hitPos.x,hitPos.y,hitPos.z,hitNormal.x,hitNormal.y,hitNormal.z,object.ray.result.body,new CANNON.Vec3(msg.cx,msg.cy,msg.cz));
    }
    setTimeout(function(){ object.gunFireParticle.visible = false; }, 50);
  }

  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {
    var textDist = object.getWorldPosition().distanceTo( player.camera.getWorldPosition());
    if(textDist >= 5 && textDist <= 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(textDist/3.5));
    else if(textDist < 5)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(5/3.5));
    else if(textDist > 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(10/3.5));

    object.collider.position.lerp(object.targetPosition,0.5,object.collider.position);
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
