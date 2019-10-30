// Paths globales
const modelsPath = "models/";
const texturesPath = "textures/";
const soundsPath = "sounds/";

// Almacena los datos cargados
var modelsList = [];
var texturesList = [];
var soundsList = [];

// Indica si se han terminado de cargar
var allModelsLoaded = false;
var allTexturesLoaded = true;
var allSoundsLoaded = true;

// Lista de archivos a cargar
const modelsPathList = ["characters/player.glb"];

// Cargador de modelos .glb
var modelLoader = new THREE.GLTFLoader();

// Carga un modelo .glb
function loadModel(url,callback)
{
  console.log("Cargando modelo: " + url);

  // Load a glTF resource
  modelLoader.load( modelsPath + url,

  	function ( gltf )
    {
      gltf.id = url;
      modelsList.push(gltf);
      if(modelsList.length == modelsPathList.length)
      {
        allModelsLoaded = true;
        callback();
      }
  	},
    function ( xlr )
    {

  	},
  	function ( error )
    {
      console.log(error);
  		alert( 'Ha ocurrido un error al cargar los datos.' );
  	}
  );
}

// Cuando se termina de cargar todo
var loaderCallback = function()
{
  if(allModelsLoaded && allTexturesLoaded && allSoundsLoaded)
    init(); // Inicializa los componentes del juego
}

function loadGameAssets()
{
  // Todos los modelos
  for(var i = 0; i < modelsPathList.length; i++)
    loadModel(modelsPathList[i],loaderCallback);
}
