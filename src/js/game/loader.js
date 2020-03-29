// Paths globales
const modelsPath = "models/";
const texturesPath = "textures/";
const soundsPath = "sounds/";
const fontsPath = "fonts/";

// Almacena los datos cargados
var modelsList = [];
var texturesList = [];
var soundsList = [];
var fontsList = [];

// Paths de modelos
const modelsPathList = ["characters/player.glb","weapons/G36C.glb"];

// Paths de texturas
const texturesPathList = ["weapons/gunFire.jpg","ground/whiteGround.jpg","weapons/bulletHole.png","stuff/woodenBox.jpg"];

// Paths de sonidos
const soundsPathList = ["FX/Shoot.mp3","FX/Step.mp3"];

// Paths de fuentes de texto
const fontsPathList = ["gameFont.json"];

// Activa el cache
THREE.Cache.enabled = true;

// Cargador de modelos .glb
const modelLoader = new THREE.GLTFLoader();

// Lector de texturas
const textureLoader = new THREE.TextureLoader();

// Lector de archivos de audio
const soundLoader = new THREE.AudioLoader();

// Lector de fuentes
const fontLoader = new THREE.FontLoader();

// Carga los modelos .glb
function loadModels()
{
  loadBarPercent();
  var url = modelsPathList[modelsList.length];

  loadInfo.html("Cargando modelo: " + url);

  // Load a glTF resource
  modelLoader.load( modelsPath + url,

  	function ( gltf )
    {
      modelsList.push(gltf);
      if(modelsList.length == modelsPathList.length)
        loadTextures();
      else
        loadModels();
  	},
    function (x)
    {

    },
  	function ( error )
    {
      console.log(error);
  	}
  );
}

// Carga las texturas
function loadTextures()
{
  loadBarPercent();
  var url = texturesPathList[texturesList.length];

  loadInfo.html("Cargando textura: " + url);

  // Textura del suelo
  textureLoader.load( texturesPath + url,

    function ( texture )
    {
      texturesList.push(texture);
      if(texturesList.length == texturesPathList.length)
        loadSounds();
      else
        loadTextures();
    },
    function (x)
    {

    },
  	function ( error )
    {
      console.log(error);
  	}
  );
}

// Carga los archivos de audio
function loadSounds()
{
  loadBarPercent();
  var url = soundsPathList[soundsList.length];

  loadInfo.html("Cargando sonido: " + url);

  // Textura del suelo
  soundLoader.load( soundsPath + url,

    function ( sound )
    {
      soundsList.push(sound);
      if(soundsList.length == soundsPathList.length)
        loadFonts();
      else
        loadSounds();
    },
    function (x)
    {

    },
  	function ( error )
    {
      console.log(error);
  	}
  );
}
// Carga los archivos de audio
function loadFonts()
{
  loadBarPercent();
  var url = fontsPathList[fontsList.length];

  loadInfo.html("Cargando fuente: " + url);

  // Textura del suelo
  fontLoader.load( fontsPath + url,

    function ( font )
    {
      fontsList.push(font);
      if(fontsList.length == fontsPathList.length)
      {
        loadMenu.hide();
        setUsernameInput.show();
        setUsernameBtn.show();
      }
      else
        loadFonts();
    },
    function (x)
    {

    },
  	function ( error )
    {
      console.log(error);
  	}
  );
}

function loadBarPercent()
{
  var allItems = modelsPathList.length + texturesPathList.length + soundsPathList.length + fontsPathList.length;
  var completed = modelsList.length + texturesList.length + soundsList.length + fontsList.length;
  var percent = (100*completed)/allItems;
  loadBar.css({width:percent+"%"});
}
