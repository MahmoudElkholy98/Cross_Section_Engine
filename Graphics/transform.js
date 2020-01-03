var transform = function(pos, rot, scale)
{
	this.position = (pos == undefined) ? new vector3() : pos;
	this.rotation = (rot == undefined) ? new vector3() : rot;
	this.rotationQuat = new quaternion();
	this.scale = (scale == undefined) ? new vector3(1, 1, 1) : scale;
	
	this.right = new vector3(1, 0, 0);
	this.up = new vector3(0, 1, 0);
	this.front = new vector3(0, 0, 1);

	this.getModelMatrix = function()
	{
		var trans = translation(this.position);
		
		var rot = quaternionToRotMat(this.rotationQuat);
		
		var scaleMat = calculateScale(this.scale);

		var result = multiplyM4(scaleMat, multiplyM4(rot, trans));

		return result;
	}

	this.rotate = function(angle, axis)
	{
		var q = rotateQ(angle, axis);

		this.rotationQuat = normalizeQ(multiplyQ(q, this.rotationQuat));
	}

	this.translate = function(amount, axis)
	{
		this.position = addV3(this.position, multiply_t_V3(amount, axis));
	}

	this.lookAtPoint = function(point, up)
	{
		this.rotationQuat = this.lookAtRotation(point, up);
	}

	this.lookAtRotation = function(point, up)
	{
		var dir = subtractV3(point, this.position);
		dir = normalizeV3(dir);

		var rotMat = initRotation(dir, up);

		var res = quatFromRotationMatrix(rotMat);

		return res;
	}
}	