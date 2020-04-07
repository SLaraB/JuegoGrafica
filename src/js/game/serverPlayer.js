/**************************************
 **
 ** Austral Tournament - 2020
 ** Autor: Eduardo Hopperdietzel
 ** Archivo: serverPlayer.js
 **
 ** Descripción: Sección encargada del constructor
 ** de jugadores del servidor.
 **
 *************************************/

function createServerPlayer(username,status,team,human,gun)
{
  // Se crea un objeto vacío (THREE)
  var object = new THREE.Object3D();

  // Asigna el nombre de usuario
  object.username = username;

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

  // Ray para simular disparos
  object.ray = new CANNON.Ray();

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
  object.targetPosition = new CANNON.Vec3(0,0,0);

  // Configura los modelos 3D
  object.setupModels = function()
  {
    // Obtiene el modelo de humano importado
    var model =  human;

    // Almacena el modelo
    object.model = model.scene.children[0];

    // Almacena las animaciones
    object.animations = model.animations;

    // Asigna el modelo al objeto 3D
    object.attach(object.model);

    // Activa la generación de sombras sobre otros objectos
    object.model.children[1].castShadow = true;

    // Obtiene el material
    object.material = object.model.children[1].material;

    // Activa la transparencia
    object.material.transparent = true;

    // Obtiene el modelo del arma importado
    var weapon = gun;

    // Almacena el modelo
    object.weapon = weapon.scene;

    // Activa la generación de sombras sobre otros objectos
    object.weapon.children[0].castShadow = true;

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

  // Configura el "letrero" con el nombre de usuario
  object.setupUsernameText = function()
  {
    // Asigna el letrero de nombre de usuario y color dependiendo del equipo
    if(team == player.team)
      object.usernameText = makeTextSprite( username ,{r:122,g:201,b:67,a:1});
    else
      object.usernameText = makeTextSprite( username ,{r:248,g:37,b:37,a:1});

    // Ajusta el tamaño del letrero
    object.usernameText.baseSize = new THREE.Vector3(object.usernameText.scale.x,object.usernameText.scale.y,1);
    object.usernameText.position.set(object.position.x,object.position.y+2,object.position.z);

    // Asigna el letrero al personaje
    object.add(object.usernameText);
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
    // Se crean las geometrias del collider
    var legsShape = new CANNON.Sphere(0.3);
    var headShape = new CANNON.Sphere(0.15);
    var bodyShape = new CANNON.Box(new CANNON.Vec3(0.2,0.43,0.2));

    // Se crea el collider
    object.collider = new CANNON.Body({ mass: 1 });
    object.collider.angularDamping = 1;

    // Se le asigna identificadores
    object.collider.class = "player";

    // Se añaden las geometrías al collider
    object.collider.addShape(legsShape, new CANNON.Vec3( 0, 0, 0));
    object.collider.addShape(bodyShape, new CANNON.Vec3( 0, 0.6, 0));
    object.collider.addShape(headShape, new CANNON.Vec3( 0, 1.2, 0));
  }

  // Simula un disparo del jugador
  object.shoot = function(msg)
  {
    // Muestra la partícula de disparo
    object.gunFireParticle.visible = true;

    // Oculta la partícula después de 50 milisegundos
    setTimeout(function(){ object.gunFireParticle.visible = false; }, 50);

    // Ray con las coordenadas recibidas del servidor
    if(object.ray.intersectWorld(physics,{mode:CANNON.Ray.CLOSEST,from:new CANNON.Vec3(msg.cx,msg.cy,msg.cz),to:new CANNON.Vec3(msg.ax,msg.ay,msg.az)}))
    {
      // Si acierta al jugador principal
      if(object.ray.result.body.hasOwnProperty("owner") && object.team != player.team )
      {
        // Si se está en modo juego
        if(gameState == "playing")
        {
          // Muestra la animación de "daño" en pantalla
          damageScreen.addClass("active").show();

          // Oculta la animación de daño despues de 200 milisegundos
          setTimeout(function(){ damageScreen.removeClass("active").hide();}, 200);

          // Resta vida al jugador principal
          player.setHealth(player.health - 15,object.username);
        }
      }

      var hitPos = object.ray.result.hitPointWorld;
      var hitNormal = object.ray.result.hitNormalWorld;

      // Se añade un impacto de bala al primer collider intersectado
      createBulletHole(hitPos.x,hitPos.y,hitPos.z,hitNormal.x,hitNormal.y,hitNormal.z,object.ray.result.body,new CANNON.Vec3(msg.cx,msg.cy,msg.cz));
    }

  }

  // Realiza las configuraciones
  object.setupModels();
  object.setupUsernameText();
  object.setupAnimations();
  object.setupColliders();

  // Actualiza el "letrero" con el nombre de usuario
  object.updateUsernameText = function()
  {
    // Actualiza el letrero con nombre de usuario
    var textDist = object.getWorldPosition().distanceTo( player.camera.getWorldPosition());
    if(textDist >= 5 && textDist <= 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(textDist/3.5));
    else if(textDist < 5)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(5/3.5));
    else if(textDist > 10)
      object.usernameText.scale.copy(object.usernameText.baseSize.clone().multiplyScalar(10/3.5));
  }

  // Actualiza los physics
  object.updatePhysics = function()
  {
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

  }

  // Se llama constantemente desde el loop principal
  object.updatePlayer = function()
  {
    // Actualiza el "letrero" con el nombre de usuario
    object.updateUsernameText();

    // Actualiza los physics
    object.updatePhysics();

    // Actualiza las animaciones
    object.mixer.update( timeStep );

    // Animación de fadeout al morir
    if(object.materialFadeOut && object.material.opacity > 0)
    {
      object.usernameText.material.opacity-=0.01;
      object.material.opacity-=0.01;
      object.weaponMaterial.opacity-=0.01;
    }

  }


  return object;
}

// Crea un nuevo jugador de servidor
function loadNewPlayer(item)
{
  // Genera un nuevo modelo de humano
  modelLoader.load( modelsPath + modelsPathList[0],

    function ( human )
    {
      // Genera un nuevo modelo de arma
      modelLoader.load( modelsPath + modelsPathList[1],

        function ( gun )
        {
          // Crea al jugador
          var newPlayer = createServerPlayer(item.username,item.status,item.team,human,gun);

          // Lo añade al objeto de jugadores utilizando su username como key
          serverPlayers[item.username] = newPlayer;

          // Lo añade a la escena visual (THREE)
          scene.add( newPlayer );

          // Añade sus physics a (CANNON)
          physics.add( newPlayer.collider );
        }
      );
    }
  );
}
