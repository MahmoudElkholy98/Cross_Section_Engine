var quaternion = function(x, y, z, w)
{
	this.x = (x == undefined) ? 0 : x;
	this.y = (y == undefined) ? 0 : y;
	this.z = (z == undefined) ? 0 : z;
	this.w = (w == undefined) ? 1 : w;

	this.length = function()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
	}

	this.lengthSquare = function()
	{
		return ((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
	}

	this.getElements = function()
	{
		return [this.x, this.y, this.z, this.w];
	}
}

function normalizeQ(quat) 
{
	var invLength = 1.0 / quat.length();

	var result = new quaternion();

	result.x = quat.x * invLength;
	result.y = quat.y * invLength;
	result.z = quat.z * invLength;
	result.w = quat.w * invLength;

	return result;
}

function addQ(q1, q2) 
{
	var res = new quaternion();

	res.x = q1.x + q2.x;
	res.y = q1.y + q2.y;
	res.z = q1.z + q2.z;
	res.w = q1.w + q2.w;

	return res;
}

function subtractQ(q1, q2) 
{
	var res = new quaternion();

	res.x = q1.x - q2.x;
	res.y = q1.y - q2.y;
	res.z = q1.z - q2.z;
	res.w = q1.w - q2.w;

	return res;
}

function multiplyQ(q1, q2) 
{
	var res = new quaternion();

	res.x = (q1.x * q2.w) + (q1.w * q2.x) + (q1.y * q2.z) - (q1.z * q2.y);
	res.y = (q1.y * q2.w) + (q1.w * q2.y) + (q1.z * q2.x) - (q1.x * q2.z);
	res.z = (q1.z * q2.w) + (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x);
	res.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);

	return res;
}

function multiply_Q_V3(q, v) 
{
	var res = new quaternion();

	res.x = (q.w * v.x) + (q.y * v.z) - (q.z * v.y);
	res.y = (q.w * v.y) + (q.z * v.x) - (q.x * v.z);
	res.z = (q.w * v.z) + (q.x * v.y) - (q.y * v.x);
	res.w = -(q.x * v.x) - (q.y * v.y) - (q.z * v.z);

	return res;
}

function multiply_Q_t(q, t) 
{
	var res = new quaternion();

	res.x = q.x * t;
	res.y = q.y * t;
	res.z = q.z * t;
	res.w = q.w * t;

	return res;}

function multiply_t_Q(t, q) 
{
	var res = new quaternion();

	res.x = q.x * t;
	res.y = q.y * t;
	res.z = q.z * t;
	res.w = q.w * t;

	return res;
}

function divideV4(q1, q2) 
{
	var res = new quaternion();

	res.x = q1.x / q2.x;
	res.y = q1.y / q2.y;
	res.z = q1.z / q2.z;
	res.w = q1.w / q2.w;

	return res;
}

function divideV4(q, t) 
{
	var res = new quaternion();

	res.x = q.x / t;
	res.y = q.y / t;
	res.z = q.z / t;
	res.w = q.w / t;

	return res;
}

function rotateQ(angle, axis)
{
	var result = new quaternion();
	var a = normalizeV3(axis);
	var sh = Math.sin(toRadians(angle % 360) / 2.0);
	var ch = Math.cos(toRadians(angle % 360) / 2.0);

	result.x = a.x * sh;
	result.y = a.y * sh;
	result.z = a.z * sh;
	result.w = ch;

	return result;
}

function rotateX(q, angle)
{
	var result = new quaternion();

	var sh = Math.sin(toRadians(angle) / 2.0);
	var ch = Math.cos(toRadians(angle) / 2.0);

	result.x = q.x * ch + q.w * sh;
	result.y = q.y * ch + q.z * sh;
	result.z = q.z * ch - q.y * sh;
	result.w = q.w * ch - q.x * sh;

	return result;
}

function rotateY(q, angle)
{
	var result = new quaternion();

	var sh = Math.sin(toRadians(angle) / 2.0);
	var ch = Math.cos(toRadians(angle) / 2.0);

	result.x = q.x * ch - q.z * sh;
	result.y = q.y * ch + q.w * sh;
	result.z = q.z * ch + q.x * sh;
	result.w = q.w * ch - q.y * sh;

	return result;
}

function rotateZ(q, angle)
{
	var result = new quaternion();

	var sh = Math.sin(toRadians(angle) / 2.0);
	var ch = Math.cos(toRadians(angle) / 2.0);

	result.x = q.x * ch + q.y * sh;
	result.y = q.y * ch - q.x * sh;
	result.z = q.z * ch + q.w * sh;
	result.w = q.w * ch - q.z * sh;

	return result;
}

function quaternionToRotMat(q)
{
	q = normalizeQ(q);

    var x = q.x, y = q.y, z = q.z, w = q.w,

    x2 = x + x,

    y2 = y + y,

    z2 = z + z,

    xx = x * x2,

    yx = y * x2,

    yy = y * y2,

    zx = z * x2,

    zy = z * y2,

    zz = z * z2,

    wx = w * x2,

    wy = w * y2,

    wz = w * z2;

    var out = new matrix4();

    out.elements[0][0] = 1 - yy - zz;

    out.elements[0][1] = yx + wz;

    out.elements[0][2] = zx - wy;

    out.elements[0][3] = 0;

    out.elements[1][0] = yx - wz;

    out.elements[1][1] = 1 - xx - zz;

    out.elements[1][2] = zy + wx;

    out.elements[1][3] = 0;

    out.elements[2][0] = zx + wy;

    out.elements[2][1] = zy - wx;

    out.elements[2][2] = 1 - xx - yy;

    out.elements[2][3] = 0;

    out.elements[3][0] = 0;

    out.elements[3][1] = 0;

    out.elements[3][2] = 0;

    out.elements[3][3] = 1;

    return out;
}

function getForward(q)
{
	var result = rotateV3(q, new vector3(0, 0, 1));

	return result;
}

function getBack(q)
{
	var result = rotateV3(q, new vector3(0, 0, -1));

	return result;
}

function getUp(q)
{
	var result = rotateV3(q, new vector3(0, 1, 0));

	return result;
}

function getDown(q)
{
	var result = rotateV3(q, new vector3(0, -1, 0));

	return result;
}

function getRight(q)
{
	var result = rotateV3(q, new vector3(1, 0, 0));

	return result;
}

function getLeft(q)
{
	var result = rotateV3(q, new vector3(-1, 0, 0));

	return result;
}

function quatFromRotationMatrix(mat)
{
	var res = new quaternion();
	var x = 0;
	var y = 0;
	var z = 0;
	var w = 0;
	var trace = mat.elements[0][0] + mat.elements[1][1] + mat.elements[2][2];

	if (trace > 0) 
	{
		var s = 0.5 / Math.sqrt(trace + 1.0);

		w = 0.25 / s;
		x = (mat.elements[2][1] - mat.elements[1][2]) * s; 
		y = (mat.elements[0][2] - mat.elements[2][0]) * s; 
		z = (mat.elements[1][0] - mat.elements[0][1]) * s; 
	}
	else
	{
		if (mat.elements[0][0] > mat.elements[1][1] && mat.elements[0][0] > mat.elements[2][2]) 
		{
			var s = 2.0 * Math.sqrt(1.0 + mat.elements[0][0] - mat.elements[1][1] - mat.elements[2][2]);

			w = (mat.elements[2][1] - mat.elements[1][2]) / s;
			x = 0.25 * s;
			y = (mat.elements[0][1] + mat.elements[1][0]) / s;
			z = (mat.elements[0][2] + mat.elements[2][0]) / s;
		}
		else if (mat.elements[1][1] > mat.elements[2][2]) 
		{
			var s = 2.0 * Math.sqrt(1.0 + mat.elements[1][1] - mat.elements[0][0] - mat.elements[2][2]);

			w = (mat.elements[0][2] - mat.elements[2][0]) / s;
			x = (mat.elements[0][1] + mat.elements[1][0]) / s;
			y = 0.25 * s;
			z = (mat.elements[1][2] + mat.elements[2][1]) / s;
		}
		else
		{
			var s = 2.0 * Math.sqrt(1.0 + mat.elements[2][2] - mat.elements[0][0] - mat.elements[1][1]);

			w = (mat.elements[1][0] - mat.elements[0][1]) / s;
			x = (mat.elements[0][2] + mat.elements[2][0]) / s;
			y = (mat.elements[2][1] + mat.elements[1][2]) / s;
			z = 0.25 * s;
		}
	}

	res.x = x;
	res.y = y;
	res.z = z;
	res.w = w;

	var invLen = 1.0 / res.length();

	res.x *= invLen;
	res.y *= invLen;
	res.z *= invLen;
	res.w *= invLen;

	return res;
}