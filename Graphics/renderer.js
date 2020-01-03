var renderable = function(mesh, color, wireColor, transform)
{
	this.mesh = mesh;
	this.boundingBox = createWireCuboid(new vector3(), new vector3(this.mesh.maxBounds.x - this.mesh.minBounds.x
																		, this.mesh.maxBounds.y - this.mesh.minBounds.y
																		, this.mesh.maxBounds.z - this.mesh.minBounds.z));

	this.transform = transform;
	this.color = color;
	this.wireColor = wireColor;
	this.texture = undefined;
	this.renderWire = false;
	this.editMode = false;
	this.id = 0;
}

var transformationAxis = function()
{
	this.hidden = true;
	this.axis = [];
	this.axisHeads = [];

	this.activeAxis = -1;
	this.transform = new transform();
	this.axisSize = 20;
	this.axisWidth = 6;
	this.planeSize = 10;

	this.init = function()
	{
		var aX_mesh = addObject('cylinder', true);
		// aX.mesh.minBounds.x -= 2000;
		aX_mesh.maxBounds.y += 5;
		var aX = new renderable(aX_mesh, new vector3(1, 0, 0), new vector3(), new transform(new vector3(30, 0, 0)));
		aX.transform.scale.y = 1.6;
		aX.transform.scale.x = 0.05;
		aX.transform.scale.z = 0.05;
		aX.transform.rotation.z = 90;
		aX.transform.rotate(aX.transform.rotation.z, new vector3(0, 0, 1));
		// aX.mesh.minBounds.x -= 2000;
		// aX.mesh.maxBounds.x += 2000;

		var aY_mesh = addObject('cylinder', true);
		// aX.mesh.minBounds.x -= 2000;
		aY_mesh.maxBounds.y += 5;
		var aY = new renderable(aY_mesh, new vector3(0, 1, 0), new vector3(), new transform(new vector3(0, 30, 0)));
		aY.transform.scale.y = 1.6;
		aY.transform.scale.x = 0.05;
		aY.transform.scale.z = 0.05;
		aY.transform.rotation.z = 0;

		// aY.mesh.minBounds.y -= 2000;
		// aY.mesh.maxBounds.y += 2000;

		var aZ_mesh = addObject('cylinder', true);
		// aX.mesh.minBounds.x -= 2000;
		aZ_mesh.maxBounds.y += 5;
		var aZ = new renderable(aZ_mesh, new vector3(0, 0, 1), new vector3(), new transform(new vector3(0, 0, 30)));
		aZ.transform.scale.y = 1.6;
		aZ.transform.scale.x = 0.05;
		aZ.transform.scale.z = 0.05;
		aZ.transform.rotation.x = 90;
		aZ.transform.rotate(aZ.transform.rotation.x, new vector3(1, 0, 0));

		// aZ.mesh.minBounds.z -= 2000;
		// aZ.mesh.maxBounds.z += 2000;

		var hX_mesh = createCone(new vector3(1, 0, 0), new vector3(5, 0, 0), 7, 2, 50);
		// hX_mesh[0].minBounds.x -= 30;
		// hX_mesh[0].maxBounds.x -= 5;
	
		var hY_mesh = createCone(new vector3(0, 1, 0), new vector3(0, 5, 0), 7, 2, 50);
		// hY_mesh[0].minBounds.y -= 15;
		// hY_mesh[0].maxBounds.y += 15;
	
		var hZ_mesh = createCone(new vector3(0, 0, 1), new vector3(0, 0, 5), 7, 2, 50);
		// hZ_mesh[0].minBounds.z -= 15;
		// hZ_mesh[0].maxBounds.z += 15;

		var hX = new renderable(hX_mesh[0], new vector3(1, 0, 0), new vector3(), new transform(new vector3(25)));
		var hY = new renderable(hY_mesh[0], new vector3(0, 1, 0), new vector3(), new transform(new vector3(0, 25)));
		var hZ = new renderable(hZ_mesh[0], new vector3(0, 0, 1), new vector3(), new transform(new vector3(0, 0, 25)));

		this.axis.push(aX);
		this.axis.push(aY);
		this.axis.push(aZ);

		this.axisHeads.push(hX);
		this.axisHeads.push(hY);
		this.axisHeads.push(hZ);
	}
}

var renderer = function()
{
	this.mainCamera = new camera();
	this.renderables = [];
	this.activeRenderable = -1;
	this.worldTransform = new transform(new vector3(0, 0, -50));
	this.minBounds = new vector3();
	this.maxBounds = new vector3();
	this.wireShader;
	this.phongShader;
	this.oldMousePos = [0, 0];
	this.oldMousePos1 = [0, 0];
	this.mode = 'world';
	this.selected = false;
	this.axisSelected = false;
	this.transformAxis = new transformationAxis();

	this.setMainCamera = function(cam)
	{
		this.mainCamera = cam;
	}

	this.init = function()
	{
		this.wireShader = new BasicShader();
		this.wireShader.init();

		this.phongShader = new DirectionalShader();
		this.phongShader.init();

		this.transformAxis.init();
	}

	this.render = function(renderable, shader, clipPlanes, separate)
	{		
		var temp;
		var tempRot = this.worldTransform.rotation;

		if(renderable.renderWire == true)
		{
			temp = new vector3(renderable.color.x, renderable.color.y, renderable.color.z);			
		}

		if (clipPlanes)
		{
			if (separate) 
			{
				this.worldTransform.rotation = new vector3();
			}

			shader.updateUniforms(renderable, this.worldTransform, this.mainCamera, clipPlanes);
		
			this.worldTransform.rotation = tempRot;
		}
		else
		{
			if (separate) 
			{
				this.worldTransform.rotation = new vector3();
			}

			shader.updateUniforms(renderable, this.worldTransform, this.mainCamera);

			this.worldTransform.rotation = tempRot;
		}

		if(renderable.renderWire == false)
		{
			renderable.mesh.bindBuffers();
			gl.drawArrays(renderable.mesh.mode, 0, renderable.mesh.vertices.length);
			renderable.mesh.unbindBuffers();
		}
		else
		{
			renderable.mesh.bindBuffers();
			gl.drawArrays(renderable.mesh.mode, 0, renderable.mesh.vertices.length);
			renderable.mesh.unbindBuffers();

			renderable.color = new vector3(renderable.wireColor.x, renderable.wireColor.y, renderable.wireColor.z);
			
			if (separate) 
			{
				this.worldTransform.rotation = new vector3();
			}

			this.wireShader.updateUniforms(renderable, this.worldTransform, this.mainCamera);

			this.worldTransform.rotation = tempRot;

			renderable.boundingBox.bindBuffers();
			gl.lineWidth(1.0);
			gl.drawArrays(renderable.boundingBox.mode, 0, renderable.boundingBox.vertices.length);
			
			renderable.color = new vector3(temp.x, temp.y, temp.z);
			
			renderable.boundingBox.unbindBuffers();
		}				
	}

	this.resetBounds = function()
	{
		if(this.renderables.length > 0)
		{
			this.minBounds = new vector3(999999999, 999999999, 999999999);	
			this.maxBounds = new vector3(-999999999, -999999999, -999999999);	

			for (var i = 0; i < this.renderables.length; i++) 
			{
				var model = this.renderables[i].transform.getModelMatrix();

				// var nbl = new vector3(this.renderables[i].mesh.minBounds.x, this.renderables[i].mesh.minBounds.y, this.renderables[i].mesh.minBounds.z);
				// var nbr = new vector3(nbl.x + this.renderables[i].mesh.size.x, nbl.y, nbl.z);
				// var ntl = new vector3(nbl.x, nbl.y + this.renderables[i].mesh.size.y, nbl.z);
				// var ntr = new vector3(nbl.x + this.renderables[i].mesh.size.x, nbl.y + this.renderables[i].mesh.size.y, nbl.z);
				
				// var ptr = new vector3(ntr.x, ntr.y, ntr.z + this.renderables[i].mesh.size.z);
				// var ptl = new vector3(ntl.x, ntl.y, ntl.z + this.renderables[i].mesh.size.z);
				// var pbr = new vector3(nbr.x, nbr.y, nbr.z + this.renderables[i].mesh.size.z);
				// var pbl = new vector3(nbl.x, nbl.y, nbl.z + this.renderables[i].mesh.size.z);				
		
				// nbl = multiply_M4_V3(model, nbl);
				// nbr = multiply_M4_V3(model, nbr);
				// ntl = multiply_M4_V3(model, ntl);
				// ntr = multiply_M4_V3(model, ntr);

				// ptr = multiply_M4_V3(model, ptr);
				// ptl = multiply_M4_V3(model, ptl);
				// pbr = multiply_M4_V3(model, pbr);
				// pbl = multiply_M4_V3(model, pbl);

				// var dir1 = subtractV3(pbl, nbl);
				// var dir2 = subtractV3(pbr, nbr);
				// var dir3 = subtractV3(ptl, ntl);
				// var dir4 = subtractV3(ptr, ntr);

				// dir1 = multiply_M4_V3(quaternionToRotMat(this.renderables[i].transform.rotationQuat), dir1);
				// dir2 = multiply_M4_V3(quaternionToRotMat(this.renderables[i].transform.rotationQuat), dir2);
				// dir3 = multiply_M4_V3(quaternionToRotMat(this.renderables[i].transform.rotationQuat), dir3);
				// dir4 = multiply_M4_V3(quaternionToRotMat(this.renderables[i].transform.rotationQuat), dir4);

				// ptr = addV3(ntr, multiply_t_V3(this.renderables[i].boundingBox.size.z, dir4));
				// ptl = addV3(ntr, multiply_t_V3(this.renderables[i].boundingBox.size.z, dir3));
				// pbr = addV3(ntr, multiply_t_V3(this.renderables[i].boundingBox.size.z, dir2));
				// pbl = addV3(ntr, multiply_t_V3(this.renderables[i].boundingBox.size.z, dir1));

				var verts = [];

				for (var j = 0; j < this.renderables[i].boundingBox.vertices.length; j++) 
				{
					var v = multiply_M4_V3(model, this.renderables[i].boundingBox.vertices[j]);
					verts.push(v);
				}

				// verts.push(nbl);
				// verts.push(nbr);
				
				// verts.push(ntl);
				// verts.push(ntr);
				
				// verts.push(ptl);
				// verts.push(ptr);

				// verts.push(pbl);
				// verts.push(pbr);

				var b = getBounds(verts);

				var mn = b[0];
				var mx = b[1];

				if (mn.x < this.minBounds.x) 
				{
					this.minBounds.x = mn.x; 
				}	

				if (mn.y < this.minBounds.y) 
				{
					this.minBounds.y = mn.y; 
				}	

				if (mn.z < this.minBounds.z) 
				{
					this.minBounds.z = mn.z; 
				}	

				if (mx.x > this.maxBounds.x) 
				{
					this.maxBounds.x = mx.x; 
				}

				if (mx.y > this.maxBounds.y) 
				{
					this.maxBounds.y = mx.y; 
				}

				if (mx.z > this.maxBounds.z) 
				{
					this.maxBounds.z = mx.z; 
				}	
			}
		}	
	}

	this.update = function()
	{
		if (inputManager.isButtonUp(0)) 
		{
			this.selected = true;
		}

		this.mainCamera.update();
		this.selectObject();
		this.selectAxis();

		if (inputManager.isKeyDown('KeyN'))
		{
			this.mode = 'world';
		}
		else if (inputManager.isKeyDown('KeyT'))
		{
			this.mode = 'trans';
		}
		else if (inputManager.isKeyDown('KeyR'))
		{
			this.mode = 'rot';
		}
		else if (inputManager.isKeyDown('KeyS'))
		{
			this.mode = 'scale';
		}

		if (this.mode == 'world') 
		{
			this.transformWorld();
		}
		else if (this.mode == 'trans')
		{
			//this.transformWorld();

			this.translationMode();
		}
		else if (this.mode == 'rot')
		{
			//this.transformWorld();
			
			this.rotationMode();
		}
		else if (this.mode == 'scale')
		{
			//this.transformWorld();
			
			this.scaleMode();
		}

		this.resetBounds();

		this.selected = false;	
	}

	this.renderAll = function(shader, clipPlanes)
	{
		for (var i = 0; i < this.renderables.length; i++) 
		{
			this.render(this.renderables[i], shader, clipPlanes);	
			if (this.renderables[i].renderAxis == true && this.mode != 'world') 
			{
				this.render(this.transformAxis.axis[0], this.phongShader, null, 1);
				this.render(this.transformAxis.axis[1], this.phongShader, null, 1);
				this.render(this.transformAxis.axis[2], this.phongShader, null, 1);

				this.render(this.transformAxis.axisHeads[0], this.phongShader, null, 1);
				this.render(this.transformAxis.axisHeads[1], this.phongShader, null, 1);
				this.render(this.transformAxis.axisHeads[2], this.phongShader, null, 1);
			}			
		}
	}

	this.addRenderable = function(_renderable)
	{
		_renderable.id = this.renderables.length;

		_renderable.transform.position.y = slicer.slicerVolume.volume.mesh.minBounds.y + (_renderable.boundingBox.size.z / 2.0);
		
		this.renderables.push(_renderable);
	}

	this.removeRenderable = function(id)
	{
		var index = -1;
		
		if (this.renderables[id] != undefined) 
		{
			index = 0;
		}

		if (index != -1) 
		{
			this.renderables[id].mesh.deleteBuffers();
			this.renderables.splice(id, 1);
		}
	}

	this.OBBItersectionTest = function(origin, direction, renderable, separate)
	{
		var tempRot = this.worldTransform.rotation;
		var tMin = 0.0;
		var tMax = 10000000.0;

		var intersected = false;
		if (separate) 
		{
			this.worldTransform.rotation = new vector3();
		}

		var transMat = multiplyM4(multiplyM4(rotation(renderable.transform.rotation), translation(renderable.transform.position)), this.worldTransform.getModelMatrix());

		var obbCenter = new vector3(transMat.elements[3][0], transMat.elements[3][1], transMat.elements[3][2]);

		var delta = subtractV3(obbCenter, origin);
		
		this.worldTransform.rotation = tempRot;

		///////////////////////////////////////////////////////

		var xAxis = new vector3(transMat.elements[0][0], transMat.elements[0][1], transMat.elements[0][2]);

		var e = dot(xAxis, delta);
		var f = dot(xAxis, direction);

		if(Math.abs(f) > 0.000000001)
		{
			var t1 = (e + (renderable.transform.scale.x * renderable.mesh.minBounds.x)) / f;
			var t2 = (e + (renderable.transform.scale.x * renderable.mesh.maxBounds.x)) / f;

			if(t1 > t2)
			{
				var temp = t1;
				t1 = t2;
				t2 = temp;
			}

			if (t2 < tMax) 
			{
				tMax = t2;
			}

			if (t1 > tMin) 
			{
				tMin = t1;
			}

			if (tMin < tMax) 
			{
				intersected = true;
			}
			else
			{
				intersected = false;
			}
		}
		else
		{
			if (-e + (renderable.transform.scale.x * renderable.mesh.minBounds.x) > 0.0 || -e + (renderable.transform.scale.x * renderable.mesh.maxBounds.x)) 
			{
				intersected = false;
			}
		}

		////////////////////////////////////////////////////////////

		var yAxis = new vector3(transMat.elements[1][0], transMat.elements[1][1], transMat.elements[1][2]);

		var e1 = dot(yAxis, delta);
		var f1 = dot(yAxis, direction);

		if(Math.abs(f1) > 0.000000001)
		{
			var t1 = (e1 + (renderable.transform.scale.y * renderable.mesh.minBounds.y)) / f1;
			var t2 = (e1 + (renderable.transform.scale.y * renderable.mesh.maxBounds.y)) / f1;

			if(t1 > t2)
			{
				var temp = t1;
				t1 = t2;
				t2 = temp;
			}

			if (t2 < tMax) 
			{
				tMax = t2;
			}

			if (t1 > tMin) 
			{
				tMin = t1;
			}

			if (tMin < tMax) 
			{
				intersected = true;
			}
			else
			{
				intersected = false;
			}
		}
		else
		{
			if (-e1 + (renderable.transform.scale.y * renderable.mesh.minBounds.y) > 0.0 || -e1 + (renderable.transform.scale.y * renderable.mesh.maxBounds.y)) 
			{
				intersected = false;
			}
		}

		////////////////////////////////////////////////////////////////

		var zAxis = new vector3(transMat.elements[2][0], transMat.elements[2][1], transMat.elements[2][2]);

		var e2 = dot(zAxis, delta);
		var f2 = dot(zAxis, direction);

		if(Math.abs(f2) > 0.000000001)
		{
			var t1 = (e2 + (renderable.transform.scale.z * renderable.mesh.minBounds.z)) / f2;
			var t2 = (e2 + (renderable.transform.scale.z * renderable.mesh.maxBounds.z)) / f2;

			if(t1 > t2)
			{
				var temp = t1;
				t1 = t2;
				t2 = temp;
			}

			if (t2 < tMax) 
			{
				tMax = t2;
			}

			if (t1 > tMin) 
			{
				tMin = t1;
			}

			if (tMin < tMax) 
			{
				intersected = true;
			}
			else
			{
				intersected = false;
			}
		}
		else
		{
			if (-e2 + (renderable.transform.scale.z * renderable.mesh.minBounds.z) > 0.0 || -e2 + (renderable.transform.scale.z * renderable.mesh.maxBounds.z)) 
			{
				intersected = false;
			}
		}

		///////////////////////////////////////////////////

		var res = [];
		res.push(tMin);
		res.push(intersected);

		return res;
	}

	this.transformAxisIntersection = function(origin, direction, transformAxis)
	{
		var currAxis = -1;

		var resX = this.OBBItersectionTest(origin, direction, transformAxis.axis[0], 1);

		if (resX[1] == true) 
		{
			currAxis = 0;
		}	

		var resY = this.OBBItersectionTest(origin, direction, transformAxis.axis[1], 1);

		if (resY[1] == true) 
		{
			currAxis = 1;
		}		

		var resZ = this.OBBItersectionTest(origin, direction, transformAxis.axis[2], 1);

		if (resZ[1] == true) 
		{
			currAxis = 2;
		}	

		var result = [];
		
		result.push(resX);
		result.push(resY);
		result.push(resZ);

		return currAxis;		
	}

	this.selectAxis = function()
	{
		var resPos = inputManager.getProjectedMousePos(this.mainCamera);

		if (this.activeRenderable != -1) 
		{
			var axis = -1;
			var index = -1;

			if (this.transformAxis.activeAxis == -1) 
			{	
				axis = this.transformAxisIntersection(this.mainCamera.viewData.position, resPos, this.transformAxis);
			}
			else
			{
				axis = this.transformAxis.activeAxis;
			}

			index = axis;

			if (index == 0 && inputManager.isButtonDown(0) == true) 
			{
				this.transformAxis.activeAxis = 0;
					
				this.transformAxis.axis[0].renderWire = true;
				this.transformAxis.axis[1].renderWire = false;
				this.transformAxis.axis[2].renderWire = false;
			}
			else if (index == 1 && inputManager.isButtonDown(0) == true) 
			{
				this.transformAxis.activeAxis = 1;
					
				this.transformAxis.axis[0].renderWire = false;
				this.transformAxis.axis[1].renderWire = true;
				this.transformAxis.axis[2].renderWire = false;
			}			
			else if (index == 2 && inputManager.isButtonDown(0) == true) 
			{
				this.transformAxis.activeAxis = 2;
					
				this.transformAxis.axis[0].renderWire = false;
				this.transformAxis.axis[1].renderWire = false;
				this.transformAxis.axis[2].renderWire = true;
			}
			else
			{
				this.transformAxis.activeAxis = -1;

				this.transformAxis.axis[0].renderWire = false;
				this.transformAxis.axis[1].renderWire = false;
				this.transformAxis.axis[2].renderWire = false;
			}
		}
	}

	this.selectObject = function()
	{
		var resPos = inputManager.getProjectedMousePos(this.mainCamera);
		if (this.selected == true) 
		{
			var min = 999999999;
			var current = -1;

			for (var i = 0; i < this.renderables.length; i++) 
			{
				var res = this.OBBItersectionTest(this.mainCamera.viewData.position, resPos, this.renderables[i]);

				if (res[1] == true) 
				{
					if (res[0] <= min) 
					{
						min = res;
						current = i;
					}
				}				

				if (this.activeRenderable != i) 
				{
					this.renderables[i].renderWire = false;
					this.renderables[i].renderAxis = false;	
				}							
			}

			if(current != -1 && this.activeRenderable != current)
			{
				this.activeRenderable = current;
				this.renderables[current].renderWire = true;
				this.renderables[current].renderAxis = true;				
			}
			else if(current != -1 && this.activeRenderable == current && this.renderables[current].editMode == false)
			{
				this.activeRenderable = -1;
				this.renderables[current].renderWire = false;
				this.renderables[current].renderAxis = false;
			}
		}
		if (this.activeRenderable != -1) 
		{
			var up = ((this.renderables[this.activeRenderable].boundingBox.maxBounds.y * this.renderables[this.activeRenderable].transform.scale.z) + 20);
			var right = 0;
			var front = 0;

			this.transformAxis.axis[0].transform.position = addV3(new vector3(10 + right, 0 + up, 0 + front), this.renderables[this.activeRenderable].transform.position);
			this.transformAxis.axis[1].transform.position = addV3(new vector3(0 + right, 10 + up, 0 + front), this.renderables[this.activeRenderable].transform.position);
			this.transformAxis.axis[2].transform.position = addV3(new vector3(0 + right, 0 + up, 10 + front), this.renderables[this.activeRenderable].transform.position);
	
			this.transformAxis.axisHeads[0].transform.position = addV3(new vector3(25 + right, 0 + up, 0 + front), this.renderables[this.activeRenderable].transform.position);
			this.transformAxis.axisHeads[1].transform.position = addV3(new vector3(0 + right, 25 + up, 0 + front), this.renderables[this.activeRenderable].transform.position);
			this.transformAxis.axisHeads[2].transform.position = addV3(new vector3(0 + right, 0 + up, 25 + front), this.renderables[this.activeRenderable].transform.position);
		}	
	}

	this.transformWorld = function()
	{
		var pos = inputManager.getMousePos();
		
		if (this.oldMousePos[0] != pos[0] || this.oldMousePos[1] != pos[1]) 
		{
			if (inputManager.isButtonDown(2)) 
			{				
				var xAxis = 1;
				var yAxis = 1;
				xAxis = (pos[0] - this.oldMousePos[0]);
				yAxis = (pos[1] - this.oldMousePos[1]);
				
				var speed = 5.0 / 60.0;

				var tempX = (speed * yAxis);
				var tempY = (speed * xAxis);

				this.worldTransform.rotation.x += tempX;
				this.worldTransform.rotation.y += tempY;
			
				if (this.worldTransform.rotation.x >= 89.0) 
				{					
					this.worldTransform.rotation.x = 89.0;
				}
				else if(this.worldTransform.rotation.x <= -89.0)
				{
					this.worldTransform.rotation.x = -89.0;
				}

				var rx = rotateQ(this.worldTransform.rotation.x, new vector3(1, 0, 0));
				var ry = rotateQ(this.worldTransform.rotation.y, new vector3(0, 1, 0));

				var rq = multiplyQ(rx, ry);
				this.worldTransform.rotationQuat = rq;
			}
			else if (inputManager.isButtonDown(1)) 
			{				
				var xAxis = 1;
				var yAxis = 1;
				xAxis = (pos[0] - this.oldMousePos[0]);
				yAxis = (pos[1] - this.oldMousePos[1]);
				
				var speed = 15.0 / 60.0;

				this.worldTransform.position.x += speed * xAxis;
				this.worldTransform.position.y -= speed * yAxis;
			}

			this.oldMousePos[0] = pos[0];
			this.oldMousePos[1] = pos[1];
		}
	}

	this.translationMode = function()
	{
		var pos = inputManager.getMousePos();
		
		if (this.oldMousePos[0] != pos[0] || this.oldMousePos[1] != pos[1]) 
		{	
			if (inputManager.isButtonDown(0) && this.activeRenderable != -1) 
			{							
				var xAxis = 1;
				var yAxis = 1;
				xAxis = (pos[0] - this.oldMousePos[0]);
				yAxis = (pos[1] - this.oldMousePos[1]);
				
				var speed = 15.0 / 60.0;

				var axisPos;
				var rendPos;
				var dir;
				if (this.transformAxis.activeAxis == 0) 
				{
					this.transformAxis.axis[0].transform.position.x += (speed * xAxis);
					this.transformAxis.axis[1].transform.position.x += (speed * xAxis);
					this.transformAxis.axis[2].transform.position.x += (speed * xAxis);

					this.transformAxis.axisHeads[0].transform.position.x += (speed * xAxis);
					this.transformAxis.axisHeads[1].transform.position.x += (speed * xAxis);
					this.transformAxis.axisHeads[2].transform.position.x += (speed * xAxis);

					this.renderables[this.activeRenderable].transform.translate(speed * xAxis, new vector3(1, 0, 0));// = addV3(rendPos, multiply_t_V3(speed * xAxis, dir));
				}
				else if (this.transformAxis.activeAxis == 1) 
				{
					this.transformAxis.axis[0].transform.position.y -= (speed * yAxis);
					this.transformAxis.axis[1].transform.position.y -= (speed * yAxis);
					this.transformAxis.axis[2].transform.position.y -= (speed * yAxis);

					this.transformAxis.axisHeads[0].transform.position.y -= (speed * yAxis);
					this.transformAxis.axisHeads[1].transform.position.y -= (speed * yAxis);
					this.transformAxis.axisHeads[2].transform.position.y -= (speed * yAxis);

					this.renderables[this.activeRenderable].transform.translate(speed * yAxis, new vector3(0, -1, 0));
				}
				else if (this.transformAxis.activeAxis == 2) 
				{
					this.transformAxis.axis[0].transform.position.z += (speed * yAxis);
					this.transformAxis.axis[1].transform.position.z += (speed * yAxis);
					this.transformAxis.axis[2].transform.position.z += (speed * yAxis);

					this.transformAxis.axisHeads[0].transform.position.z += (speed * yAxis);
					this.transformAxis.axisHeads[1].transform.position.z += (speed * yAxis);
					this.transformAxis.axisHeads[2].transform.position.z += (speed * yAxis);

					this.renderables[this.activeRenderable].transform.translate(speed * yAxis, new vector3(0, 0, 1));
				}	
			}

			this.oldMousePos[0] = pos[0];
			this.oldMousePos[1] = pos[1];
		}
	}

	this.scaleMode = function()
	{
		var pos = inputManager.getMousePos();

		if (this.oldMousePos[0] != pos[0] || this.oldMousePos[1] != pos[1]) 
		{
			if (inputManager.isButtonDown(0) && this.activeRenderable != -1) 
			{				
				var xAxis = 1;
				var yAxis = 1;
				xAxis = (pos[0] - this.oldMousePos[0]);
				yAxis = (pos[1] - this.oldMousePos[1]);
				
				var speed = 1.0 / 160.0;

				if (this.transformAxis.activeAxis == 0) 
				{
					this.renderables[this.activeRenderable].transform.scale.x += (speed * xAxis);
				}
				else if (this.transformAxis.activeAxis == 1) 
				{
					this.renderables[this.activeRenderable].transform.scale.z -= (speed * yAxis);
				}
				else if (this.transformAxis.activeAxis == 2) 
				{
					this.renderables[this.activeRenderable].transform.scale.y += (speed * yAxis);
				}
			}

			this.oldMousePos[0] = pos[0];
			this.oldMousePos[1] = pos[1];
		}
	}

	this.rotationMode = function()
	{
		var pos = inputManager.getMousePos();

		if (this.oldMousePos[0] != pos[0] || this.oldMousePos[1] != pos[1]) 
		{
			if (inputManager.isButtonDown(0) && this.activeRenderable != -1) 
			{				
				var xAxis = 1;
				var yAxis = 1;
				xAxis = (pos[0] - this.oldMousePos[0]);
				yAxis = (pos[1] - this.oldMousePos[1]);
				
				var speed = 30.0 / 60.0;

				if (this.transformAxis.activeAxis == 0) 
				{
					this.renderables[this.activeRenderable].transform.rotation.x += (speed * yAxis);
					this.renderables[this.activeRenderable].transform.rotate((speed * yAxis), new vector3(1));
				}
				else if (this.transformAxis.activeAxis == 1) 
				{
					this.renderables[this.activeRenderable].transform.rotation.y += (speed * xAxis);
					this.renderables[this.activeRenderable].transform.rotate((speed * xAxis), new vector3(0, 1, 0));
				}
				else if (this.transformAxis.activeAxis == 2) 
				{
					this.renderables[this.activeRenderable].transform.rotation.z += (speed * xAxis);
					this.renderables[this.activeRenderable].transform.rotate((speed * xAxis), new vector3(0, 0, -1));
				}
			}

			this.oldMousePos[0] = pos[0];
			this.oldMousePos[1] = pos[1];
		}
	}

	this.changeView = function(face, axis, angle)
	{
		if (this.mainCamera.oldViewData.mode == 'none') 
		{
			this.mainCamera.saveAndReset();
			this.mainCamera.setCameraView(new vector3(0, 0, 350), new vector3(0, 0, -1), new vector3(0, -1), new vector3(1, 1, 1));
		}

		if (face != 'none') 
		{			
			if (face == 'front') 
			{
				this.worldTransform.rotation = new vector3();
				this.worldTransform.rotationQuat = new quaternion();
			}
			else if (face == 'top')
			{
				var animationangle = 0;
				function viewAngleAnimation(){
					renderer.worldTransform.rotation = new vector3();
					renderer.worldTransform.rotationQuat = new quaternion();

					renderer.worldTransform.rotation = new vector3(animationangle);
					renderer.worldTransform.rotate(animationangle, new vector3(1));

					animationangle += 90 / 60;
					if(animationangle >= 90){
						renderer.worldTransform.rotation = new vector3();
						renderer.worldTransform.rotationQuat = new quaternion();

						renderer.worldTransform.rotation = new vector3(90);
						renderer.worldTransform.rotate(90, new vector3(1));
						clearInterval(viewAngleAnimationInterval);
					}
				}
				var viewAngleAnimationInterval = setInterval(viewAngleAnimation, 16);
			}
			else if (face == 'left')
			{
				var animationangle = 0;
				function viewAngleAnimation(){
					renderer.worldTransform.rotation = new vector3();
					renderer.worldTransform.rotationQuat = new quaternion();

					renderer.worldTransform.rotation = new vector3(0, animationangle);
					renderer.worldTransform.rotate(animationangle, new vector3(0, 1));

					animationangle += 90 / 60;
					if(animationangle >= 90){
						renderer.worldTransform.rotation = new vector3();
						renderer.worldTransform.rotationQuat = new quaternion();

						renderer.worldTransform.rotation = new vector3(0, 90);
						renderer.worldTransform.rotate(90, new vector3(0, 1));
						renderer.worldTransform.rotation = new vector3(0, 0);

						clearInterval(viewAngleAnimationInterval);
					}
				}
				var viewAngleAnimationInterval = setInterval(viewAngleAnimation, 16);
			}
			else if (face == 'home')
			{
				this.worldTransform.rotation = new vector3();
				this.worldTransform.rotationQuat = new quaternion();

				this.mainCamera.restoreView();
			}
		}
		else
		{
			if (axis == 'Y') 
			{
				var animationangle = 0;
				var temp = renderer.worldTransform.rotation.y;
				function viewAngleAnimation(){
					renderer.worldTransform.rotation = new vector3();
					renderer.worldTransform.rotationQuat = new quaternion();

					renderer.worldTransform.rotation = new vector3(0, animationangle + temp);
					renderer.worldTransform.rotate(renderer.worldTransform.rotation.y, new vector3(0, 1));

					animationangle += (angle % 360) / (60);
					if(Math.abs(animationangle) >= Math.abs(angle)){
						renderer.worldTransform.rotation = new vector3();
						renderer.worldTransform.rotationQuat = new quaternion();

						renderer.worldTransform.rotation = new vector3(0, angle + temp);
						renderer.worldTransform.rotate(angle + temp, new vector3(0, 1));
						clearInterval(viewAngleAnimationInterval);
					}
				}
				var viewAngleAnimationInterval = setInterval(viewAngleAnimation, 16);
			}
		}
	}
}