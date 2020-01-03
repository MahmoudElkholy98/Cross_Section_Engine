var canvas = function(canvas)
{
	this.canvas = canvas;
	this.width;
	this.height;

	this.init = function()
	{		
		gl = this.canvas.getContext("webgl", {stencil: true});

		gl.canvas.width = window.innerWidth;
		gl.canvas.height = window.innerHeight;

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		if (!gl) 
		{
			console.log('WebGL not supported, falling back on experimental-webgl');
			gl = this.canvas.getContext('experimental-webgl');
		}

		if (!gl) 
		{
			alert('Your browser does not support WebGL');
		}
		
		//gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		//gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.CULL_FACE);
		//gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.SCISSOR_TEST);
	}	

	this.setClearColor = function(r, g, b, a)
	{
		gl.clearColor(r, g, b, a);
	}

	this.clear = function(mode)
	{
		if (mode == "default") 
		{
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
		else
		{
			gl.clear(mode);
		}		
	}
}