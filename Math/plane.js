var plane = function(position, size, base, direction)
{
	this.position = position;
	this.size = size;
	this.plane = base;
	this.direction = direction;

	this.normal = new vector3();
	this.distance = 0;
	this.vertices = [];
	this.equation = new vector4();

	this.transform = new transform();

	this.init = function()
	{
		if(this.plane == "xy" || this.plane == "yx" || this.plane == "XY" || this.plane == "YX")
		{
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y - (this.size.y / 2.0), this.position.z));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y - (this.size.y / 2.0), this.position.z));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y + (this.size.y / 2.0), this.position.z));
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y + (this.size.y / 2.0), this.position.z));
		}
		else if(this.plane == "xz" || this.plane == "zx" || this.plane == "XZ" || this.plane == "ZX")
		{
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y, this.position.z + (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y, this.position.z + (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y, this.position.z - (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y, this.position.z - (this.size.z / 2.0)));
		}
		else if(this.plane == "zy" || this.plane == "yz" || this.plane == "ZY" || this.plane == "YZ")
		{
			this.vertices.push(new vector3(this.position.x, this.position.y - (this.size.y / 2.0), this.position.z + (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x, this.position.y - (this.size.y / 2.0), this.position.z - (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x, this.position.y + (this.size.y / 2.0), this.position.z - (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x, this.position.y + (this.size.y / 2.0), this.position.z + (this.size.z / 2.0)));
		}
		else
		{
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y, this.position.z + (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y, this.position.z + (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x + (this.size.x / 2.0), this.position.y, this.position.z - (this.size.z / 2.0)));
			this.vertices.push(new vector3(this.position.x - (this.size.x / 2.0), this.position.y, this.position.z - (this.size.z / 2.0)));
		}

		var v1 = subtractV3(this.vertices[1], this.vertices[0]);
		var v2 = subtractV3(this.vertices[2], this.vertices[0]);

		if(this.direction == 'front' || this.direction == 'FRONT' || this.direction == 'Front')
		{
			this.direction = 'front';
			this.normal = cross(v1, v2);
		}
		else if(this.direction == 'back' || this.direction == 'BACK' || this.direction == 'Back')
		{
			this.direction = 'back';
			this.normal = cross(v2, v1);	
		}
		else
		{
			this.direction = 'front';
			this.normal = cross(v1, v2);
		}

		this.normal = normalizeV3(this.normal);

		this.distance = -dot(this.normal, this.vertices[0]);
		this.equation = new vector4(this.normal.x, this.normal.y, this.normal.z, this.distance);
	}

	this.rotate = function(x, y, z)
	{
		var rotMat = rotation(x, y, z);
	}

	this.getEquation = function(amount)
	{
		var rot = rotation(amount);

		this.vertices[0] = multiply_M4_V3(trans, this.vertices[0]);
		this.vertices[1] = multiply_M4_V3(trans, this.vertices[1]);
		this.vertices[2] = multiply_M4_V3(trans, this.vertices[2]);
		this.vertices[3] = multiply_M4_V3(trans, this.vertices[3]);

		var v1 = subtractV3(this.vertices[1], this.vertices[0]);
		var v2 = subtractV3(this.vertices[2], this.vertices[0]);

		if(this.direction == 'front')
		{
			this.normal = cross(v1, v2);
		}
		else if(this.direction == 'back')
		{
			this.normal = cross(v2, v1);	
		}
		else
		{
			this.normal = cross(v1, v2);
		}

		this.normal = normalizeV3(this.normal);

		this.distance = -dot(this.normal, this.vertices[0]);
		this.equation = new vector4(this.normal.x, this.normal.y, this.normal.z, this.distance);
	}

	this.translate = function(amount)
	{
		var trans = translation(amount);

		this.vertices[0] = multiply_M4_V3(trans, this.vertices[0]);
		this.vertices[1] = multiply_M4_V3(trans, this.vertices[1]);
		this.vertices[2] = multiply_M4_V3(trans, this.vertices[2]);
		this.vertices[3] = multiply_M4_V3(trans, this.vertices[3]);

		var v1 = subtractV3(this.vertices[1], this.vertices[0]);
		var v2 = subtractV3(this.vertices[2], this.vertices[0]);

		if(this.direction == 'front')
		{
			this.normal = cross(v1, v2);
		}
		else if(this.direction == 'back')
		{
			this.normal = cross(v2, v1);	
		}
		else
		{
			this.normal = cross(v1, v2);
		}

		this.normal = normalizeV3(this.normal);

		this.distance = -dot(this.normal, this.vertices[0]);
		this.equation = new vector4(this.normal.x, this.normal.y, this.normal.z, this.distance);

		//console.log(this.distance);
	}

	this.update = function()
	{
		var model = multiplyM4(this.transform.getModelMatrix(), renderer.worldTransform.getModelMatrix());

		var vert0 = multiply_M4_V3(model, this.vertices[0]);
		var vert1 = multiply_M4_V3(model, this.vertices[1]);
		var vert2 = multiply_M4_V3(model, this.vertices[2]);
		var vert3 = multiply_M4_V3(model, this.vertices[3]);

		var v1 = subtractV3(vert1, vert0);
		var v2 = subtractV3(vert2, vert0);

		if(this.direction == 'front')
		{
			this.normal = cross(v1, v2);
		}
		else if(this.direction == 'back')
		{
			this.normal = cross(v2, v1);	
		}
		else
		{
			this.normal = cross(v1, v2);
		}

		this.normal = normalizeV3(this.normal);

		this.distance = -dot(this.normal, vert0);
		this.equation = new vector4(this.normal.x, this.normal.y, this.normal.z, this.distance);
	}
}