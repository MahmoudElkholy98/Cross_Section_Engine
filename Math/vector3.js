var vector3 = function(x, y, z)
{
	this.x = (x == undefined) ? 0 : x;
	this.y = (y == undefined) ? 0 : y;
	this.z = (z == undefined) ? 0 : z;

	this.length = function()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	}

	this.getElements = function()
	{
		return [this.x, this.y, this.z];
	}
}

function normalizeV3(vector) 
{
	var invLength = 1.0 / vector.length();

	var result = new vector3();

	result.x = vector.x * invLength;
	result.y = vector.y * invLength;
	result.z = vector.z * invLength;

	return result;
}

function addV3(vec1, vec2) 
{
	var res = new vector3();

	res.x = vec1.x + vec2.x;
	res.y = vec1.y + vec2.y;
	res.z = vec1.z + vec2.z;

	return res;
}

function subtractV3(vec1, vec2) 
{
	var res = new vector3();

	res.x = vec1.x - vec2.x;
	res.y = vec1.y - vec2.y;
	res.z = vec1.z - vec2.z;

	return res;
}

function multiplyV3(vec1, vec2) 
{
	var res = new vector3();

	res.x = vec1.x * vec2.x;
	res.y = vec1.y * vec2.y;
	res.z = vec1.z * vec2.z;

	return res;
}

function multiply_V3_t(vec, t) 
{
	var res = new vector3();

	res.x = vec.x * t;
	res.y = vec.y * t;
	res.z = vec.z * t;

	return res;
}

function multiply_t_V3(t, vec) 
{
	var res = new vector3();

	res.x = vec.x * t;
	res.y = vec.y * t;
	res.z = vec.z * t;

	return res;
}

function divideV3(vec1, vec2) 
{
	var res = new vector3();

	res.x = vec1.x / vec2.x;
	res.y = vec1.y / vec2.y;
	res.z = vec1.z / vec2.z;

	return res;
}

function divide_V3_t(vec, t) 
{
	var res = new vector3();

	res.x = vec.x / t;
	res.y = vec.y / t;
	res.z = vec.z / t;

	return res;
}

function dot(vec1, vec2) 
{
	var x = vec1.x * vec2.x;	
	var y = vec1.y * vec2.y;	
	var z = vec1.z * vec2.z;	

	return x + y + z;
}

function cross(vec1, vec2)
{
	var x = (vec1.y * vec2.z) - (vec1.z * vec2.y);
	var y = (vec1.z * vec2.x) - (vec1.x * vec2.z);
	var z = (vec1.x * vec2.y) - (vec1.y * vec2.x);

	return new vector3(x, y, z);
}

function rotateV3(q, v)
{
	var cq = multiply_t_Q(-1, q);
	cq.w *= -1;

	var w = multiply_Q_V3(q, v);
	w = multiplyQ(w, cq);

	var result = new vector3(w.x, w.y, w.z);

	return result;
}

function rotateWithAxis(v, axis, angle)
{
	var res;
	var c = Math.cos(toRadians(-angle));
	var s = Math.sin(toRadians(-angle));

	var y = multiply_t_V3(1 - c, axis);
	y = dot(v, y);
	y = multiply_t_V3(y, axis);

	var z = multiply_t_V3(c, v);
	z = addV3(z, y);

	var x = multiply_t_V3(s, axis);
	x = addV3(x, z);

	res = cross(v, x);
	
	return res;
}