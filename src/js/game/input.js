var input = {keys:{up:false,right:false,down:false,left:false,shift:false,space:false}};
var keysReleased = true;
function onKeyDown(event)
{
    if(gameState != "playing") return;

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
  if(gameState != "playing") return;

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
    player.currentAnimation = "RFR";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/4);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.down && input.keys.left)
  {
    player.currentAnimation = "RBL";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/4);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.up && input.keys.left)
  {
    player.currentAnimation = "RFL";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.down && input.keys.right)
  {
    player.currentAnimation = "RBR";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.up)
  {
    player.currentAnimation = "RF";
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.down)
  {
    player.currentAnimation = "RB";
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.right)
  {
    player.currentAnimation = "RR";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    player.collider.velocity.z = dir.z*runSpeed;
    player.collider.velocity.x = dir.x*runSpeed;
    player.walking = true;
  }
  else if(input.keys.left)
  {
    player.currentAnimation = "RL";
    dir = dir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    player.collider.velocity.z = -dir.z*runSpeed;
    player.collider.velocity.x = -dir.x*runSpeed;
    player.walking = true;
  }
  else
  {
    player.currentAnimation = "IDLE";
    player.collider.velocity.z = 0;
    player.collider.velocity.x = 0;
    player.walking = false;
  }

  if(player.currentAnimation != player.prevAnimation)
  {
    player.mixer.stopAllAction();
    player.prevAnimation = player.currentAnimation;
    player.mixer.clipAction( player.clips[player.currentAnimation] ).play();
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

var onDocumentMouseDown = function( event )
{
  if(gameState != "playing") return;
  player.shoot();

}

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
