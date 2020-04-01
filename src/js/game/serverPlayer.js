
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

  // Obtiene el material
  object.material = object.model.children[1].material;
  object.material.transparent = true;
  object.materialFadeOut = false;

  // Le asigna el arma al brazo
  var weapon = gun;
  object.weapon = weapon.scene;
  object.weapon.scale.set(0.1,0.1,0.1);
  var rightHandBone = object.getObjectByName("mixamorigRightHand");
  object.spine = object.getObjectByName("mixamorigSpine");
  object.head = object.getObjectByName("mixamorigHead");
  object.spinePos = new THREE.Vector3(0,0,0);
  object.headPos = new THREE.Vector3(0,0,0);
  rightHandBone.attach(object.weapon);
  object.weapon.position.set(0,0.27,0);
  object.weapon.rotateY(-0.03);

  // Obtiene el material
  object.weaponMaterial = object.weapon.children[0].material;
  object.weaponMaterial.transparent = true;
  object.materialFadeOut = false;

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
  object.clips.DIE = THREE.AnimationClip.findByName( object.animations, 'Die' );
  object.clips.CIDLE = THREE.AnimationClip.findByName( object.animations, 'Crouch Idle' );
  object.clips.DIE = THREE.AnimationClip.findByName( object.animations, 'Die' );
  object.clips.JUMP = THREE.AnimationClip.findByName( object.animations, 'Jump' );
  object.clips.FALLING = THREE.AnimationClip.findByName( object.animations, 'Falling' );
  object.clips.CF = THREE.AnimationClip.findByName( object.animations, 'Crouch F' );
  object.clips.CR = THREE.AnimationClip.findByName( object.animations, 'Crouch R' );
  object.clips.CB = THREE.AnimationClip.findByName( object.animations, 'Crouch B' );
  object.clips.CL = THREE.AnimationClip.findByName( object.animations, 'Crouch L' );
  object.clips.CFL = THREE.AnimationClip.findByName( object.animations, 'Crouch F L' );
  object.clips.CFR = THREE.AnimationClip.findByName( object.animations, 'Crouch F R' );
  object.clips.CBL = THREE.AnimationClip.findByName( object.animations, 'Crouch B L' );
  object.clips.CBR = THREE.AnimationClip.findByName( object.animations, 'Crouch B R' );


  object.currentAnimation = "RF";

  // Physics
  var legsShape = new CANNON.Sphere(0.3);
  var headShape = new CANNON.Sphere(0.15);
  var bodyShape = new CANNON.Box(new CANNON.Vec3(0.2,0.43,0.2));
  object.collider = new CANNON.Body({ mass: 1 });
  object.collider.angularDamping = 1;
  object.collider.class = "player";
  object.collider.addShape(legsShape, new CANNON.Vec3( 0, 0, 0));
  object.collider.addShape(bodyShape, new CANNON.Vec3( 0, 0.6, 0));
  object.collider.addShape(headShape, new CANNON.Vec3( 0, 1.2, 0));

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
      if(object.ray.result.body.hasOwnProperty("owner") && object.team != player.team )
      {
        if(gameState == "playing")
        {
          damageScreen.addClass("active").show();
          player.setHealth(player.health - 15,object.username);
          setTimeout(function(){ damageScreen.removeClass("active").hide();}, 200);
        }
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
    // Actualiza el letrero con nombre de usuario
    var textDist = object.getWorldPosition().distanceTo( player.camera.getWorldPosition());
    if(textDist >= 5 && textDist <= 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(textDist/3.5));
    else if(textDist < 5)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(5/3.5));
    else if(textDist > 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(10/3.5));


    // Actualiza posición de manera suave
    object.collider.position.lerp(object.targetPosition,0.5,object.collider.position);


    // Copia coordenadas de Cannon.js a Three.js
    object.position.copy(object.collider.position);
    object.position.y -= 0.3;

    // Actualiza collider cabeza
    object.head.getWorldPosition(object.headPos);
    object.collider.shapeOffsets[2].set(
      object.headPos.x - object.collider.position.x,
      object.headPos.y - object.collider.position.y + 0.1,
      object.headPos.z - object.collider.position.z
    )

    // Actualiza el collider cuerpo
    object.spine.getWorldPosition(object.spinePos);
    object.collider.shapeOffsets[1].set(
      object.spinePos.x - object.collider.position.x,
      object.spinePos.y - object.collider.position.y,
      object.spinePos.z - object.collider.position.z
    )

    // Fade out al morir
    if(object.materialFadeOut && object.material.opacity > 0)
    {
      object.usernameText.material.opacity-=0.01;
      object.material.opacity-=0.01;
      object.weaponMaterial.opacity-=0.01;
    }

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
