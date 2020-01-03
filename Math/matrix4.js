var matrix4 = function()
{
	this.elements = 
	[
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
	];

	this.getElements = function()
	{
		var newElements = [];

		for (var i = 0; i < this.elements.length; i++) 
		{
			newElements = newElements.concat(this.elements[i]);
		}
			
		return new Float32Array(newElements);
	}
}

function calculateDeterminant_M2(mat2)
{
	return (mat2[0][0] * mat2[1][1]) - (mat2[0][1] * mat2[1][0]);
}

function getMinor_M2(mat3, r0, r1, c0, c1)
{
	var mat2 = 
	[
		[mat3[r0][c0], mat3[r0][c1]],
		[mat3[r1][c0], mat3[r1][c1]]
	];

	var result = calculateDeterminant_M2(mat2);

	return result;
}

function calculateDetreminant_M3(mat3)
{
	var n00 = mat3[0][0] * getMinor_M2(mat3, 1, 2, 1, 2);
	var n11 = mat3[1][1] * getMinor_M2(mat3, 0, 2, 0, 2);
	var n22 = mat3[2][2] * getMinor_M2(mat3, 0, 1, 0, 1);

	var result = n00 - n11 + n22;

	return result;
}

function getMinor_M3(mat4, r0, r1, r2, c0, c1, c2) 
{
	var mat3 = 
	[
		[mat4[r0][c0], mat4[r0][c1], mat4[r0][c2]],
		[mat4[r1][c0], mat4[r1][c1], mat4[r1][c2]],
		[mat4[r2][c0], mat4[r2][c1], mat4[r2][c2]]
	]; 

	var result = calculateDetreminant_M3(mat3);

	return result;
}

function calculateDeterminant_M4(mat4)
{
	n00 = mat4[0][0] * getMinor_M3(mat4, 1, 2, 3, 1, 2, 3);
	n01 = mat4[0][1] * getMinor_M3(mat4, 1, 2, 3, 0, 2, 3);
	n02 = mat4[0][2] * getMinor_M3(mat4, 1, 2, 3, 0, 1, 3);
	n03 = mat4[0][3] * getMinor_M3(mat4, 1, 2, 3, 0, 1, 2);

	var result = n00 - n11 + n22 - n33;

	return result;
}

function inverse_M2(mat2)
{
	var d = calculateDeterminant_M2(mat2);
	d = 1.0 / d;

	var result = 
	[
		[d * mat2[1][1], -d * mat2[0][1]],
		[-d * mat2[1][0], d * mat2[0][0]]
	];

	return result;
}

function inverse_M3(mat3)
{
	var m00 = getMinor_M2(mat3, 1, 2, 1, 2);
	var m01 = getMinor_M2(mat3, 1, 2, 0, 2);
	var m02 = getMinor_M2(mat3, 1, 2, 0, 1);

	var m10 = getMinor_M2(mat3, 0, 2, 1, 2);
	var m11 = getMinor_M2(mat3, 0, 2, 0, 2);
	var m12 = getMinor_M2(mat3, 0, 2, 0, 1);

	var m20 = getMinor_M2(mat3, 0, 1, 1, 2);
	var m21 = getMinor_M2(mat3, 0, 1, 0, 2);
	var m22 = getMinor_M2(mat3, 0, 1, 0, 1);

	var minMat = 
	[
		[m00, m01, m02],
		[m10, m11, m12],
		[m20, m21, m22]
	];

	var det = (mat3[0][0] * m00) - (mat3[1][1] * m11) + (mat3[2][2] * m22);

	det = 1.0 / det;

	var checkerMat = 
	[
		[1, -1, 1],
		[-1, 1, -1],
		[1, -1, 1]
	];

	for (var i = 0; i < 3; i++) 
	{
		for (var j = 0; j < 3; j++) 
		{
			minMat[i][j] *= det * checkerMat[i][j];	
		}
	}

	var result;

	result = transpose_M3(minMat);

	return result;
}

function inverse_M4(mat4)
{
	var m00 = getMinor_M3(mat4.elements, 1, 2, 3, 1, 2, 3);
	var m01 = getMinor_M3(mat4.elements, 1, 2, 3, 0, 2, 3);
	var m02 = getMinor_M3(mat4.elements, 1, 2, 3, 0, 1, 3);
	var m03 = getMinor_M3(mat4.elements, 1, 2, 3, 0, 1, 2);

	var m10 = getMinor_M3(mat4.elements, 0, 2, 3, 1, 2, 3);
	var m11 = getMinor_M3(mat4.elements, 0, 2, 3, 0, 2, 3);
	var m12 = getMinor_M3(mat4.elements, 0, 2, 3, 0, 1, 3);
	var m13 = getMinor_M3(mat4.elements, 0, 2, 3, 0, 1, 2);

	var m20 = getMinor_M3(mat4.elements, 0, 1, 3, 1, 2, 3);
	var m21 = getMinor_M3(mat4.elements, 0, 1, 3, 0, 2, 3);
	var m22 = getMinor_M3(mat4.elements, 0, 1, 3, 0, 1, 3);
	var m23 = getMinor_M3(mat4.elements, 0, 1, 3, 0, 1, 2);

	var m30 = getMinor_M3(mat4.elements, 0, 1, 2, 1, 2, 3);
	var m31 = getMinor_M3(mat4.elements, 0, 1, 2, 0, 2, 3);
	var m32 = getMinor_M3(mat4.elements, 0, 1, 2, 0, 1, 3);
	var m33 = getMinor_M3(mat4.elements, 0, 1, 2, 0, 1, 2);

	var minMat = 
	[
		[m00, m01, m02, m03],
		[m10, m11, m12, m13],
		[m20, m21, m22, m23],
		[m30, m31, m32, m33]
	];

	var det = 
	(mat4.elements[0][0] * m00) 
	- (mat4.elements[0][1] * m01) 
	+ (mat4.elements[0][2] * m02) 
	- (mat4.elements[0][3] * m03);

	det = 1.0 / det;

	var checkerMat = 
	[
		[1, -1, 1, -1],
		[-1, 1, -1, 1],
		[1, -1, 1, -1],
		[-1, 1, -1, 1]
	];

	for (var i = 0; i < 4; i++) 
	{
		for (var j = 0; j < 4; j++) 
		{
			minMat[i][j] *= det * checkerMat[i][j];	
		}
	}

	var result = new matrix4();

	result.elements = transpose_M4(minMat);

	return result;
}

function transpose_M2(mat2)
{
	var result = 
	[
		[mat2[0][0], mat2[1][0]],
		[mat2[0][1], mat2[1][1]],
	];

	return result;
}

function transpose_M3(mat3)
{
	var result = 
	[
		[mat3[0][0], mat3[1][0], mat3[2][0]],
		[mat3[0][1], mat3[1][1], mat3[2][1]],
		[mat3[0][2], mat3[1][2], mat3[2][2]],
	];

	return result;
}

function transpose_M4(mat4)
{
	var result = 
	[
		[mat4[0][0], mat4[1][0], mat4[2][0], mat4[3][0]],
		[mat4[0][1], mat4[1][1], mat4[2][1], mat4[3][1]],
		[mat4[0][2], mat4[1][2], mat4[2][2], mat4[3][2]],
		[mat4[0][3], mat4[1][3], mat4[2][3], mat4[3][3]],
	];

	return result;
}

function multiplyM4(left, right)
{
	var result = new matrix4();

	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			result.elements[i][j] =
				(left.elements[i][0] * right.elements[0][j]) +
				(left.elements[i][1] * right.elements[1][j]) +
				(left.elements[i][2] * right.elements[2][j]) +
				(left.elements[i][3] * right.elements[3][j]);
		}
	}

	return result;
}

function multiply_M4_t(left, right)
{
	var result = new matrix4();

	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			result.elements[i][j] =	(left.elements[i][j] * t);
		}
	}

	return result;
}

function multiply_M4_V3(left, right)
{
	var newRight = new vector4(right.x, right.y, right.z, 1);
	var result = new vector3();
	
	result.x =
			(left.elements[0][0] * newRight.x) +
			(left.elements[1][0] * newRight.y) +
			(left.elements[2][0] * newRight.z) +
			(left.elements[3][0] * newRight.w);

	result.y =
			(left.elements[0][1] * newRight.x) +
			(left.elements[1][1] * newRight.y) +
			(left.elements[2][1] * newRight.z) +
			(left.elements[3][1] * newRight.w);

	result.z =
			(left.elements[0][2] * newRight.x) +
			(left.elements[1][2] * newRight.y) +
			(left.elements[2][2] * newRight.z) +
			(left.elements[3][2] * newRight.w);

	return result;
}

function multiply_M4_V4(left, right)
{
	var newRight = new vector4(right.x, right.y, right.z, right.w);
	var result = new vector4();
	
	result.x =
			(left.elements[0][0] * newRight.x) +
			(left.elements[1][0] * newRight.y) +
			(left.elements[2][0] * newRight.z) +
			(left.elements[3][0] * newRight.w);

	result.y =
			(left.elements[0][1] * newRight.x) +
			(left.elements[1][1] * newRight.y) +
			(left.elements[2][1] * newRight.z) +
			(left.elements[3][1] * newRight.w);

	result.z =
			(left.elements[0][2] * newRight.x) +
			(left.elements[1][2] * newRight.y) +
			(left.elements[2][2] * newRight.z) +
			(left.elements[3][2] * newRight.w);

	result.w =
			(left.elements[0][3] * newRight.x) +
			(left.elements[1][3] * newRight.y) +
			(left.elements[2][3] * newRight.z) +
			(left.elements[3][3] * newRight.w);

	return result;
}

function translation(value)
{
	var result = new matrix4();	

	result.elements[3][0] = value.x;
	result.elements[3][1] = value.y;
	result.elements[3][2] = value.z;

	return result;
}

function rotation(angle)
{
	var result = new matrix4();	

	var rotX = new matrix4();
	rotX.elements[1][1] = Math.cos(toRadians(angle.x));	rotX.elements[2][1] = -Math.sin(toRadians(angle.x));
	rotX.elements[1][2] = Math.sin(toRadians(angle.x));	rotX.elements[2][2] = Math.cos(toRadians(angle.x));

	var rotY = new matrix4();
	rotY.elements[0][0] = Math.cos(toRadians(angle.y));	rotY.elements[2][0] = -Math.sin(toRadians(angle.y));
	rotY.elements[0][2] = Math.sin(toRadians(angle.y));	rotY.elements[2][2] = Math.cos(toRadians(angle.y));

	var rotZ = new matrix4();
	rotZ.elements[0][0] = Math.cos(toRadians(angle.z));	rotZ.elements[1][0] = -Math.sin(toRadians(angle.z));
	rotZ.elements[0][1] = Math.sin(toRadians(angle.z));	rotZ.elements[1][1] = Math.cos(toRadians(angle.z));

	result = multiplyM4(rotZ, multiplyM4(rotY, rotX));

	return result;
}

function rotationWithVectors(forward, right, up)
{
	var result = new matrix4();	

	var r = normalizeV3(right);
	var u = normalizeV3(up);
	var f = normalizeV3(forward);

	result.elements[0][0] = r.x;	result.elements[0][1] = r.y;	result.elements[0][2] = r.z;
	result.elements[1][0] = u.x;	result.elements[1][1] = u.y;	result.elements[1][2] = u.z;
	result.elements[2][0] = f.x;	result.elements[2][1] = f.y;	result.elements[2][2] = f.z;

	return result;
}

function arbitraryRotation(angle, axis)
{
	var result = new matrix4();
	var r = toRadians(angle);
	var c = Math.cos(r);
	var s = Math.sin(r);
	var omc = 1 - c;

	var x = new vector3(c + (axis.x * omc), (axis.x * axis.y * omc) + (axis.z * s), (axis.x * axis.z * omc) - (axis.y * s));
	var y = new vector3((axis.x * axis.y * omc) - (axis.z * s), c + (axis.y * omc), (axis.y * axis.z * omc) + (axis.x * s));
	var z = new vector3((axis.x * axis.z * omc) + (axis.y * s), (axis.y * axis.z * omc) - (axis.x * s), c + (axis.z * omc));

	result.elements[0][0] = x.x;	result.elements[0][1] = y.x;	result.elements[0][2] = z.x;	result.elements[0][3] = 0;
	result.elements[1][0] = x.y;	result.elements[1][1] = y.y;	result.elements[1][2] = z.y;	result.elements[1][3] = 0;
	result.elements[2][0] = x.z;	result.elements[2][1] = y.z;	result.elements[2][2] = z.z;	result.elements[2][3] = 0;
	result.elements[3][0] = 0;		result.elements[3][1] = 0;		result.elements[3][2] = 0;		result.elements[3][3] = 1;

	return result;
}

function calculateScale(value)
{
	var result = new matrix4();	

	result.elements[0][0] = value.x;
	result.elements[1][1] = value.y;
	result.elements[2][2] = value.z;

	return result;
}

function initRotation(dir, up)
{
	var f = normalizeV3(dir);

	var r = normalizeV3(up);
	r = cross(r, f);

	var u = cross(f, r);

	var result = new matrix4();

	result.elements[0][0] = r.x;
	result.elements[1][0] = r.y;
	result.elements[2][0] = r.z;

	result.elements[0][1] = u.x;
	result.elements[1][1] = u.y;
	result.elements[2][1] = u.z;

	result.elements[0][2] = f.x;
	result.elements[1][2] = f.y;
	result.elements[2][2] = f.z;

	return result;
}

function lookAt(pos, target, up)
{
	var result = new matrix4();	

	var z = normalizeV3(subtractV3(target, pos));
	var x = normalizeV3(cross(up, z));
	var y = cross(x, z);

	result.elements[0][0] = x.x;	result.elements[1][0] = x.y;	result.elements[2][0] = x.z;
	result.elements[0][1] = y.x;	result.elements[1][1] = y.y;	result.elements[2][1] = y.z;
	result.elements[0][2] = -z.x;	result.elements[1][2] = -z.y;	result.elements[2][2] = -z.z;

	// result.elements[3][0] = -dot(x, pos);
	// result.elements[3][1] = -dot(y, pos);
	// result.elements[3][2] = dot(z, pos);

	return result;
}

function perspective(fov, aspect, near, far)
{
	var result = new matrix4();	

	var tanHalfFOV = Math.tan(toRadians(fov / 2.0));

	result.elements[0][0] = ((1.0) / (tanHalfFOV * aspect));
	result.elements[1][1] = ((1.0) / (tanHalfFOV));
	result.elements[2][2] = -((far + near) / (far - near));
	result.elements[2][3] = -1.0;
	result.elements[3][2] = -((2.0 * near * far) / (far - near));

	return result;
}

function orthographic_(right, left, top, bottom, near, far)
{
	var result = new matrix4();

	result.elements[0][0] = (2.0 / (right - left));	
	result.elements[3][0] = -((right + left) / (right - left));
	result.elements[1][1] = (2.0 / (top - bottom));
	result.elements[3][1] = -((top + bottom) / (top - bottom));
	result.elements[2][2] = (-2.0 / (far - near));
	result.elements[3][2] = -((far + near) / (far - near));

	return result;
}

function orthographic(width, height, near, far)
{
	var top = height / 2.0;
	var bottom = -top;

	var right = width / 2.0;
	var left = -right;

	return orthographic_(right, left, top, bottom, near, far);
}