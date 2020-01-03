var slice = function(size, base, direction, transform)
{
	this.plane = new plane(new vector3(), size, base, direction);
	this.plane.transform = transform;
	this.renderable = new renderable(createQuad(new vector3(), size, base, direction), new vector3(1, 1, 1), new vector3(), transform);
	this.beginSlicing = -1;
	
	this.startPoint_w;
	this.startPoint_s;

	this.endPoint_w;
	this.endPoint_s;

	this.thickness;
	this.color;

	this.use = 0;
}

var slicerVolume = function(size)
{
	this.volume = new renderable(createWireCuboid(new vector3(), size), new vector3(0.5, 0.5, 0.5), new vector3(), new transform());
	this.gridXZ = new renderable(createGrid(new vector3(0, (-size.y / 2.0) + 0.05), size.x - 24, size.z - 24, 12, 'xz'), new vector3(), new vector3(), new transform());
	this.groundXZ = new renderable(createQuad(new vector3(0, -size.y / 2.0), new vector3(size.x, 0, size.z), 'xz', 'front'), new vector3(1, 1, 1), new vector3(), new transform());
}
// micro to mil / 2 = slice thickness
// vp = vmax - (sp* ( abs(vmax)+abs(vmin) ) ) / smax

/*

(((Ps - min_s) / (max_s - min_s)) * (max_w - min_w)) = Pw - min_w

*/

var activateAutoSlice = false;

var slicer = function()
{
	this.frontSlice = null;
	this.backSlice = null;

	this.clippingShader = null;
	this.capsShader = null;
	this.sliceCamera = null;
	this.tempCamera = null;
	this.beginSlicing = false;
	this.canvas = null;
	this.context = null;
	this.autoSlice = null;
	this.lockSlicing = true;
	this.autoSlicingSpeed = 0.05;
	this.slicerVolume = new slicerVolume(new vector3(240, 150
		, 144));
	this.sliceVolmeShader;

	this.sliceLayers = [];
	this.min_s = 0;
	this.max_s = 500;
	this.activeSliceLayer = 0;
	
	this.setFrontSlice = function(size, base, transform, invert)
	{
		if (invert != undefined && invert == true)
		{
			this.frontSlice = new slice(size, base, 'back', transform);
		}
		else
		{
			this.frontSlice = new slice(size, base, 'front', transform);
		}

		this.frontSlice.plane.init();

		if(this.backSlice == null)
		{
			this.backSlice = this.frontSlice;
		}
	}

	this.setBackSlice = function(size, base, transform, invert)
	{
		if (invert != undefined && invert == true)
		{
			this.backSlice = new slice(size, base, 'front', transform);
		}
		else
		{
			this.backSlice = new slice(size, base, 'back', transform);
		}

		this.backSlice.plane.init();

		if (this.frontSlice == null) 
		{
			this.frontSlice = this.backSlice;
		}
	}

	this.init = function(clippingShader, capsShader, cam, mainCam)
	{		
		this.clippingShader = clippingShader;
		this.capsShader = capsShader;
		this.sliceCamera = cam;
		this.tempCamera = mainCam;

		this.canvas = document.createElement('canvas');
		this.canvas.width = canvasManager.width;
		this.canvas.height = canvasManager.height;
		this.context = this.canvas.getContext('2d');

		// this.tempcanvas = document.createElement('canvas');
		// this.tempcanvas = document.getElementById('tempcanvas');
		// this.tempcanvas.width = canvasManager.width;
		// this.tempcanvas.height = canvasManager.height;
		// this.tempcontext = this.tempcanvas.getContext('2d');

		this.autoSlice = new slice(new vector3(30000, 30000, 30000), 'xz', 'front', new transform());
		this.autoSlice.plane.init();

		this.sliceVolmeShader = new SliceVolumeShader();
		this.sliceVolmeShader.init(); 

		for (var i = 0; i < 12; i++) 
		{
			this.addSliceLayer(this.min_s, this.max_s, new vector3(0.3, 0.5, 0.7), 100, 0);
			if (i != 0) 
			{
				this.sliceLayers[i].plane.transform.position.y = 1000;
				this.sliceLayers[i].renderable.transform.position.y = 1000;
				this.sliceLayers[i].plane.update();
			}
		}

		this.sliceLayers[0].use = 1;

		this.editSlice(11, this.min_s, this.max_s, new vector3(0.3, 0.5, 0.7), 100, 1);
		this.sliceLayers[11].renderable.color = new vector3(0.4, 0.5, 0.9);
	}

	this.addSliceLayer = function(s, e, col, thickness, use)
	{
		var index = this.sliceLayers.length;
		this.sliceLayers.push(new slice(new vector3(30000, 30000, 30000), 'xz', 'front', new transform()));
		this.sliceLayers[index].plane.init();

		var t = thickness / 1000.0;

		var start = (((s - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
		start += renderer.minBounds.y;

		var end = (((e - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
		end += renderer.minBounds.y;

		this.sliceLayers[index].thickness = t;
		this.sliceLayers[index].color = col;
		this.sliceLayers[index].startPoint_w = start;
		this.sliceLayers[index].startPoint_s = s;
		this.sliceLayers[index].endPoint_w = end;
		this.sliceLayers[index].endPoint_s = e;
		this.sliceLayers[index].use = use;
		// this.sliceLayers[index].plane.transform.position.y = start;
		// this.sliceLayers[index].renderable.transform.position.y = start;
	}

	this.updateSliceLayers = function()
	{
		for (var i = 0; i < this.sliceLayers.length; i++) 
		{
			var start = (((this.sliceLayers[i].startPoint_s - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
			start += renderer.minBounds.y;

			var end = (((this.sliceLayers[i].endPoint_s - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
			end += renderer.minBounds.y;

			this.sliceLayers[i].startPoint_w = start;
			this.sliceLayers[i].endPoint_w = end;

			// this.sliceLayers[index].plane.transform.position.y = start;
			// this.sliceLayers[index].renderable.transform.position.y = start;
		}
	}

	this.editSlice = function(index, s, e, col, thickness, use)
	{
		var t = thickness / 1000.0;
		
		if (s != null) 
		{
			var start = (((s - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
			start += renderer.minBounds.y;
		}
				
		if (e != null) 
		{
			var end = (((e - this.min_s) / (this.max_s - this.min_s)) * (renderer.maxBounds.y - renderer.minBounds.y));
			end += renderer.minBounds.y;
		}		

		this.sliceLayers[index].thickness = thickness == null ? this.sliceLayers[index].thickness : t;
		this.sliceLayers[index].color = col == null ? this.sliceLayers[index].color : col;
		this.sliceLayers[index].startPoint_w = s == null ? this.sliceLayers[index].startPoint_w : start;
		this.sliceLayers[index].startPoint_s = s == null ? this.sliceLayers[index].startPoint_s : s;
		this.sliceLayers[index].endPoint_w = e == null ? this.sliceLayers[index].endPoint_w : end;
		this.sliceLayers[index].endPoint_s = e == null ? this.sliceLayers[index].endPoint_s : e;
		this.sliceLayers[index].use = use == null ? this.sliceLayers[index].use : use;
		
		if (index == 1) 
		{
			this.sliceLayers[0].endPoint_w = this.sliceLayers[index].startPoint_w;
			this.sliceLayers[0].endPoint_s = this.sliceLayers[index].startPoint_s;
		}
	}

	this.removeSlice = function(index)
	{
		this.sliceLayers[index].use = 0;
	}

	this.firstPass = function()
	{
		var slicePlanes = [];
		slicePlanes.push(this.frontSlice);
		slicePlanes.push(this.frontSlice);

		gl.enable(gl.STENCIL_TEST);
		gl.clear(gl.STENCIL_BUFFER_BIT);
		gl.disable(gl.DEPTH_TEST);
		gl.colorMask(0, 0, 0, 0);

		gl.stencilFunc(gl.ALWAYS, 0, 0);
		
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
		gl.cullFace(gl.FRONT);

		renderer.renderAll(this.clippingShader, slicePlanes);

		gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
		gl.cullFace(gl.BACK);

		renderer.renderAll(this.clippingShader, slicePlanes);

		gl.colorMask(1, 1, 1, 1);	
		gl.enable(gl.DEPTH_TEST);
		gl.stencilFunc(gl.NOTEQUAL, 0, ~0);

		renderer.render(this.frontSlice.renderable, this.capsShader);
	}

	this.secondPass = function()
	{
		var slicePlanes = [];
		slicePlanes.push(this.backSlice);
		slicePlanes.push(this.backSlice);

		gl.enable(gl.STENCIL_TEST);
		gl.clear(gl.STENCIL_BUFFER_BIT);
		gl.disable(gl.DEPTH_TEST);
		gl.colorMask(0, 0, 0, 0);

		gl.stencilFunc(gl.ALWAYS, 0, 0);			
		
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
		gl.cullFace(gl.FRONT);

		renderer.renderAll(this.clippingShader, slicePlanes);

		gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
		gl.cullFace(gl.BACK);

		renderer.renderAll(this.clippingShader, slicePlanes);

		gl.colorMask(1, 1, 1, 1);	
		gl.enable(gl.DEPTH_TEST);		
		gl.stencilFunc(gl.NOTEQUAL, 0, ~0);

		renderer.render(this.backSlice.renderable, this.capsShader);
	}

	this.renderSlice = function(sliceOnly)
	{
		if(sliceOnly == true)
		{
			renderer.mainCamera = this.sliceCamera;
		}

		if (inputManager.isKeyUp('KeyB'))
		{
			this.beginSlicing = true;

			this.frontSlice.beginSlicing = 1;
			this.backSlice.beginSlicing = 1;
		}

		if(this.beginSlicing == false)
		{
			this.frontSlice.beginSlicing = 1;
			this.backSlice.beginSlicing = 1;
		}

		this.frontSlice.plane.update();
		this.backSlice.plane.update();

		this.firstPass();
		this.secondPass();

		if(this.beginSlicing == false)
		{
			this.frontSlice.beginSlicing = -1;
			this.backSlice.beginSlicing = -1;
		}

		gl.disable(gl.STENCIL_TEST);

		var slicePlanes = [];
		slicePlanes.push(this.frontSlice);
		slicePlanes.push(this.backSlice);	

		if (sliceOnly == false) 
		{
			renderer.renderAll(this.clippingShader, slicePlanes);
		}

		if(sliceOnly == true)
		{
			renderer.mainCamera = this.tempCamera;
		}

		if (sliceOnly == true && inputManager.isKeyUp('KeyZ'))
		{
			this.saved = false;
			this.clickedSave = true;
			this.saveToFile();
		}
	}

	this.resetSlices = true;

	this.resetSliceLayers = function()
	{
		if (this.resetSlices == true) 
		{
			this.updateSliceLayers();

			for (var i = 0; i < this.sliceLayers.length - 1; i++) 
			{
				this.sliceLayers[i].plane.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w - 0.0001, 0);
				this.sliceLayers[i].renderable.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w - 0.0001, 0);
				
				this.sliceLayers[i].plane.update();
				this.sliceLayers[i].beginSlicing = false;
			}

			this.sliceLayers[11].plane.transform.position = new vector3(0, this.sliceLayers[11].endPoint_w + 0.0001, 0);
			this.sliceLayers[11].renderable.transform.position = new vector3(0, this.sliceLayers[11].endPoint_w + 0.0001, 0);
				
			this.sliceLayers[11].plane.update();
			//this.resetSlices = false;
		}		
	}

	this.flipSliceLayers = function(direction)
	{
		for (var i = 0; i < this.sliceLayers.length - 1; i++) 
		{
			if (this.sliceLayers[i].use == 0) 
			{
				continue;
			}

			if (direction != undefined) 
			{
				if(direction == 'front' || direction == 'Front' || direction == 'FRONT')
				{
					this.sliceLayers[i].plane.transform.rotation = new vector3();
					this.sliceLayers[i].renderable.transform.rotation = new vector3();
				}
				else
				{
					this.sliceLayers[i].plane.transform.rotation = new vector3(180);
					this.sliceLayers[i].renderable.transform.rotation = new vector3(180);
				}
			}
			else
			{
				this.sliceLayers[i].plane.transform.rotation = new vector3();
				this.sliceLayers[i].renderable.transform.rotation = new vector3();
			}

			this.sliceLayers[i].plane.update();
		}
	}
	this.restoreUse = [];
	this.autoSliceScene = function(sliceOnly, direction)
	{		
		this.flipSliceLayers(direction);		

		if(sliceOnly == true)
		{
			renderer.mainCamera = this.sliceCamera;
		}

		if (this.beginSlicing == true)
		{
			this.lockSlicing = false;
			
			this.beginSlicing = false;

			for (var i = 0; i < this.sliceLayers.length; i++) 
			{
				this.updateSliceLayers();

				if (this.sliceLayers[i].use == 1) 
				{
					this.sliceLayers[i].plane.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w, 0);
					this.sliceLayers[i].renderable.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w, 0);
					this.sliceLayers[i].plane.update();
				}
				else
				{
					this.sliceLayers[i].plane.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w + 1000, 0);
					this.sliceLayers[i].renderable.transform.position = new vector3(0, this.sliceLayers[i].startPoint_w + 1000, 0);
				}

				this.sliceLayers[i].beginSlicing = true;
			}

			this.sliceLayers[11].plane.transform.position.y = 10000;
			this.sliceLayers[11].renderable.transform.position.y = 10000;	
			this.sliceLayers[11].plane.update();		
		}

		if (this.lockSlicing == true) 
		{
			this.resetSliceLayers();

			if (sliceOnly == false) 
			{
				renderer.renderAll(this.clippingShader, this.sliceLayers);
			}
		}

		if (this.lockSlicing == false) 
		{
			gl.enable(gl.STENCIL_TEST);
			gl.clear(gl.STENCIL_BUFFER_BIT);
			gl.disable(gl.DEPTH_TEST);
			gl.colorMask(0, 0, 0, 0);

			gl.stencilFunc(gl.ALWAYS, 0, 0);
			
			gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
			gl.cullFace(gl.FRONT);

			renderer.renderAll(this.clippingShader, this.sliceLayers);

			gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
			gl.cullFace(gl.BACK);

			renderer.renderAll(this.clippingShader, this.sliceLayers);

			gl.colorMask(1, 1, 1, 1);	
			gl.enable(gl.DEPTH_TEST);
			gl.stencilFunc(gl.NOTEQUAL, 0, ~0);

			renderer.render(this.sliceLayers[this.activeSliceLayer].renderable, this.capsShader);

			gl.disable(gl.STENCIL_TEST);

			if (sliceOnly == false) 
			{
				renderer.renderAll(this.clippingShader, this.sliceLayers);
			}

			if (this.sliceLayers[this.activeSliceLayer].plane.transform.position.y > this.sliceLayers[this.activeSliceLayer].endPoint_w) /*|| this.autoSlice.plane.transform.position.y >= this.slicerVolume.volume.mesh.maxBounds.y) */
			{
				if (this.sliceLayers.length > 0) 
				{
					this.sliceLayers[this.activeSliceLayer].plane.transform.position.y = this.sliceLayers[this.activeSliceLayer].endPoint_w + 0.001;
					this.sliceLayers[this.activeSliceLayer].renderable.transform.position.y = this.sliceLayers[this.activeSliceLayer].endPoint_w + 0.001;
					this.sliceLayers[this.activeSliceLayer].plane.update();
					this.sliceLayers[this.activeSliceLayer].use = 0;
					this.restoreUse.push(this.activeSliceLayer);

					this.activeSliceLayer++;
				}

				if ((this.activeSliceLayer >= this.sliceLayers.length) || (this.activeSliceLayer < this.sliceLayers.length && this.sliceLayers[this.activeSliceLayer].use == 0))
				{
					for (var i = 0; i < this.sliceLayers.length; i++) 
					{
						this.sliceLayers[i].beginSlicing = false;
					}

					for (var i = 0; i < this.restoreUse.length; i++) 
					{
						this.sliceLayers[this.restoreUse[i]].use = 1.0;
					}

					this.restoreUse = [];

					this.lockSlicing = true;
					this.resetSlices = true;

					this.activeSliceLayer = 0;

					if (activateAutoSlice == true) 
					{
						activateAutoSlice = false;
					}
					// if (sliceOnly == true) 
					// {
						downloadSlices();
					// }
				}
			}
			else 
			{
				if (sliceOnly) 
				{
					this.sliceLayers[this.activeSliceLayer].plane.transform.position.y += this.sliceLayers[this.activeSliceLayer].thickness / 2.0;
					this.sliceLayers[this.activeSliceLayer].renderable.transform.position.y += this.sliceLayers[this.activeSliceLayer].thickness / 2.0;
					this.sliceLayers[this.activeSliceLayer].plane.update();
					
					// for (var i = 0; i < this.activeSliceLayer; i++) 
					// {
					// 	this.sliceLayers[i].plane.transform.position.y += this.sliceLayers[this.activeSliceLayer].thickness / 4.0;
					// 	this.sliceLayers[i].renderable.transform.position.y += this.sliceLayers[this.activeSliceLayer].thickness / 4.0;
					// 	this.sliceLayers[i].plane.update();
					// }	
				}			

				// this.sliceLayers[11].plane.transform.position.y += this.sliceLayers[11].thickness / 2.0;
				// this.sliceLayers[11].renderable.transform.position.y += this.sliceLayers[11].thickness / 2.0;	
				// this.sliceLayers[11].plane.update();		
			}

			if(sliceOnly == true)
			{
				var png = this.saveToFile();

				saveSlices(png);
			}
		}

		if(sliceOnly == true)
		{
			renderer.mainCamera = this.tempCamera;
		}
	}

	this.moveSingle = function(pos)
	{
		this.updateSliceLayers();
		this.editSlice(11, null, pos, null, null);
		this.sliceLayers[11].plane.transform.position.y = this.sliceLayers[11].endPoint_w;
		this.sliceLayers[11].renderable.transform.position.y = this.sliceLayers[11].endPoint_w;
		this.sliceLayers[11].plane.update();
	}

	this.renderSingle = function()
	{
		gl.enable(gl.STENCIL_TEST);
		gl.clear(gl.STENCIL_BUFFER_BIT);
		gl.disable(gl.DEPTH_TEST);
		gl.colorMask(0, 0, 0, 0);

		gl.stencilFunc(gl.ALWAYS, 0, 0);
		
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
		gl.cullFace(gl.FRONT);

		renderer.renderAll(this.clippingShader, this.sliceLayers);

		gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
		gl.cullFace(gl.BACK);

		renderer.renderAll(this.clippingShader, this.sliceLayers);

		gl.colorMask(1, 1, 1, 1);	
		gl.enable(gl.DEPTH_TEST);
		gl.stencilFunc(gl.NOTEQUAL, 0, ~0);

		renderer.render(this.sliceLayers[11].renderable, this.capsShader);

		gl.disable(gl.STENCIL_TEST);

		renderer.renderAll(this.clippingShader, this.sliceLayers);
	}

	this.renderVolume = function()
	{
		this.sliceVolmeShader.updateUniforms(this.slicerVolume.volume, renderer.worldTransform, renderer.mainCamera);

		this.slicerVolume.volume.mesh.bindBuffers();
		
		gl.lineWidth(1.0);
		
		gl.drawArrays(gl.LINE_STRIP, 0, this.slicerVolume.volume.mesh.vertices.length);

		this.slicerVolume.volume.mesh.unbindBuffers();		
/***************************************************/
		this.sliceVolmeShader.updateUniforms(this.slicerVolume.gridXZ, renderer.worldTransform, renderer.mainCamera);

		this.slicerVolume.gridXZ.mesh.bindBuffers();
		
		gl.lineWidth(1.0);
		
		gl.drawArrays(gl.LINES, 0, this.slicerVolume.gridXZ.mesh.vertices.length);

		this.slicerVolume.gridXZ.mesh.unbindBuffers();	

		/***************************************************/
		this.sliceVolmeShader.updateUniforms(this.slicerVolume.groundXZ, renderer.worldTransform, renderer.mainCamera);

		this.slicerVolume.groundXZ.mesh.bindBuffers();
		
		// gl.lineWidth(1.0);
		
		gl.drawArrays(gl.TRIANGLES, 0, this.slicerVolume.groundXZ.mesh.vertices.length);

		this.slicerVolume.groundXZ.mesh.unbindBuffers();			
	}

	tempi = 0;
	// var tempdata2 = new Uint8Array(new Array(slicer.canvas.width * slicer.canvas.height * 4)); 
	this.saveToFile = function()
	{
		// var d = [];
		// for (var i = 0; i < this.canvas.width * this.canvas.height * 4; i++)
		// {
		// 	d.push(220);
		// }
/*
		var data = new Uint8Array(new Array(this.canvas.width * this.canvas.height * 4));
   		gl.readPixels(0, 0, this.canvas.width, this.canvas.height, gl.RGBA,
                  gl.UNSIGNED_BYTE, data);

		 // Copy the pixels to a 2D canvas
        var image = this.context.createImageData(
                this.canvas.width, this.canvas.height);
        image.data.set(data);       

        // Load data into the context
        this.context.putImageData(image, 0, 0);

        var imgFromCanvas3D = this.canvas.toDataURL();

        //========================================= hexagon
		var numberOfSides = 6,
		    size = 20,
		    Xcenter = 0,
		    Ycenter = 0,
		    thickness = 5;
		
		for(var j=0; j<(this.canvas.width/size); j++){

			for(var k=0; k<(this.canvas.height/size); k++) {
				
				this.context.beginPath();
				this.context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
				 
				for (var i = 1; i <= numberOfSides;i += 1) {
				    this.context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
				}
				 
				this.context.strokeStyle = "#000000";
				this.context.lineWidth = 1;
				this.context.stroke();
				this.context.fill();

				Ycenter += ((size*35)/20) + thickness;
			}

			if (j % 2 != 0) 
			{
				Ycenter = 0;
			}
			else
			{
				Ycenter = ((size*17)/20) + thickness;
			}
			Xcenter += ((size*30)/20) + thickness;
		}
		//==============================================
		
		// Convert data to a DataURL and save to the zip file
        var imgWithHexa = this.canvas.toDataURL();
		
			// var tempimage = this.tempcontext.createImageData(
	  //               this.tempcanvas.width, this.tempcanvas.height);
	  //       tempimage.data.set(data);

	        // this.tempcontext.putImageData(image, 0, 0);
	        var borderSize = 40;
	        var tempimg = document.createElement("img");
	        tempimg.setAttribute("src", imgFromCanvas3D);
	        this.tempcontext.drawImage(tempimg, 0, 0);

	        this.tempcontext.globalCompositeOperation = "destination-out";

	        this.tempcontext.drawImage(tempimg, borderSize / 2, borderSize / 2, this.canvas.width-borderSize, (this.canvas.height-borderSize));
	        // this.tempcontext.putImageData(image, 0, 0, 2.5, 2.5, this.canvas.width-5, this.canvas.height-5);
    		
	        this.tempcontext.globalCompositeOperation = "destination-over";

    		var tempimg = document.createElement("img");
	        tempimg.setAttribute("src", imgWithHexa)
    		this.tempcontext.drawImage(tempimg, 0, 0);
    		this.tempcontext.restore();

    	tempi++;
		*/
    	// Convert data to a DataURL and save to the zip file
        var png = canvasManager.canvas.toDataURL();

		return png;
	}
}

//==========================================================

var zip = new JSZip();
var slicesIndex = 0;
function saveSlices(imageData){
	var slices = zip.folder("slices");

	// slices.file("image.png", imageone, {base64: true});
	slices.file("image"+slicesIndex+".png", imageData.slice(imageData.indexOf(',') + 1, -1), {base64: true});

	slicesIndex++;

	// zip.generateAsync({type:"blob"}).then(function(content) {
	//     // see FileSaver.js
	//     //saveAs(content, "example.zip");

	// 	var element = document.createElement('a');
	// 	element.setAttribute('href', window.URL.createObjectURL(content) );
	// 	element.setAttribute('download', "slices.zip");
	// 	element.style.display = 'none';
	// 	document.body.appendChild(element);
	// 	element.click();

	// 	window.URL.revokeObjectURL(window.URL.createObjectURL(content));
	// 	document.body.removeChild(element);		    
	// });

	// //download image file alone
	// var element = document.createElement('a');
	// element.setAttribute('href', 'data:image/png;base64'+imageone );
	// element.setAttribute('download', "imageone.png");
	// element.style.display = 'none';
	// document.body.appendChild(element);
	// element.click();
	// document.body.removeChild(element);	
}

function downloadSlices(){
	var content = zip.generate({type: 'blob', compression: 'DEFLATE'});
	saveAs(content, "3DS-Slices.zip");
	changeDocumentTitleForQtToStart();
}


function startSlicing()
{
	if(renderer.renderables.length > 0)
	{
		slicesIndex = 0;
		//get slice thickness
		resetSliderSlicer();
		activateAutoSlice = true;
		slicer.beginSlicing = true;
	}
	else{
		// popup error
		showPopup("There are no objects to Slice");
	}
}