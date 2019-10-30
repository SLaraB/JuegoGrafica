var input = {keys:{up:false,right:false,down:false,left:false,shift:false,space:false}};
var keysReleased = true;
function onKeyDown(event)
{
    if(keysReleased)
    {
      player.mixer.stopAllAction();
      keysReleased = false;
    }
    switch (event.which)
    {
      case 87: // W
        input.keys.up = true;
        break;
      case 68: // D
        input.keys.right = true;
        break;
      case 83: // S
        input.keys.down = true;
        break;
      case 65: // A
        input.keys.left = true;
        break;
      case 16: // Shift
        input.keys.shift = true;
        break;
      case 32: // Space
        input.keys.space = true;
        break;
    }
};

function onKeyUp(event)
{
    keysReleased = true;
    player.mixer.stopAllAction();
    switch (event.which)
    {
      case 87: // W
        input.keys.up = false;
        break;
      case 68: // D
        input.keys.right = false;
        break;
      case 83: // S
        input.keys.down = false;
        break;
      case 65: // A
        input.keys.left = false;
        break;
      case 16: // Shift
        input.keys.shift = false;
        break;
      case 32: // Space
        input.keys.space = false;
        break;
    }
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

var dir = new THREE.Vector3(0,0,0);
var runSpeed = 10;
function inputEvents()
{
  player.getWorldDirection(dir);
  if(input.keys.up && input.keys.right)
  {
    player.mixer.clipAction( player.clips.RFR ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/4);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
  }
  else if(input.keys.down && input.keys.left)
  {
    player.mixer.clipAction( player.clips.RBL ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/4);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
  }
  else if(input.keys.up && input.keys.left)
  {
    player.mixer.clipAction( player.clips.RFL ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
  }
  else if(input.keys.down && input.keys.right)
  {
    player.mixer.clipAction( player.clips.RBR ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
  }
  else if(input.keys.up)
  {
    player.mixer.clipAction( player.clips.RF ).play();
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
  }
  else if(input.keys.down)
  {
    player.mixer.clipAction( player.clips.RB ).play();
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
  }
  else if(input.keys.right)
  {
    player.mixer.clipAction( player.clips.RR ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
  }
  else if(input.keys.left)
  {
    player.mixer.clipAction( player.clips.RL ).play();
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
  }
  else
  {
    player.mixer.clipAction( player.clips.IDLE ).play();
    player.collider.velocity.z = 0;
    player.collider.velocity.x = 0;
  }
}

var v1 = new THREE.Vector3(); // create once and reuse it

var onDocumentMouseMove = function( event )
{
  if(gameState != "playing") return;
	player.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-event.movementX/100);

	var angleCheck = player.cameraRotator.clone().rotateX(-event.movementY/100);
	var xRot = v1.copy( angleCheck.up ).applyQuaternion( angleCheck.quaternion ).angleTo(angleCheck.up);
	angleCheck.remove(angleCheck);



	if(xRot <= player.cameraAngleLimit )
	{
		player.cameraRotator.rotateX(-event.movementY/100);
	}

}

document.addEventListener('mousemove', onDocumentMouseMove, false);
