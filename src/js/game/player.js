
function createPlayer(team,status)
{
  var mesh;
  // Se crea un objeto vacío
  var object = new THREE.Object3D();
  object.team = team;
  object.status = status;

  // Si está tocando el suelo
  object.grounded = false;

  // Se le asigna el modelo importado
  var model = modelsList[0];
  object.model = model.scene.children[0];
  object.animations = model.animations;
  object.attach(object.model);
  object.model.children[1].castShadow = true;

  // Obtiene el material
  object.material = object.model.children[1].material;
  object.material.transparent = true;
  object.materialFadeOut = false;

  // Le asigna el arma al brazo
  var weapon = modelsList[1];
  object.weapon = weapon.scene;
  object.weapon.children[0].castShadow = true;
  object.weapon.scale.set(0.1,0.1,0.1);
  var rightHandBone = object.getObjectByName("mixamorigRightHand");
  object.spine = object.getObjectByName("mixamorigSpine");
  object.head = object.getObjectByName("mixamorigHead");
  object.spinePos = new THREE.Vector3(0,0,0);
  object.headPos = new THREE.Vector3(0,0,0);
  rightHandBone.attach(object.weapon);
  object.weapon.position.set(-0.08,0.36,-0.02);


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

  // Indicador
  object.walking = false;

  object.ammo = 100;
  object.ammoLocked = false;

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

  object.currentAnimation = "IDLE";
  object.prevAnimation = "none";

  // Physics
  var legsShape = new CANNON.Sphere(0.3);
  var headShape = new CANNON.Sphere(0.15);
  var bodyShape = new CANNON.Box(new CANNON.Vec3(0.2,0.43,0.2));
  object.collider = new CANNON.Body({ mass: 1 });
  object.collider.angularDamping = 1;
  object.collider.owner = "player";
  object.collider.class = "player";
  object.collider.addShape(legsShape, new CANNON.Vec3( 0, 0, 0));
  object.collider.addShape(bodyShape, new CANNON.Vec3( 0, 0.6, 0));
  object.collider.addShape(headShape, new CANNON.Vec3( 0, 1.2, 0));


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
  object.rayRes = new CANNON.RaycastResult();


  // Se añade el eje al jugador
  object.attach(object.cameraRotator);
  object.health = 100;
  object.pos = new THREE.Vector3(0,0,0);
  object.gunPos = new THREE.Vector3(0,0,0);
  object.camPos = new THREE.Vector3(0,0,0);
  object.aimPos = new THREE.Vector3(0,0,0);

  object.getPos = function()
  {
    object.getWorldPosition(object.pos);
    return object.pos;
  }

  object.setHealth = function(value,username)
  {
    object.health = value;

    healthBar.css({"height":"calc("+value+"% - 4px)"});

    if(value > 20)
    {
      healthBar.css({"background":"green"});
    }
    else {
      healthBar.css({"background":"red"});
    }

    if(value <= 0)
    {
      socket.emit("userKilled",{userKilled:object.username,killedBy:username});
      object.mixer.stopAllAction();
      var anim = object.mixer.clipAction( player.clips.DIE );
      anim.setLoop( THREE.LoopOnce );
      anim.clampWhenFinished = true;
      anim.play();
      setTimeout(function()
      {
        object.model.children[1].castShadow = false;
        object.weapon.children[0].castShadow = false;
        player.materialFadeOut = true;
      }, 3000);
      gameState = "dead";
    }

  }

  object.shoot = function()
  {
    if(object.ammoLocked || gameState != "playing") return;

    object.ammo -= 15;
    object.gunFireParticle.visible = true;
    object.camera.getWorldPosition(object.camPos);
    object.aim.getWorldPosition(object.aimPos);

    var cPos = object.camPos;
    var aPos = object.aimPos;

    if(settings.sound)
    {
      // instantiate audio object
      var shootSound = new THREE.Audio( object.audioListener );
      shootSound.setBuffer(soundsList[0]);
      shootSound.detune = (Math.random()*700)-350;
      shootSound.play();
    }


    socket.emit("sendShoot",{cx:cPos.x,cy:cPos.y,cz:cPos.z,ax:aPos.x,ay:aPos.y,az:aPos.z});

    // Obtiene hit point desde la camara
    if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(cPos.x,cPos.y,cPos.z),to:new CANNON.Vec3(aPos.x,aPos.y,aPos.z)}))
    {
      object.gunFireParticle.getWorldPosition(object.gunPos);
      var gunPos = object.gunPos;
      var hitPos = object.ray.result.hitPointWorld;
      var hitPosExtended = new CANNON.Vec3(hitPos.x + hitPos.x - gunPos.x,hitPos.y + hitPos.y - gunPos.y,hitPos.z + hitPos.z - gunPos.z);

      // Obtiene hit point desde el arma
      if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(gunPos.x,gunPos.y,gunPos.z),to:hitPosExtended}))
      {
        hitPos = object.ray.result.hitPointWorld;
        hitNormal = object.ray.result.hitNormalWorld;

        createBulletHole(hitPos.x,hitPos.y,hitPos.z,hitNormal.x,hitNormal.y,hitNormal.z,object.ray.result.body,gunPos);
      }
    }
    setTimeout(function(){ object.gunFireParticle.visible = false; }, 50);
  }

  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {

    // Actualiza la munición
    if(object.ammo <= 0 && !object.ammoLocked)
    {
      object.ammo = 0;
      object.ammoLocked = true;
      ammoBar.css({"background":"red"});
    }

    if(object.ammo < 100)
    {
      object.ammo += 0.5;

      if(object.ammo >= 100 && object.ammoLocked)
      {
        object.ammo = 100;
        object.ammoLocked = false;
        ammoBar.css({"background":"green"});
      }

      ammoBar.css({"height":"calc("+object.ammo+"% - 4px)"});
    }


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

    // Fadeout de material al morir
    if(object.materialFadeOut && object.material.opacity > 0)
    {
      object.material.opacity-=0.01;
      object.weaponMaterial.opacity-=0.01;
    }

    // Detecta el suelo
    object.ray.from = new CANNON.Vec3(
      object.collider.position.x,
      object.collider.position.y + 0.5,
      object.collider.position.z
    );

    object.ray.to = new CANNON.Vec3(
      object.collider.position.x,
      object.collider.position.y - 0.4,
      object.collider.position.z
    );
    object.rayRes.reset();
    object.ray.intersectBodies(groundColliders,object.rayRes);

    if(object.rayRes.hasHit)
    {
      object.grounded = true;
    }
    else
    {
      object.grounded = false;
    }

    // Actualiza las animaciones
    object.mixer.update( timeStep );

    // Envía la posicion y rotación al servidor
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
    if(!settings.sound)return;

    if(object.walking)
    {
      // instantiate audio object
      var stepSound = new THREE.Audio( object.audioListener );
      stepSound.setBuffer(soundsList[1]);
      stepSound.detune = (Math.random()*700)-350;
      stepSound.play();
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

// Actualiza las posiciones de los impactos
function updateBulletHoles()
{
  for(var i=0;i<bulletHoles.length;i++)
  {
    bulletHoles[i].position.copy(bulletHoles[i].body.position);
    bulletHoles[i].quaternion.copy(bulletHoles[i].body.quaternion);
  }
}
