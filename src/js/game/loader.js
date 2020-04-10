// Paths globales
const modelsPath = "models/";
const texturesPath = "textures/";
const soundsPath = "sounds/";

// Almacena los datos cargados
var modelsList = [];
var texturesList = [];
var soundsList = [];

// Paths de modelos
const modelsPathList = ["characters/player.glb","weapons/G36C.glb"];

// Paths de texturas
const texturesPathList = [
  "weapons/gunFire.jpg",
  "ground/whiteGround.jpg",
  "weapons/bulletHole.png",
  "stuff/woodenBox.jpg",
  "skyboxes/Sunny/xpos.jpg",
  "skyboxes/Sunny/xneg.jpg",
  "skyboxes/Sunny/ypos.jpg",
  "skyboxes/Sunny/yneg.jpg",
  "skyboxes/Sunny/zpos.jpg",
  "skyboxes/Sunny/zneg.jpg"
];

// Paths de sonidos
const soundsPathList = ["FX/Shoot.mp3","FX/Step.mp3"];


// Activa el cache
THREE.Cache.enabled = true;

// Cargador de modelos .glb
const modelLoader = new THREE.GLTFLoader();

// Lector de texturas
const textureLoader = new THREE.TextureLoader();

// Lector de archivos de audio
const soundLoader = new THREE.AudioLoader();


// Carga los modelos .glb
function loadModels()
{
  // Actualiza la barra de porcentaje
  loadBarPercent();

  // Obtiene el URL del asset actual a cargar
  var url = modelsPathList[modelsList.length];

  // Indica en pantalla que asset se está cargando
  loadInfo.html("Cargando modelo: " + url);

  // Comienza la carga del asset
  modelLoader.load( modelsPath + url,

    // Si el asset se carga exitósamente
  	function ( gltf )
    {
      // Almacenta el asset
      modelsList.push(gltf);

      // Si aún quedan assets por cargar
      if(modelsList.length == modelsPathList.length)
        loadTextures();
      else
        loadModels();
  	},

    // Retorna el procentaje de descarga
    function (x){},

    // Si ocurre un error
  	function ( error )
    {
      console.log(error);
  	}
  );
}

// Carga las texturas
function loadTextures()
{
  // Actualiza la barra de porcentaje
  loadBarPercent();

  // Obtiene el URL del asset actual a cargar
  var url = texturesPathList[texturesList.length];

  // Indica en pantalla que asset se está cargando
  loadInfo.html("Cargando textura: " + url);

  // Comienza la carga del asset
  textureLoader.load( texturesPath + url,

    // Si el asset se carga exitósamente
    function ( texture )
    {
      // Almacenta el asset
      texturesList.push(texture);

      // Si aún quedan assets por cargar
      if(texturesList.length == texturesPathList.length)
        loadSounds();
      else
        loadTextures();
    },

    // Retorna el procentaje de descarga
    function (x){},

    // Si ocurre un error
  	function ( error )
    {
      console.log(error);
  	}
  );
}

// Carga los archivos de audio
function loadSounds()
{
  // Actualiza la barra de porcentaje
  loadBarPercent();

  // Obtiene el URL del asset actual a cargar
  var url = soundsPathList[soundsList.length];

  // Indica en pantalla que asset se está cargando
  loadInfo.html("Cargando sonido: " + url);

  // Comienza la carga del asset
  soundLoader.load( soundsPath + url,

    // Si el asset se carga exitósamente
    function ( sound )
    {
      // Almacenta el asset
      soundsList.push(sound);

      // Si aún quedan assets por cargar
      if(soundsList.length == soundsPathList.length)
      {
        // Muestra el menu principal
        loadMenu.hide();
        setUsernameInput.show();
        setUsernameBtn.show();
      }
      else
        loadSounds();
    },

    // Retorna el procentaje de descarga
    function (x){},

    // Si ocurre un error
  	function ( error )
    {
      console.log(error);
  	}
  );
}

// Actualiza la barra de carga
function loadBarPercent()
{
  // Suma de todos los assets a cargar
  var allItems = modelsPathList.length + texturesPathList.length + soundsPathList.length;

  // Suma de los assets cargados
  var completed = modelsList.length + texturesList.length + soundsList.length;

  // Obtiene el procentaje completado
  var percent = (100*completed)/allItems;

  // Lo muestra en pantalla
  loadBar.css({width:percent+"%"});
}
