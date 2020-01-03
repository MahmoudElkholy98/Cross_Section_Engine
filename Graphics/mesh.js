var mesh = function(withTexture)
{
	this.vertices;
	this.normals;
	this.texcoord;
	this.vbo;
	this.minBounds = new vector3();
	this.maxBounds = new vector3();
	this.withTexture = (withTexture != undefined) ? withTexture : false;
	this.mode;
	this.size = new vector3();

	this.bindBuffers = function()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		
		if (this.withTexture) 
		{
			gl.enableVertexAttribArray(2);

			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
			gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
			gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
		}
		else
		{
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
			gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
		}		
	}

	this.unbindBuffers = function()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	this.deleteBuffers = function()
	{
		gl.deleteBuffer(this.vbo);
	}
}

var calculateNormals = function(vertices)
{
	var result = [];

	for (var i = 0; i < vertices.length; i += 3) 
	{
		if (((i + 1 >= vertices.length) || (i + 2 >= vertices.length)) && vertices.length % 3 != 0) 
		{
			if (i + 1 >= vertices.length) 
			{
				result.push(new vector3());

				result[i + 0] = addV3(result[i + 0], normal);
			}
			else if (i + 2 >= vertices.length) 
			{
				result.push(new vector3());
				result.push(new vector3());

				result[i + 0] = addV3(result[i + 0], normal);
				result[i + 0] = addV3(result[i + 0], normal);
			}

			break;
		}

		var v1 = subtractV3(vertices[i + 1], vertices[i + 0]);
		var v2 = subtractV3(vertices[i + 2], vertices[i + 0]);

		var normal = normalizeV3(cross(v1, v2));

		result.push(new vector3());
		result.push(new vector3());
		result.push(new vector3());

		result[i + 0] = addV3(result[i + 0], normal);
		result[i + 1] = addV3(result[i + 1], normal);
		result[i + 2] = addV3(result[i + 2], normal);
	}

	for (var i = 0; i < result.length; i++) 
	{
		result[i] = normalizeV3(result[i]);
	}

	return result;
}

var convertToBuffer = function(vertices, normals, texcoord)
{
	var result = [];

	for (var i = 0; i < vertices.length; i++) 
	{
		result.push(vertices[i].x);	
		result.push(vertices[i].y);	
		result.push(vertices[i].z);	

		if(normals.length > 0)
		{
			result.push(normals[i].x);	
			result.push(normals[i].y);	
			result.push(normals[i].z);	
		}
		else
		{
			result.push(0);
			result.push(0);
			result.push(0);
		}		

		if (texcoord != null)
		{
			result.push(texcoord[i].x);	
			result.push(texcoord[i].y);	
		}
	}

	return new Float32Array(result);
}

var createMesh = function(vertices, normals, texcoord)
{
	var result = new mesh();

	if (texcoord != undefined && texcoord != null) 
	{
		result.withTexture = true;
	}
	result.vertices = vertices;
	result.texcoord = texcoord;
	
	if (normals == undefined) 
	{
		result.normals = calculateNormals(vertices);
	}
	else
	{
		result.normals = normals;
	}	
		
	result.vbo = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vbo);
	//console.log("3.5");
	var bufferData = convertToBuffer(result.vertices, result.normals, texcoord);
	//console.log("3.8");
	
	gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);
	
	if (result.withTexture) 
	{
		gl.enableVertexAttribArray(2);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
	}
	else
	{
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
	}		

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return result;
}

var createCuboid = function(pos, size)
{
	var vertices = [];

	// Face: UP 
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	
	// Face: DOWN 
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));

	// Face: BACK 
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));

	// Face: FRONT 
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));

	// Face: LEFT 
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));

	// Face: RIGHT
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	
	var newVerts = [];

	// Face: UP!!
	newVerts.push(vertices[0 + (4 * 0)]);
	newVerts.push(vertices[1 + (4 * 0)]);
	newVerts.push(vertices[2 + (4 * 0)]);

	newVerts.push(vertices[0 + (4 * 0)]);
	newVerts.push(vertices[2 + (4 * 0)]);
	newVerts.push(vertices[3 + (4 * 0)]);

	// Face: DOWN!!
	newVerts.push(vertices[2 + (4 * 1)]);
	newVerts.push(vertices[1 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 1)]);

	newVerts.push(vertices[3 + (4 * 1)]);
	newVerts.push(vertices[2 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 1)]);

	// Face: BACK!!
	newVerts.push(vertices[2 + (4 * 2)]);
	newVerts.push(vertices[1 + (4 * 2)]);
	newVerts.push(vertices[0 + (4 * 2)]);

	newVerts.push(vertices[3 + (4 * 2)]);
	newVerts.push(vertices[2 + (4 * 2)]);
	newVerts.push(vertices[0 + (4 * 2)]);

	// Face: FRONT!!
	newVerts.push(vertices[0 + (4 * 3)]);
	newVerts.push(vertices[1 + (4 * 3)]);
	newVerts.push(vertices[2 + (4 * 3)]);

	newVerts.push(vertices[0 + (4 * 3)]);
	newVerts.push(vertices[2 + (4 * 3)]);
	newVerts.push(vertices[3 + (4 * 3)]);

	// Face: LEFT!!
	newVerts.push(vertices[2 + (4 * 4)]);
	newVerts.push(vertices[1 + (4 * 4)]);
	newVerts.push(vertices[0 + (4 * 4)]);

	newVerts.push(vertices[3 + (4 * 4)]);
	newVerts.push(vertices[2 + (4 * 4)]);
	newVerts.push(vertices[0 + (4 * 4)]);

	// Face: RIGHT!!
	newVerts.push(vertices[0 + (4 * 5)]);
	newVerts.push(vertices[1 + (4 * 5)]);
	newVerts.push(vertices[2 + (4 * 5)]);

	newVerts.push(vertices[0 + (4 * 5)]);
	newVerts.push(vertices[2 + (4 * 5)]);
	newVerts.push(vertices[3 + (4 * 5)]);

	// var texcoord = [];

	// for(var i = 0; i < 36; i++)
	// {
	// 	texcoord.push(new vector2());
	// }

	var result = createMesh(newVerts, null, null);
	result.size = size;
	result.mode = gl.TRIANGLES;
	result.minBounds = new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0));
	result.maxBounds = new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0));

	return result;
}

function createWireCuboid(pos, size)
{
	var vertices = [];

	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));

	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
	vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));

	var newVerts = [];

	newVerts.push(vertices[0 + (4 * 0)]);
	newVerts.push(vertices[1 + (4 * 0)]);

	newVerts.push(vertices[1 + (4 * 0)]);
	newVerts.push(vertices[1 + (4 * 1)]);

	newVerts.push(vertices[1 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 1)]);

	newVerts.push(vertices[0 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 0)]);

	newVerts.push(vertices[0 + (4 * 0)]);
	newVerts.push(vertices[3 + (4 * 0)]);

	newVerts.push(vertices[3 + (4 * 0)]);
	newVerts.push(vertices[3 + (4 * 1)]);

	newVerts.push(vertices[3 + (4 * 1)]);
	newVerts.push(vertices[2 + (4 * 1)]);

	newVerts.push(vertices[2 + (4 * 1)]);
	newVerts.push(vertices[2 + (4 * 0)]);

	newVerts.push(vertices[2 + (4 * 0)]);
	newVerts.push(vertices[1 + (4 * 0)]);

	newVerts.push(vertices[1 + (4 * 0)]);
	newVerts.push(vertices[1 + (4 * 1)]);

	newVerts.push(vertices[1 + (4 * 1)]);
	newVerts.push(vertices[2 + (4 * 1)]);

	newVerts.push(vertices[2 + (4 * 1)]);
	newVerts.push(vertices[3 + (4 * 1)]);

	newVerts.push(vertices[3 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 1)]);

	newVerts.push(vertices[0 + (4 * 1)]);
	newVerts.push(vertices[0 + (4 * 0)]);

	newVerts.push(vertices[0 + (4 * 0)]);
	newVerts.push(vertices[3 + (4 * 0)]);

	newVerts.push(vertices[3 + (4 * 0)]);
	newVerts.push(vertices[2 + (4 * 0)]);

	var result = createMesh(newVerts, [], null);
	result.mode = gl.LINE_STRIP;
	result.size = size;

	result.minBounds = new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z - (size.z / 2.0));
	result.maxBounds = new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z + (size.z / 2.0));

	return result;
}

var createQuad = function(pos, size, plane, direction)
{
	var vertices = [];
	var result;

	if(plane == "xy" || plane == "yx" || plane == "XY" || plane == "YX")
	{
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y - (size.y / 2.0), pos.z));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z));
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y + (size.y / 2.0), pos.z));
	}
	else if(plane == "xz" || plane == "zx" || plane == "XZ" || plane == "ZX")
	{
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y, pos.z + (size.z / 2.0)));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y, pos.z + (size.z / 2.0)));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y, pos.z - (size.z / 2.0)));
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y, pos.z - (size.z / 2.0)));
	}
	else if(plane == "zy" || plane == "yz" || plane == "ZY" || plane == "YZ")
	{
		vertices.push(new vector3(pos.x, pos.y - (size.y / 2.0), pos.z + (size.z / 2.0)));
		vertices.push(new vector3(pos.x, pos.y - (size.y / 2.0), pos.z - (size.z / 2.0)));
		vertices.push(new vector3(pos.x, pos.y + (size.y / 2.0), pos.z - (size.z / 2.0)));
		vertices.push(new vector3(pos.x, pos.y + (size.y / 2.0), pos.z + (size.z / 2.0)));
	}
	else
	{
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y, pos.z + (size.z / 2.0)));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y, pos.z + (size.z / 2.0)));
		vertices.push(new vector3(pos.x + (size.x / 2.0), pos.y, pos.z - (size.z / 2.0)));
		vertices.push(new vector3(pos.x - (size.x / 2.0), pos.y, pos.z - (size.z / 2.0)));
	}

	var newVerts = [];

	if(direction == 'front')
	{
		newVerts.push(vertices[0]);
		newVerts.push(vertices[1]);
		newVerts.push(vertices[2]);

		newVerts.push(vertices[0]);
		newVerts.push(vertices[2]);
		newVerts.push(vertices[3]);
	}
	else
	{
		newVerts.push(vertices[2]);
		newVerts.push(vertices[1]);
		newVerts.push(vertices[0]);

		newVerts.push(vertices[3]);
		newVerts.push(vertices[2]);
		newVerts.push(vertices[0]);
	}

	// var texcoord = [];

	// texcoord.push(new vector2(0, 0));
	// texcoord.push(new vector2(0, 1));
	// texcoord.push(new vector2(1, 1));

	// texcoord.push(new vector2(0, 0));
	// texcoord.push(new vector2(1, 1));
	// texcoord.push(new vector2(1, 0));

	result = createMesh(newVerts, undefined, null);
	result.mode = gl.TRIANGLES;
	result.size = size;

	// result.minBounds = new vector3(pos.x - (size.x / 2.0), pos.y - (size.y / 2.0), pos.z);
	// result.maxBounds = new vector3(pos.x + (size.x / 2.0), pos.y + (size.y / 2.0), pos.z);
	
	return result;
}

function prepVec(vec)
{
	var m = Math.abs(vec.x);
	var axis = new vector3(1, 0, 0);

	if (Math.abs(vec.y) < m) 
	{
		m = Math.abs(vec.y);
		axis = new vector3(0, 1, 0);
	}

	if (Math.abs(vec.z) < m) 
	{
		m = Math.abs(vec.z);
		axis = new vector3(0, 0, 1);
	}

	return cross(vec, axis);
}

function createCone(normal, apex, height, raduis, slices)
{
	var c = addV3(apex, multiply_t_V3(-height, normal));
	var e0 = prepVec(normal);
	var e1 = cross(e0, normal);
	var angle = toRadians(360.0 / slices);

	var coneVerts = [];
	for (var i = 0; i < slices; i++)
	{
		var rad = angle * i;
		var t1 = multiply_t_V3(Math.cos(rad), e0);
		var t2 = multiply_t_V3(Math.sin(rad), e1)
		var v = addV3(c, multiply_t_V3(raduis, addV3(t1, t2)));
		coneVerts.push(v);
	}

	var newV = [];	
	newV.push(apex);

	for (var i = slices - 1; i >= 0; i--)
	{
		newV.push(coneVerts[i]);
	}
	//newV.push(coneVerts[slices - 1]);
	// newV.push(coneVerts[slices - 2]);
	// newV.push(coneVerts[slices - 3]);
	// newV.push(coneVerts[slices - 4]);

	var coneMesh = createMesh(newV, undefined, null);
	coneMesh.mode = gl.TRIANGLE_FAN;
	var b1 = getBounds(coneMesh.vertices);
	coneMesh.minBounds = b1[0];
	coneMesh.maxBounds = b1[1];

	coneMesh.size.x = coneMesh.maxBounds.x - coneMesh.minBounds.x;
	coneMesh.size.x = coneMesh.maxBounds.y - coneMesh.minBounds.y;
	coneMesh.size.x = coneMesh.maxBounds.z - coneMesh.minBounds.z;

	var baseVerts = [];

	for (var i = 0; i < slices; i++)
	{
		baseVerts.push(coneVerts[i]);
	}

	var baseMesh = createMesh(baseVerts, undefined, null);
	baseMesh.mode = gl.TRIANGLE_FAN;
	var b2 = getBounds(baseMesh.vertices);
	baseMesh.minBounds = b2[0];
	baseMesh.maxBounds = b2[1];

	baseMesh.size.x = baseMesh.maxBounds.x - baseMesh.minBounds.x;
	baseMesh.size.x = baseMesh.maxBounds.y - baseMesh.minBounds.y;
	baseMesh.size.x = baseMesh.maxBounds.z - baseMesh.minBounds.z;

	var result = [];
	result.push(coneMesh);
	result.push(baseMesh);

	return result;
}

function createGrid(pos, horizontal, vertical, spacing, plane)
{
	var vertices = [];
	var startPos = new vector3();

	if (plane == 'xz' || plane == 'zx' || plane == 'XZ' || plane == 'ZX') 
	{
		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y, pos.z + (vertical / 2.0), pos.z);

		while(startPos.x <= (horizontal / 2.0)) 
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.z -= vertical;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.x += spacing;
		}

		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y, pos.z + (vertical / 2.0), pos.z);

		while(startPos.z >= -(vertical / 2.0))
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.x += horizontal;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.z -= spacing;
		}
	}
	else if (plane == 'xy' || plane == 'yx' || plane == 'XY' || plane == 'YX') 
	{
		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y - (vertical / 2.0), pos.z);

		while(startPos.x <= (horizontal / 2.0)) 
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.y += vertical;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.x += spacing;
		}

		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y - (vertical / 2.0), pos.z);

		while(startPos.y <= (vertical / 2.0))
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.x += horizontal;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.y += spacing;
		}
	}
	else if (plane == 'yz' || plane == 'zy' || plane == 'YZ' || plane == 'ZY') 
	{
		startPos = new vector3(pos.x, pos.y - (vertical / 2.0), pos.z + (horizontal / 2.0), pos.z);

		while(startPos.z >= -(horizontal / 2.0)) 
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.y += vertical;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.z -= spacing;
		}

		startPos = new vector3(pos.x, pos.y - (vertical / 2.0), pos.z + (horizontal / 2.0), pos.z);

		while(startPos.y <= (vertical / 2.0))
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.z -= horizontal;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.y += spacing;
		}
	}
	else
	{
		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y - (vertical / 2.0), pos.z);

		while(startPos.x <= (horizontal / 2.0)) 
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.y += vertical;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.x += spacing;
		}

		startPos = new vector3(pos.x - (horizontal / 2.0), pos.y - (vertical / 2.0));

		while(startPos.y <= (vertical / 2.0))
		{
			var endPos = new vector3(startPos.x, startPos.y, startPos.z);
			endPos.x += horizontal;

			vertices.push(new vector3(startPos.x, startPos.y, startPos.z));
			vertices.push(new vector3(endPos.x, endPos.y, endPos.z));

			startPos.y += spacing;
		}
	}

	var result = createMesh(vertices, [], null);
	result.mode = gl.LINES;
	return result;
}

/************************************************************************************/

function getBounds(vertices)
{
	var xs = 999999999;
	var ys = 999999999;
	var zs = 999999999;

	var xl = -999999999;
	var yl = -999999999;
	var zl = -999999999;

	for (var i = 0; i < vertices.length; i++) 
	{
		var vertex = vertices[i];

		if(vertex.x > xl)
		{
			xl = vertex.x;
		}
		else if(vertex.x < xs)
		{
			xs = vertex.x;
		}

		if(vertex.y > yl)
		{
			yl = vertex.y;
		}
		else if(vertex.y < ys)
		{
			ys = vertex.y;
		}

		if(vertex.z > zl)
		{
			zl = vertex.z;
		}
		else if(vertex.z < zs)
		{
			zs = vertex.z;
		}			
	}

	var res = [];

	res.push(new vector3(xs, ys, zs));
	res.push(new vector3(xl, yl, zl));

	return res;
}

function addObject(obj, createOnly)
{
	var xmin = 9999999; var xmax = -9999999;
	var ymin = 9999999; var ymax = -9999999;
	var zmin = 9999999; var zmax = -9999999;

	var initScale = 20;
	if(obj == "cube")
	{
		var objectMesh = createMesh( CSGToVertices(CSG.cube({radius: initScale})), CSGToNormals(CSG.cube({radius: initScale})), null );
		
		xmax = initScale; xmin = initScale*-1;
		ymax = initScale; ymin = initScale*-1;
		zmax = initScale; zmin = initScale*-1;

		objectMesh.minBounds = new vector3(xmin, ymin, zmin);
		objectMesh.maxBounds = new vector3(xmax, ymax, zmax);
		objectMesh.mode = gl.TRIANGLES;

		objectMesh.size.x = Math.abs(objectMesh.maxBounds.x - objectMesh.minBounds.x);
		objectMesh.size.y = Math.abs(objectMesh.maxBounds.y - objectMesh.minBounds.y);
		objectMesh.size.z = Math.abs(objectMesh.maxBounds.z - objectMesh.minBounds.z);

		if (createOnly) 
		{
			return objectMesh;
		}
		var index = renderer.renderables.length;

		renderer.addRenderable(new renderable(objectMesh, new vector3(0.3, 0.5, 0.7), new vector3(), new transform(new vector3(), new vector3(-90))));		
	
		renderer.renderables[index].transform.rotate(-90, new vector3(1));
	}
	else if(obj == "pyramid")
	{
		objects.push(pyramidVertices());
		
		var tempnormals = [];
		for(var i=0; i<pyramidVertices().length/3; i++){
			tempnormals.push(1);
		}
		objectsNormals.push(tempnormals);

		lastAddedObject = pyramidVertices();
		var temparray = ["pyramid", pyramidVertices()];
		objectsInfo.push(temparray);
	}
	else if(obj == "cylinder")
	{
		var cylinderHeight = 10;

		var objectMesh = createMesh( CSGToVertices(CSG.cylinder({start: [0, cylinderHeight*-1, 0], end: [0, cylinderHeight, 0], radius: initScale, slices:128})), CSGToNormals(CSG.cylinder({radius: initScale, slices:128})), null );

		xmax = initScale; xmin = initScale*-1;
		ymax = cylinderHeight; ymin = cylinderHeight*-1;
		zmax = initScale; zmin = initScale*-1;

		objectMesh.minBounds = new vector3(xmin, ymin, zmin);
		objectMesh.maxBounds = new vector3(xmax, ymax, zmax);
		objectMesh.mode = gl.TRIANGLES;

		objectMesh.size.x = Math.abs(objectMesh.maxBounds.x - objectMesh.minBounds.x);
		objectMesh.size.y = Math.abs(objectMesh.maxBounds.y - objectMesh.minBounds.y);
		objectMesh.size.z = Math.abs(objectMesh.maxBounds.z - objectMesh.minBounds.z);

		if (createOnly) 
		{
			return objectMesh;
		}

		var index = renderer.renderables.length;

		renderer.addRenderable(new renderable(objectMesh, new vector3(0.3, 0.5, 0.7), new vector3(), new transform(new vector3(), new vector3(-90))));		
	
		renderer.renderables[index].transform.rotate(-90, new vector3(1));
	}
	else if(obj == "sphere")
	{
		var objectMesh = createMesh( CSGToVertices(CSG.sphere({radius: initScale, slices:64, stacks:32})), CSGToNormals(CSG.sphere({radius: initScale,slices:64,stacks:32})), null );
		
		xmax = initScale; xmin = initScale*-1;
		ymax = initScale; ymin = initScale*-1;
		zmax = initScale; zmin = initScale*-1;

		objectMesh.minBounds = new vector3(xmin, ymin, zmin);
		objectMesh.maxBounds = new vector3(xmax, ymax, zmax);
		objectMesh.mode = gl.TRIANGLES;

		objectMesh.size.x = Math.abs(objectMesh.maxBounds.x - objectMesh.minBounds.x);
		objectMesh.size.y = Math.abs(objectMesh.maxBounds.y - objectMesh.minBounds.y);
		objectMesh.size.z = Math.abs(objectMesh.maxBounds.z - objectMesh.minBounds.z);

		if (createOnly) 
		{
			return objectMesh;
		}

		var index = renderer.renderables.length;

		renderer.addRenderable(new renderable(objectMesh, new vector3(0.3, 0.5, 0.7), new vector3(), new transform(new vector3(), new vector3(-90))));		
	
		renderer.renderables[index].transform.rotate(-90, new vector3(1));
	}
	
	// renderer.activeRenderable = renderer.renderables.length-1;
	
	hideTools();
}

function addImported(){
	document.getElementById('fileInput').click();
	hideTools();
}

document.getElementById("fileInput").onchange = function(event){
    var file = document.getElementById("fileInput").files[0];

    var norm = [];
	var vert = [];
	var xmin = 9999999;
	var xmax = -9999999;
	var ymin = 9999999;
	var ymax = -9999999;
	var zmin = 9999999;
	var zmax = -9999999;
    //var buf = new Uint8Array(reader.result);

    var asciiReader = new FileReader();

    asciiReader.onload = function() {

    	if(asciiReader.result.substring(0,5) == "solid" && asciiReader.result.substr(-20).match(/endsolid/gi)){
         	asciiText = asciiReader.result;

         	asciiText = asciiText.replace(/\n/g, " ");

         	asciiText = asciiText.split(" ");

         	for(var i=0; i<asciiText.length; i++){
         		if(asciiText[i] == ""){
         			asciiText.splice(i, 1);
         			i--;
         		}
         	}


         	for(var i=2; i<asciiText.length-2; i++){
         		i+=2;
         		
         		norm.push(mToNum( asciiText[i]) );
         		norm.push(mToNum( asciiText[i+1]) );
         		norm.push(mToNum( asciiText[i+2]) );
         		i+=3;

         		i+=2;
         		for(var v=0; v<3; v++){
         			i+=1;
         			vert.push(mToNum( asciiText[i]) );
         			vert.push(mToNum( asciiText[i+1]) );
         			vert.push(mToNum( asciiText[i+2]) );
         			i+=3;
         		}
         		i+=1;
         	}

         	returnVert();
        }
        else{
         	var binaryReader = new FileReader();
         	
         	binaryReader.onload = function(){

         		var dv = new DataView(binaryReader.result, 80); // 80 == unused header
    			var isLittleEndian = true;

    			noOfTriangles = dv.getUint32(0, isLittleEndian);

    			var offset = 4;
			    for (var i = 0; i < noOfTriangles; i++) {
			        // Get the normal for this triangle by reading 3 32 but floats
			        norm.push(dv.getFloat32(offset, isLittleEndian));
			        norm.push(dv.getFloat32(offset+4, isLittleEndian));
			        norm.push(dv.getFloat32(offset+8, isLittleEndian));
			        offset += 12;

			        // Get all 3 vertices for this triangle, each represented
			        // by 3 32 bit floats.
			        for (var j = 0; j < 3; j++) {
			            vert.push(dv.getFloat32(offset, isLittleEndian));
			            vert.push(dv.getFloat32(offset+4, isLittleEndian));
			            vert.push(dv.getFloat32(offset+8, isLittleEndian));

			            // min 
			            if(xmin > dv.getFloat32(offset, isLittleEndian)){
			            	xmin = dv.getFloat32(offset, isLittleEndian);
			            }
			            if(xmax < dv.getFloat32(offset, isLittleEndian)){
			            	xmax = dv.getFloat32(offset, isLittleEndian);
			            }
			            if(ymin > dv.getFloat32(offset+4, isLittleEndian)){
			            	ymin = dv.getFloat32(offset+4, isLittleEndian);
			            }
			            if(ymax < dv.getFloat32(offset+4, isLittleEndian)){
			            	ymax = dv.getFloat32(offset+4, isLittleEndian);
			            }
			            if(zmin > dv.getFloat32(offset+8, isLittleEndian)){
			            	zmin = dv.getFloat32(offset+8, isLittleEndian);
			            }
			            if(zmax < dv.getFloat32(offset+8, isLittleEndian)){
			            	zmax = dv.getFloat32(offset+8, isLittleEndian);
			            }

			            offset += 12;
			        }

			        // there's also a Uint16 "attribute byte count" that we
			        // don't need, it should always be zero.
			        offset += 2;
			    }

			    returnVert();
         	}
         	binaryReader.readAsArrayBuffer(file);
        }

    }
    asciiReader.readAsText(file);


    function returnVert()
    {
    	// center the object
	    xdiff = ( xmax + xmin ) /2;
		ydiff = ( ymax + ymin ) /2;
		zdiff = ( zmax + zmin ) /2;

		for(var i=0; i<vert.length; i+=3){
			vert[i] -= xdiff;
			vert[i+1] -= ydiff;
			vert[i+2] -= zdiff;
		}

		var vertArray = vert.slice(0);
		var normArray = norm.slice(0);

		var vertObject = [];
		var normObject = [];
		// var texcoords = [];

		//console.log("1");
		for(var i=0; i<vertArray.length; i+=3){
			vertObject.push(new vector3(vertArray[i], vertArray[i+1], vertArray[i+2]));
		}
		//console.log("2");

		for(var i=0; i<normArray.length; i+=3){
			normObject.push(new vector3(normArray[i], normArray[i+1], normArray[i+2]));
			normObject.push(new vector3(normArray[i], normArray[i+1], normArray[i+2]));
			normObject.push(new vector3(normArray[i], normArray[i+1], normArray[i+2]));
		}

		// for (var i = 0; i < vertObject.length; i++) {
		// 	texcoords.push(new vector2());
		// }

		var mesh = createMesh(vertObject, normObject, null);

		var index = renderer.renderables.length;

		var bounds = getBounds(mesh.vertices);

		mesh.minBounds = bounds[0];
		mesh.maxBounds = bounds[1];
		mesh.mode = gl.TRIANGLES;

		mesh.size.x = Math.abs(mesh.maxBounds.x - mesh.minBounds.x);
		mesh.size.y = Math.abs(mesh.maxBounds.z - mesh.minBounds.z);
		mesh.size.z = Math.abs(mesh.maxBounds.y - mesh.minBounds.y);

		var index = renderer.renderables.length;

		renderer.addRenderable(new renderable(mesh, new vector3(0.3, 0.5, 0.7), new vector3(), new transform(new vector3(0, 0, 0), new vector3(-90, 0, 0), new vector3(1, 1, 1))));
	
		renderer.renderables[index].transform.rotate(-90, new vector3(1));

		renderer.renderables[index].boundingBox.size.x = mesh.size.x;
		renderer.renderables[index].boundingBox.size.y = mesh.size.z;
		renderer.renderables[index].boundingBox.size.z = mesh.size.y;
	}

	document.getElementById('fileInput').value = "";
}

//=====================================================

function VerticesToCSG(verts, norms, transform){
	var vertV = [];
	var normV = [];

	var modelMat = transform.getModelMatrix();

	for (var i = 0; i < verts.length; i++) 
	{
		var newVert = multiply_M4_V3(modelMat, verts[i]);
		
		vertV.push(newVert.x);	
		vertV.push(newVert.y);	
		vertV.push(newVert.z);	

		if (i % 3 == 0)
		{
			var newNorm = multiply_M4_V3(modelMat, norms[i]);

			normV.push(newNorm.x);	
			normV.push(newNorm.y);	
			normV.push(newNorm.z);
		}
	}

	var polygonsC = [];
	var normVIndex = 0;
	for(var i=0; i<vertV.length; i+=9){
		polygonsC.push(new CSG.Polygon([new CSG.Vertex(new CSG.Vector(vertV[i+0],vertV[i+1],vertV[i+2]), new CSG.Vector(normV[i],normV[i+1],normV[i+2])), new CSG.Vertex(new CSG.Vector(vertV[i+3],vertV[i+4],vertV[i+5]), new CSG.Vector(normV[i],normV[i+1],normV[i+2])), new CSG.Vertex(new CSG.Vector(vertV[i+6],vertV[i+7],vertV[i+8]), new CSG.Vector(normV[i],normV[i+1],normV[i+2]))]) );
		normVIndex+=3;
	}

	return polygonsC;
}

// polygon"C" for CSG
function CSGToVertices(polygonsC, transform){
	var polygonsV = [];

	if(polygonsC.polygons){
		// not polygons (sphere or cube)
		polygonsC = polygonsC.polygons;
	}

	// for polygons
	for(var i=0; i<polygonsC.length; i++){
		if(polygonsC[i].vertices.length == 3){
			for(var k=0; k<polygonsC[i].vertices.length; k++){
				polygonsV.push(polygonsC[i].vertices[k].pos.x);
				polygonsV.push(polygonsC[i].vertices[k].pos.y);
				polygonsV.push(polygonsC[i].vertices[k].pos.z);
			}
		}
		else if(polygonsC[i].vertices.length == 4){
			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[1].pos.x);
			polygonsV.push(polygonsC[i].vertices[1].pos.y);
			polygonsV.push(polygonsC[i].vertices[1].pos.z);

			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);
			
			// second traingle
			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);

			polygonsV.push(polygonsC[i].vertices[3].pos.x);
			polygonsV.push(polygonsC[i].vertices[3].pos.y);
			polygonsV.push(polygonsC[i].vertices[3].pos.z);
		}
		else if(polygonsC[i].vertices.length == 5){
			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[1].pos.x);
			polygonsV.push(polygonsC[i].vertices[1].pos.y);
			polygonsV.push(polygonsC[i].vertices[1].pos.z);

			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);

			// 2
			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[3].pos.x);
			polygonsV.push(polygonsC[i].vertices[3].pos.y);
			polygonsV.push(polygonsC[i].vertices[3].pos.z);

			polygonsV.push(polygonsC[i].vertices[4].pos.x);
			polygonsV.push(polygonsC[i].vertices[4].pos.y);
			polygonsV.push(polygonsC[i].vertices[4].pos.z);

			// 3
			polygonsV.push(polygonsC[i].vertices[4].pos.x);
			polygonsV.push(polygonsC[i].vertices[4].pos.y);
			polygonsV.push(polygonsC[i].vertices[4].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);

			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);
		}
		else if(polygonsC[i].vertices.length == 6){
			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[1].pos.x);
			polygonsV.push(polygonsC[i].vertices[1].pos.y);
			polygonsV.push(polygonsC[i].vertices[1].pos.z);

			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);

			// 2
			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[3].pos.x);
			polygonsV.push(polygonsC[i].vertices[3].pos.y);
			polygonsV.push(polygonsC[i].vertices[3].pos.z);

			polygonsV.push(polygonsC[i].vertices[4].pos.x);
			polygonsV.push(polygonsC[i].vertices[4].pos.y);
			polygonsV.push(polygonsC[i].vertices[4].pos.z);

			// 3
			polygonsV.push(polygonsC[i].vertices[4].pos.x);
			polygonsV.push(polygonsC[i].vertices[4].pos.y);
			polygonsV.push(polygonsC[i].vertices[4].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[5].pos.x);
			polygonsV.push(polygonsC[i].vertices[5].pos.y);
			polygonsV.push(polygonsC[i].vertices[5].pos.z);

			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
			
			// 4
			polygonsV.push(polygonsC[i].vertices[4].pos.x);
			polygonsV.push(polygonsC[i].vertices[4].pos.y);
			polygonsV.push(polygonsC[i].vertices[4].pos.z);
			
			polygonsV.push(polygonsC[i].vertices[2].pos.x);
			polygonsV.push(polygonsC[i].vertices[2].pos.y);
			polygonsV.push(polygonsC[i].vertices[2].pos.z);

			polygonsV.push(polygonsC[i].vertices[0].pos.x);
			polygonsV.push(polygonsC[i].vertices[0].pos.y);
			polygonsV.push(polygonsC[i].vertices[0].pos.z);
		}
	}
	
	var polygonsVR = []; 

	if (transform != undefined)
	{
		var modMat = transform.getModelMatrix();

		for(var i=0; i<polygonsV.length; i+=3)
		{
			var vert = new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]);
			var newVert = multiply_M4_V3(modMat, vert);
			polygonsVR.push(newVert);
		}
	}
	else
	{
		for(var i=0; i<polygonsV.length; i+=3){
			polygonsVR.push(new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]));
		}
	}
	
	return polygonsVR;
}


// polygon"C" for CSG getting the normal of an CSG objects
function CSGToNormals(polygonsC, transform){
	var polygonsV = [];

	if(polygonsC.polygons){
		// not polygons (sphere or cube)
		polygonsC = polygonsC.polygons;
	}

	// for polygons
	for(var i=0; i<polygonsC.length; i++){
		if(polygonsC[i].vertices.length == 3){
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
		}
		else if(polygonsC[i].vertices.length == 4){
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
			
			// second traingle
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
		}
		else if(polygonsC[i].vertices.length == 5){
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);

			// 2
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);

			// 3
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
		}
		else if(polygonsC[i].vertices.length == 6){
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);

			// 2
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);

			// 3
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
			
			// 4
			polygonsV.push(polygonsC[i].plane.normal.x);
			polygonsV.push(polygonsC[i].plane.normal.y);
			polygonsV.push(polygonsC[i].plane.normal.z);
		}
	}

	var polygonsVR = [];
	
	if (transform != undefined)
	{
		var modMat = transform.getModelMatrix();
		 
		for(var i=0; i<polygonsV.length; i+=3){
			var norm = new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]);
			var newNorm = multiply_M4_V3(modMat, norm);
			polygonsVR.push(newNorm);
			polygonsVR.push(newNorm);
			polygonsVR.push(newNorm);
		}
	}
	else
	{
		for(var i=0; i<polygonsV.length; i+=3){
			polygonsVR.push(new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]));
			polygonsVR.push(new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]));
			polygonsVR.push(new vector3(polygonsV[i], polygonsV[i+1], polygonsV[i+2]));
		}
	}

	return polygonsVR;
}