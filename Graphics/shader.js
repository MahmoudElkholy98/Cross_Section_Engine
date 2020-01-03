var shader = function(vertexSource, fragmentSource)
{
	this.program = 0;
	this.uniforms = {};
	this.attributes = {};
	this.vertexSource = vertexSource;
	this.fragmentSource = fragmentSource;
	
	this.init = function()
	{
		if (vertexSource != undefined && fragmentSource != undefined)
		{
			var vertShader = gl.createShader(gl.VERTEX_SHADER);
			var fragShader = gl.createShader(gl.FRAGMENT_SHADER);


			gl.shaderSource(vertShader, vertexSource);
			gl.shaderSource(fragShader, fragmentSource);

			gl.compileShader(vertShader);
			if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
			{
				console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
				return;
			}

			gl.compileShader(fragShader);
			if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) 
			{
				console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
				return;
			}

			this.program = gl.createProgram();
			
			gl.attachShader(this.program, vertShader);
			gl.attachShader(this.program, fragShader);
			
			gl.linkProgram(this.program);			
			if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) 
			{
				console.error('ERROR linking program!', gl.getProgramInfoLog(this.program));
				return;
			}

			gl.validateProgram(this.program);
			if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) 
			{
				console.error('ERROR validating program!', gl.getProgramInfoLog(this.program));
				return;
			}
		}
	}

	this.addUniform = function(name)
	{
		if (this.uniforms[name] == undefined) 
		{
			this.uniforms[name] = gl.getUniformLocation(this.program, name);
		}
	}

	this.getUniform = function(name)
	{
		if (this.uniforms[name] != undefined) 
		{
			return this.uniforms[name];
		}

		//return -1;
	}

	this.addAttribute = function(name, index)
	{
		if (this.attributes[name] == undefined) 
		{
			gl.bindAttribLocation(this.program, name, index);
			this.attributes[name] = gl.getAttribLocation(this.program, name);
		}
	}

	this.getAttribute = function(name)
	{
		if (this.attributes[name] != undefined) 
		{
			return this.attributes[name];
		}

		//return -1;
	}

	this.setUniformMat4f = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniformMatrix4fv(location, gl.FALSE, value.getElements()); 
		}
	}

	this.setUniform1i = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform1i(location, value); 
		}
	}

	this.setUniform1f = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform1f(location, value);  
		}
	}

	this.setUniform2f = function(name, value1, value2)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform2f(location, value1, value2); 
		}
	}

	this.setUniform2f = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform2f(location, value.x, value.y); 
		}
	}

	this.setUniform3f = function(name, value1, value2, value3)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform3f(location, value1, value2, value3); 
		}
	}

	this.setUniform3f = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform3f(location, value.x, value.y, value.z); 
		}
	}

	this.setUniform4f = function(name, value1, value2, value3, value4)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform4f(location, value1, value2, value3, value4); 
		}
	}

	this.setUniform4f = function(name, value)
	{
		var location = this.getUniform(name);

		if (location != -1) 
		{
			gl.uniform4f(location, value.x, value.y, value.z, value.w); 
		}
	}

	this.activate = function()
	{
		gl.useProgram(this.program);
	}
}