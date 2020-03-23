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
const texturesPathList = ["weapons/gunFire.jpg","ground/cobblestone.png"];

// Cargador de modelos .glb
var modelLoader = new THREE.GLTFLoader();

// Lector de texturas
const textureLoader = new THREE.TextureLoader();

// Carga los modelos .glb
function loadModels()
{
  var url = modelsPathList[modelsList.length];

  console.log("Cargando modelo: " + url);

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
  var url = texturesPathList[texturesList.length];

  console.log("Cargando textura: " + url);

  // Textura del suelo
  textureLoader.load( texturesPath + url,

    function ( texture )
    {
      texturesList.push(texture);
      if(texturesList.length == texturesPathList.length)
        init(); // Inicializa los componentes del juego
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
