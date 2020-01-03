var InputManager = function(canvasName)
{
	this.canvasName = canvasName;
	this.mouseUp = [0, 1, 2];
	this.mouseDown = [0, 1, 2];

	this.keyUp = {};
	this.keyDown = {};

	this.mousePos = [0, 0];
	this.mousePosOffset = [0, 0, 0];
	this.mouseWheel = [0, 0, 0]
	this.mouseMoved = false;
	this.firstMouse = true;
	this.mousePosNDC = [0, 0];

	this.addKeyboardKey = function(key)
	{
		this.keyUp[key] = false;
		this.keyDown[key] = false;
	}

	this.isKeyUp = function(name)
	{
		var state = this.keyUp[name];

		this.keyUp[name] = false;

		return state;	
	}

	this.isKeyDown = function(name)
	{
		return this.keyDown[name];	
	}

	this.isButtonUp = function(code)
	{
		var state = this.mouseUp[code];

		this.mouseUp[code] = false;

		return state;	
	}

	this.isButtonDown = function(code)
	{
		return this.mouseDown[code];	
	}

	this.getMouseWheel = function()
	{
		return [this.mouseWheel[0], this.mouseWheel[1], this.mouseWheel[2]];
	}

	this.getMousePos = function()
	{
		return [this.mousePos[0], this.mousePos[1]];
	}

	this.getMousePosOffset = function()
	{
		return [this.mousePosOffset[0], this.mousePosOffset[1], this.mousePosOffset[2]];
	}

	this.getMousePosNDC = function()
	{
		var x = ((2.0 * this.mousePos[0]) / canvasManager.width) - 1.0;
		var y = 1.0 - ((2.0 * this.mousePos[1]) / canvasManager.height);

		this.mousePosNDC[0] = x;
		this.mousePosNDC[1] = y;

		return this.mousePosNDC;
	}

	this.getProjectedMousePos = function(camObj)
	{
		var mousePos_p = this.getMousePosNDC();
		
		if (camObj.viewData.mode != 'ortho') 
		{
			var mouseRay = new vector4(mousePos_p[0], mousePos_p[1], -1, 1);

			var projInv = inverse_M4(camObj.getProjectionMatrix());

			mouseRay = multiply_M4_V4(projInv, mouseRay);
			mouseRay.w = 0.0;
			mouseRay.z = -1;

			var ray_world = multiply_M4_V4(inverse_M4(camObj.getViewMatrix()), mouseRay);

			var resPos = new vector3(ray_world.x, ray_world.y, ray_world.z);
			
			resPos = normalizeV3(resPos);			
			// console.log(resPos.x, resPos.y, resPos.z);
			return resPos;
		}
		else
		{
			var mouseRay = new vector4(mousePos_p[0], mousePos_p[1], -camObj.viewData.position.z, 1);

			var projInv = inverse_M4(camObj.getProjectionMatrix());

			mouseRay = multiply_M4_V4(projInv, mouseRay);
			mouseRay.w = 0.0;
			mouseRay.z = -camObj.viewData.position.z;

			var ray_world = multiply_M4_V4(inverse_M4(camObj.getViewMatrix()), mouseRay);

			var resPos = new vector3(ray_world.x, ray_world.y, ray_world.z);
			
			// resPos = normalizeV3(resPos);			

			return resPos;
		}		
	}
}

function keyDownEvent(e)
{
	inputManager.keyDown[e.code] = true;
	inputManager.keyUp[e.code] = false;
}

function keyUpEvent(e)
{
	inputManager.keyDown[e.code] = false;
	inputManager.keyUp[e.code] = true;
}

function mouseDownEvent(e)
{
	inputManager.mouseDown[e.button] = true;
	inputManager.mouseUp[e.button] = false;
}

function mouseUpEvent(e)
{
	inputManager.mouseDown[e.button] = false;
	inputManager.mouseUp[e.button] = true;
}

function mouseMoveEvent(e)
{
	if (inputManager.firstMouse) 
	{
		inputManager.mousePos[0] = e.clientX;
		inputManager.mousePos[1] = e.clientY;

		inputManager.firstMouse = false;
	}

	inputManager.mousePosOffset[0] = e.clientX - inputManager.mousePos[0];
	inputManager.mousePosOffset[1] = inputManager.mousePos[1] - e.clientY;
	inputManager.mousePosOffset[2] = e.timeStamp;

	inputManager.mousePos[0] = e.clientX;
	inputManager.mousePos[1] = e.clientY;
}

function wheelEvent(e)
{
	inputManager.mouseWheel[0] = e.deltaX;
	inputManager.mouseWheel[1] = e.deltaY;
	inputManager.mouseWheel[2] = e.timeStamp;
}

function runInputManager()
{
	for (var i = 0; i < 3; i++)
	{
		inputManager.mouseDown[i] = false;	
		inputManager.mouseUp[i] = false;	
	}

	document.addEventListener("keydown", keyDownEvent);

	document.addEventListener("keyup", keyUpEvent);

	document.getElementById(inputManager.canvasName).addEventListener("mousedown", mouseDownEvent);

	document.getElementById(inputManager.canvasName).addEventListener("mouseup", mouseUpEvent);

	document.getElementById(inputManager.canvasName).addEventListener("wheel", wheelEvent);

	document.getElementById(inputManager.canvasName).addEventListener("mousemove", mouseMoveEvent);
}