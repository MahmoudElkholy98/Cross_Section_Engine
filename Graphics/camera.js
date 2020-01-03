var viewData = function(position, target, up, scale, mode)
{
	this.position = position == undefined ? new vector3() : position;
	this.target = target == undefined ? new vector3() : target;
	this.up = up == undefined ? new vector3() : up;
	this.scale = scale == undefined ? new vector3() : scale;	
	this.mode = mode == undefined ? 'none' : mode;
}

var camera = function(position, target, up, scale, mode, move)
{
	this.viewData = new viewData(position, target, up, scale, mode);
	this.oldViewData = new viewData();

	this.fov = 0;
	this.near = 0;
	this.far = 0;
	this.aspect = 0;

	this.yaw = 0;
	this.pitch = 0;
	this.speed = 20.0;
	this.sensitivity = 0.45;
	this.mouseMove = false;
	this.width = 0;
	this.height = 0;

	this.move = move;
	this.prevScroll = 0;
	this.prevMove = 0;

	this.saveAndReset = function()
	{
		// this.oldViewData = this.viewData;
		
		this.oldViewData.position = this.viewData.position;
		this.oldViewData.target = this.viewData.target;
		this.oldViewData.up = this.viewData.up;
		this.oldViewData.scale = this.viewData.scale;
		this.oldViewData.mode = this.viewData.mode; 

		this.viewData = new viewData();
	}

	this.setCameraView = function(pos, target, up, scale, mode)
	{
		this.viewData.position = pos;
		this.viewData.target = target;
		this.viewData.up = up;
		this.viewData.scale = scale;
		this.viewData.mode = mode; 
	}

	this.restoreView = function()
	{
		this.viewData.position = this.oldViewData.position;
		this.viewData.target = this.oldViewData.target;
		this.viewData.up = this.oldViewData.up;
		this.viewData.scale = this.oldViewData.scale;
		this.viewData.mode = this.oldViewData.mode; 

		this.oldViewData = new viewData();
	}

	this.setPerspective = function(fov, aspect, near, far)
	{
		this.fov = fov;
		this.near = near;
		this.far = far;
		this.aspect = aspect;
	}

	this.setOrthographic = function(width, height, near, far)
	{
		this.width = width;
		this.height = height;
		this.far = far;
		this.near = near;
		this.aspect = width / height;
	}

	this.getProjectionMatrix = function()
	{
		var result = new matrix4();
	
		if (this.viewData.mode == "ortho") 
		{
			result = orthographic_(this.width / 2, -this.width / 2, this.height / 2, -this.height / 2, this.near, this.far);
			result = multiplyM4(calculateScale(this.viewData.scale), result);
		}
		else
		{
			result = perspective(this.fov, this.width / this.height, this.near, this.far);
			// result = multiplyM4(calculateScale(this.scale), result);
		}		
	
		return result;
	}

	this.getViewMatrix = function()
	{
		var result = new matrix4();
		var trans = translation(new vector3(-this.viewData.position.x, -this.viewData.position.y, -this.viewData.position.z));

		result = lookAt(this.viewData.position, addV3(this.viewData.position, this.viewData.target), this.viewData.up);
		result = multiplyM4(trans, result);
	
		return result;
	}

	this.update = function()
	{
		if(this.move == true)
		{
			if (this.prevScroll != inputManager.getMouseWheel()[2]) 
			{
				var delta = 0;
				
				if(inputManager.getMouseWheel()[1] > 0)
				{
					delta = 3;
				}
				else if (inputManager.getMouseWheel()[1] < 0)
				{
					delta = -3;
				}

				if (this.viewData.mode == 'ortho') 
				{
					this.viewData.scale = subtractV3(this.viewData.scale, multiply_t_V3((delta  * 0.016), this.viewData.scale));
				}
				else 
				{
					this.viewData.position = addV3(this.viewData.position, multiply_t_V3(-delta * 5, this.viewData.target));
				}
				
				this.prevScroll = inputManager.getMouseWheel()[2];
			}			

			var cameraSpeed = this.speed * 10.0 / 60.0;
/*
			if (inputManager.isKeyDown('KeyW'))
			{
				this.position = addV3(this.position, multiply_t_V3(cameraSpeed, this.target));
			}

			if (inputManager.isKeyDown('KeyS'))
			{
				this.position = subtractV3(this.position, multiply_t_V3(cameraSpeed, this.target));
			}

			if (inputManager.isKeyDown('KeyA'))
			{
				this.position = subtractV3(this.position, multiply_t_V3(cameraSpeed, normalizeV3(cross(this.up, this.target))));
			}

			if (inputManager.isKeyDown('KeyD'))
			{
				this.position = addV3(this.position, multiply_t_V3(cameraSpeed, normalizeV3(cross(this.up, this.target))));
			}
			*/	
		}
	}
}