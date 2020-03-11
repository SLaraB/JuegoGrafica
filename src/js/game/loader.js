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
const modelsPathList = ["characters/player.glb","weapons/G36C.glb"];

// Cargador de modelos .glb
var modelLoader = new THREE.GLTFLoader();

// Carga los modelos .glb uno a uno
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
      {
        allModelsLoaded = true;
        loaderCallback();
      }
      else {
        loadModels();
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
function loaderCallback()
{
  if(allModelsLoaded && allTexturesLoaded && allSoundsLoaded)
    init(); // Inicializa los componentes del juego
}
