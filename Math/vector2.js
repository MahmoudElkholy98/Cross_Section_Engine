var vector2 = function(x, y)
{
	this.x = (x == undefined) ? 0 : x;
	this.y = (y == undefined) ? 0 : y;

	this.length = function()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	this.getElements = function()
	{
		return [this.x, this.y];
	}
}

function normalizeV2(vector) 
{
	var invLength = 1.0 / vector.length();

	var result = new vector2();

	result.x += vector.x * invLength;
	result.y += vector.y * invLength;

	return result;
}

function addV2(vec1, vec2) 
{
	var res = new vector2();

	res.x = vec1.x + vec2.x;
	res.y = vec1.y + vec2.y;

	return res;
}

function subtractV2(vec1, vec2) 
{
	var res = new vector2();

	res.x = vec1.x - vec2.x;
	res.y = vec1.y - vec2.y;

	return res;
}

function multiplyV2(vec1, vec2) 
{
	var res = new vector2();

	res.x = vec1.x * vec2.x;
	res.y = vec1.y * vec2.y;

	return res;
}

function multiplyV2(vec, t) 
{
	var res = new vector2();

	res.x = vec.x * t;
	res.y = vec.y * t;

	return res;
}

function multiplyV2(t, vec) 
{
	var res = new vector2();

	res.x = vec.x * t;
	res.y = vec.y * t;

	return res;
}

function divideV2(vec1, vec2) 
{
	var res = new vector2();

	res.x = vec1.x / vec2.x;
	res.y = vec1.y / vec2.y;

	return res;
}

function divideV2(vec, t) 
{
	var res = new vector2();

	res.x = vec.x / t;
	res.y = vec.y / t;

	return res;
}