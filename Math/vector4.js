var vector4 = function(x, y, z, w)
{
	this.x = (x == undefined) ? 0 : x;
	this.y = (y == undefined) ? 0 : y;
	this.z = (z == undefined) ? 0 : z;
	this.w = (w == undefined) ? 0 : w;

	this.length = function()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
	}

	this.getElements = function()
	{
		return [this.x, this.y, this.z, this.w];
	}
}

function normalizeV4(vector) 
{
	var invLength = 1.0 / vector.length();

	var result = new vector4();

	result.x += vector.x * invLength;
	result.y += vector.y * invLength;
	result.z += vector.z * invLength;
	result.w += vector.w * invLength;

	return result;
}

function addV4(vec1, vec2) 
{
	var res = new vector4();

	res.x = vec1.x + vec2.x;
	res.y = vec1.y + vec2.y;
	res.z = vec1.z + vec2.z;
	res.w = vec1.w + vec2.w;

	return res;
}

function subtractV4(vec1, vec2) 
{
	var res = new vector4();

	res.x = vec1.x - vec2.x;
	res.y = vec1.y - vec2.y;
	res.z = vec1.z - vec2.z;
	res.w = vec1.w - vec2.w;

	return res;
}

function multiply(vec1, vec2) 
{
	var res = new vector4();

	res.x = vec1.x * vec2.x;
	res.y = vec1.y * vec2.y;
	res.z = vec1.z * vec2.z;
	res.w = vec1.w * vec2.w;

	return res;
}

function multiply(vec, t) 
{
	var res = new vector4();

	res.x = vec1.x * t;
	res.y = vec1.y * t;
	res.z = vec1.z * t;
	res.w = vec1.w * t;

	return res;}

function multiply(t, vec) 
{
	var res = new vector4();

	res.x = vec1.x * t;
	res.y = vec1.y * t;
	res.z = vec1.z * t;
	res.w = vec1.w * t;

	return res;
}

function divideV4(vec1, vec2) 
{
	var res = new vector4();

	res.x = vec1.x / vec2.x;
	res.y = vec1.y / vec2.y;
	res.z = vec1.z / vec2.z;
	res.w = vec1.w / vec2.w;

	return res;
}

function divideV4(vec, t) 
{
	var res = new vector4();

	res.x = vec1.x / t;
	res.y = vec1.y / t;
	res.z = vec1.z / t;
	res.w = vec1.w / t;

	return res;
}