/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: player.js
 **
 ** Descripción: Sección encargada del constructor
 ** del personaje principal.
 **
 *************************************/
var runAnims = ["RF","RR","RB","RL","RFL","RFR","RBR","RBL"];
var crouchAnims = ["CF","CR","CB","CL","CFL","CFR","CBR","CBL"];
var soundRange = 0.2;
// Genera al jugador principal
function createPlayer(team,status)
{
  // Se crea un objeto vacío (THREE)
  var object = new THREE.Object3D();

  // Almacena el equipo asignado por la sala
  object.team = team;

  // Asigna el estado del jugador
  object.status = status;

  // Indica la animación actual
  object.currentAnimation = "IDLE";

  // Almacena la animación anterior
  object.prevAnimation = "none";

  // Angulo límite vertical de cámara
  object.cameraAngleLimit = window.game.helpers.degToRad(80);

  // Si está tocando el suelo
  object.grounded = false;

  // Indica si está caminando
  object.walking = false;

  // Si es true, los modelos realizan un fade out de transparencia ( al morir )
  object.materialFadeOut = false;

  // Indica si el arma esta recargando
  object.ammoLocked = false;

  // Almacena la cantidad de munición
  object.ammo = 100;

  // Almacena la cantidad de vida
  object.health = 100;

  // Vectores que serán reutilizados múltiples veces (optimizar procesamiento)
  object.pos = new THREE.Vector3(0,0,0);
  object.gunPos = new THREE.Vector3(0,0,0);
  object.camPos = new THREE.Vector3(0,0,0);
  object.aimPos = new THREE.Vector3(0,0,0);
  object.spinePos = new THREE.Vector3(0,0,0);
  object.headPos = new THREE.Vector3(0,0,0);

  // Configura los modelos 3D
  object.setupModels = function()
  {
    // Obtiene el modelo de humano importado
    var model = modelsList[0];

    // Almacena el modelo
    object.model = model.scene.children[0];

    // Almacena las animaciones
    object.animations = model.animations;

    // Asigna el modelo al objeto 3D
    object.attach(object.model);

    // Activa la generación de sombras sobre otros objectos
    object.model.children[1].castShadow = true;

    // Recibe sombras
    object.model.children[1].receiveShadow = true;

    // Obtiene el material
    object.material = object.model.children[1].material;

    // Activa la transparencia
    object.material.transparent = true;
    object.material.side = THREE.FrontSide;

    // Obtiene el modelo del arma importado
    var weapon = modelsList[1];

    // Almacena el modelo
    object.weapon = weapon.scene;

    // Activa la generación de sombras sobre otros objectos
    object.weapon.children[0].castShadow = true;

    // Recibe sombras
    object.weapon.children[0].receiveShadow = true;

    // Ajusta color arma
    object.weapon.children[0].material.color = new THREE.Color(0.5,0.5,0.5);
    object.weapon.children[0].material.roughness = 1;

    // Ajusta el tamaño del arma
    object.weapon.scale.set(0.1,0.1,0.1);

    // Encuentra el bone de la mano derecha del humano
    var rightHandBone = object.getObjectByName("mixamorigRightHand");

    // Encuentra el bone de la espalda del humano ( usado para posicionar el collider de la espalda )
    object.spine = object.getObjectByName("mixamorigSpine");

    // Encuentra el bone de la cabeza del humano ( usado para posicionar el collider de la cabeza )
    object.head = object.getObjectByName("mixamorigHead");

    // Asigna el arma a la mano derecha del humano
    rightHandBone.attach(object.weapon);

    // Ajusta la posición del arma
    object.weapon.position.set(-0.08,0.36,-0.02);

    // Almacena el material del arma
    object.weaponMaterial = object.weapon.children[0].material;

    // Activa la transparencia
    object.weaponMaterial.transparent = true;
    object.weaponMaterial.side = THREE.FrontSide;

    // Se crea una partícula que simula el fuego de un disparo
    object.gunFireParticle = createGunFireParticle();

    // Se asigna la particula al arma
    object.weapon.attach(object.gunFireParticle);

    // Ajusta la posición de la partícula
    object.gunFireParticle.position.set(0.2,2,4);

    // Oculta la partícula
    object.gunFireParticle.visible = false;

    // Rota el modelo en 180 grados
    object.model.rotateY(Math.PI);
  }

  // Configura las animaciones
  object.setupAnimations = function()
  {
    // Crea y asigna un Animador (THREE)
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
  }

  // Configura los physics (Colliders)
  object.setupColliders = function()
  {
    var groundMaterial = new CANNON.Material({friction:0});

    // Se crean las geometrias del collider
    var legsShape = new CANNON.Sphere(0.3);
    var headShape = new CANNON.Sphere(0.15);
    var bodyShape = new CANNON.Box(new CANNON.Vec3(0.2,0.43,0.2));

    // Se crea el collider
    object.collider = new CANNON.Body({material:groundMaterial, mass: 1 });
    object.collider.angularDamping = 1;

    // Se le asigna identificadores
    object.collider.owner = "player";
    object.collider.class = "player";

    // Se añaden las geometrías al collider
    object.collider.addShape(legsShape, new CANNON.Vec3( 0, 0, 0));
    object.collider.addShape(bodyShape, new CANNON.Vec3( 0, 0.6, 0));
    object.collider.addShape(headShape, new CANNON.Vec3( 0, 1.2, 0));
  }

  // Configura la cámara
  object.setupCamera = function()
  {
    // Se crea la cámara
    object.camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // Se crea el eje de rotación de la cámara
    object.cameraRotator = new THREE.Object3D();
    object.cameraRotator.position = object.position;
    object.cameraRotator.position.y = object.position.y + 0.7;

    // Se añade el eje al jugador
    object.attach(object.cameraRotator);

    // Se añade la cámara al eje
    object.cameraRotator.attach(object.camera);
    object.camera.position = object.cameraRotator.position;
    object.camera.position.z = object.cameraRotator.position.z + 2.8;
    object.camera.lookAt(object.cameraRotator.position);
    object.camera.rotateX(0.4);
    object.camera.position.x = object.cameraRotator.position.x + 0.4;

    // Se crea un objeto que servirá como dirección de la mira
    object.aim = new THREE.Object3D();
    object.camera.attach(object.aim);
    object.aim.position.set(0,0,-60);

    // Se crea un ray para hacer cáculos con la mira
    object.ray = new CANNON.Ray();
    object.rayRes = new CANNON.RaycastResult();

  }

  // Configura el audio
  object.setupAudio = function()
  {
    // Se crea el audio listener
    object.audioListener = new THREE.AudioListener();
    object.camera.add( object.audioListener );
  }

  // Realiza las configuraciones
  object.setupModels();
  object.setupAnimations();
  object.setupColliders();
  object.setupCamera();
  object.setupAudio();

  // Retorna la posición del jugador
  object.getPos = function()
  {
    object.getWorldPosition(object.pos);
    return object.pos;
  }

  // Asigna la vida del jugador
  object.setHealth = function(value,username)
  {
    if(object.health > value && value > 0)
    {
      // Sonido de dolor
      var sound = new THREE.PositionalAudio( player.audioListener );
      object.model.add(sound);
      sound.setRefDistance(soundRange);
      sound.setVolume(settings.audio.fxsVolume);
      sound.setBuffer( soundsList[4 + Math.round(Math.random())] );
      sound.play();
      setTimeout(function(){ object.model.remove(sound); delete sound;}, 200);
    }
    // Actualiza el valor
    object.health = value;

    // Actualiza la barra de vida
    healthBar.css({"height":"calc("+value+"% - 4px)"});

    // Asigna el color de la barra de vida
    if(value > 20)
      healthBar.css({"background":"green"});
    else
      healthBar.css({"background":"red"});

    // Si se acaba la vida
    if(value <= 0)
    {
      // Sonido de muerte
      var sound = new THREE.PositionalAudio( player.audioListener );
      object.model.add(sound);
      sound.setRefDistance(soundRange);
      sound.setVolume(settings.audio.fxsVolume);
      sound.setBuffer( soundsList[6] );
      sound.play();
      setTimeout(function(){ object.model.remove(sound); delete sound;}, 200);

      // Notifica al servidor que ha sido asesinado
      socket.emit("userKilled",{userKilled:object.username,killedBy:username});

      // Asigna el mensaje de respawn en pantalla
      respawnTitle.html("Has sido asesinado por: <span class='B'>" + htmlEntities(username) + "</span>");

      // Detiene todas las animaciones
      object.mixer.stopAllAction();

      // Obtiene la animacion de muerte
      var anim = object.mixer.clipAction( player.clips.DIE );

      // Asigna que se reproduzca solo una vez
      anim.setLoop( THREE.LoopOnce );
      anim.clampWhenFinished = true;

      // Reproduce la animacion
      anim.play();

      // Cambia el estado del juego
      gameState = "dead";

      // Después de 3 segundos, se realiza el fadeout del personaje
      setTimeout(function()
      {
        if(gameState != "dead") return;

        // Desactiva las sombras
        object.model.children[1].castShadow = false;
        object.weapon.children[0].castShadow = false;

        // Comienza el fadeout
        player.materialFadeOut = true;

        // Muestra el menú de respawn
        respawnWindow.fadeIn(1000);
      }, 3000);

    }

  }

  // Simula un disparo del jugador
  object.shoot = function()
  {
    // Verifica que no esté recargando, y que se esté en modo juego
    if(object.ammoLocked || gameState != "playing") return;

    // Resta munición
    object.ammo -= 15;

    // Muestra la partícula de disparo
    object.gunFireParticle.visible = true;

    // Oculta la partícula después de 50 milisegundos
    setTimeout(function(){ object.gunFireParticle.visible = false; }, 50);

    // Obtiene la posición de la cámara y de la mira
    object.camera.getWorldPosition(object.camPos);
    object.aim.getWorldPosition(object.aimPos);

    var cPos = object.camPos;
    var aPos = object.aimPos;

    // Reproduce el sonido de disparo
    if(settings.audio.enabled)
    {
      var sound = new THREE.PositionalAudio( player.audioListener );
      object.model.add(sound);
      sound.setRefDistance(soundRange);
      // Cambia la afinación aleatoriamente para generar variación ( No funciona en Safari )
      sound.detune = (Math.random()*700)-350;
      sound.setVolume(settings.audio.fxsVolume);
      sound.setBuffer( soundsList[0] );
    	sound.play();
      setTimeout(function(){ object.model.remove(sound); delete sound;}, 200);
    }

    // Notifica al servidor que se ha disparado (Se envia la posición inicial y dirección)
    socket.emit("sendShoot",{cx:cPos.x,cy:cPos.y,cz:cPos.z,ax:aPos.x,ay:aPos.y,az:aPos.z});

    // Obtiene hit point desde el centro de la cámara hacia la mira
    if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(cPos.x,cPos.y,cPos.z),to:new CANNON.Vec3(aPos.x,aPos.y,aPos.z)}))
    {
      // Obtiene la posición de la punta del arma
      object.gunFireParticle.getWorldPosition(object.gunPos);
      var gunPos = object.gunPos;
      var hitPos = object.ray.result.hitPointWorld;

      // Extiende el límite del ray
      var hitPosExtended = new CANNON.Vec3(hitPos.x + hitPos.x - gunPos.x,hitPos.y + hitPos.y - gunPos.y,hitPos.z + hitPos.z - gunPos.z);

      // Obtiene hit point desde el arma hacía el hit point extendido anterior
      if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(gunPos.x,gunPos.y,gunPos.z),to:hitPosExtended}))
      {
        hitPos = object.ray.result.hitPointWorld;
        hitNormal = object.ray.result.hitNormalWorld;

        // Se añade un impacto de bala al primer collider intersectado
        createBulletHole(hitPos.x,hitPos.y,hitPos.z,hitNormal.x,hitNormal.y,hitNormal.z,object.ray.result.body,gunPos);
      }
    }
  }

  // Actualiza la munición
  object.updateAmmo = function()
  {
    // Si se acaba la munición
    if(object.ammo <= 0 && !object.ammoLocked)
    {
      // Corrige el límite inferior (0%)
      object.ammo = 0;

      // Impide nuevos disparos
      object.ammoLocked = true;

      // Cambia el color de la barra de munición a rojo
      ammoBar.css({"background":"red"});
    }

    // Si la munición es menor al 100%
    if(object.ammo < 100)
    {
      // Recarga la munición lentamente
      object.ammo += 0.5;

      // Si se alcanza el límite superior (100%)
      if(object.ammo >= 100 && object.ammoLocked)
      {
        // Corrige el límite superior (100%)
        object.ammo = 100;

        // Permite nuevos disparos
        object.ammoLocked = false;

        // Cambia el color de la barra de munición a verde
        ammoBar.css({"background":"green"});
      }

      // Actualiza la barra de munición
      ammoBar.css({"height":"calc("+object.ammo+"% - 4px)"});
    }
  }

  // Actualiza los physics (posición y colisiones)
  object.updatePhysics = function()
  {
    // Actualiza coordenadas de CANNON a THREE
    object.position.copy(object.collider.position);
    object.position.y -= 0.3;

    // Actualiza collider cabeza
    object.head.getWorldPosition(object.headPos);
    object.collider.shapeOffsets[2].set(
      object.headPos.x - object.collider.position.x,
      object.headPos.y - object.collider.position.y + 0.1,
      object.headPos.z - object.collider.position.z
    );

    // Actualiza el collider cuerpo
    object.spine.getWorldPosition(object.spinePos);
    object.collider.shapeOffsets[1].set(
      object.spinePos.x - object.collider.position.x,
      object.spinePos.y - object.collider.position.y,
      object.spinePos.z - object.collider.position.z
    );

    // Detecta el suelo (ray)
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

    object.ray.intersectBodies(groundColliders,object.rayRes);

    if(object.rayRes.hasHit)
      object.grounded = true;
    else
      object.grounded = false;

    // Reinicia el ray
    object.rayRes.reset();

    // Envía la animación, posicion y rotación actual al servidor
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

  // Se debe llamar en cada iteración
  object.updatePlayer = function()
  {
    // Actualiza los physics
    object.updatePhysics();

    // Actualiza la munición
    object.updateAmmo();

    // Actualiza las animaciones
    object.mixer.update( timeStep );

    // Animación de fadeout al morir
    if(object.materialFadeOut && object.material.opacity > 0)
    {
      object.material.opacity-=0.01;
      object.weaponMaterial.opacity-=0.01;
    }

  }

  // Respawn
  object.respawn = function()
  {
    object.setHealth(100,null);
    object.ammo = 100;
    object.model.children[1].castShadow = true;
    object.weapon.children[0].castShadow = true;
    object.materialFadeOut = false;
    object.material.opacity = 1;
    object.weaponMaterial.opacity = 1;
    gameState = "playing";
    respawnWindow.hide();

    if(object.team == "B")
    {
      object.collider.position.set(31,-1.4,-35);
    }
    else
    {
      object.collider.position.set(-45,-1.4,38);
    }

    socket.emit("respawn");
  }

  // Efecto de sonido al caminar
  object.walkSoundLoop = function()
  {
    var running = runAnims.includes(object.currentAnimation);
    // Verifica que el audio esté activo
    if(settings.audio.enabled)
    {
      // Si está caminando
      if(object.walking && object.grounded)
      {
        var sound = new THREE.PositionalAudio( player.audioListener );
        object.model.add(sound);
        sound.setRefDistance(soundRange);
        // Cambia la afinación aleatoriamente para generar variación ( No funciona en Safari )
        sound.detune = (Math.random()*700)-350;
        if(running)
          sound.setVolume(settings.audio.fxsVolume*0.8);
        else
          sound.setVolume(settings.audio.fxsVolume*0.6);

        sound.setBuffer( soundsList[1] );
      	sound.play();

        setTimeout(function(){ object.model.remove(sound); delete sound;}, 200);

      }
    }
    if(running)
      setTimeout(object.walkSoundLoop, 270);
    else
      setTimeout(object.walkSoundLoop, 570);
  }

  // Genera el loop de sonido al caminar
  object.walkSoundLoop();
  object.respawn();

  return object;
}
