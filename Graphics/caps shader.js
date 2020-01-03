var basicVertexSource = 
[
	'precision mediump float;',

	'attribute vec3 pos;',
	'attribute vec3 norm;',
	'attribute vec2 texcoords;',

	'//varying vec2 frag_texcoords;',
	
	'uniform mat4 model;',
	'uniform mat4 view;',
	'uniform mat4 projection;',

	'void main()',
	'{',
		'gl_Position = projection * view * model * vec4(pos, 1);',
		'//frag_texcoords = texcoords;',
	'}'
].join('\n');

var basicFragmentSource = 
[
	'precision mediump float;',

	'//varying vec2 frag_texcoords;',

	'uniform vec3 color;',
	'//uniform sampler2D tex;',

	'void main()',
	'{',
		'gl_FragColor = vec4(color, 1.0);',
	'}'
].join('\n');

var BasicShader = function()
{
	this.shaderInst = new shader(basicVertexSource, basicFragmentSource);

	this.init = function()
	{
		this.shaderInst.init();

		this.shaderInst.activate();

		this.shaderInst.addAttribute('pos', 0);
		this.shaderInst.addAttribute('norm', 1);
		this.shaderInst.addAttribute('texcoords', 2);

		this.shaderInst.addUniform('model');
		this.shaderInst.addUniform('view');
		this.shaderInst.addUniform('projection');

		this.shaderInst.addUniform('color');
		//this.shaderInst.addUniform('tex');
	}

	this.updateUniforms = function(renderable, trans, camera)
	{
		this.shaderInst.activate();

		// if (trans != null) 
		// {
			this.shaderInst.setUniformMat4f('model',  multiplyM4(renderable.transform.getModelMatrix(), trans.getModelMatrix()));			
		// }
		// else
		// {
			// this.shaderInst.setUniformMat4f('model',  renderable.transform.getModelMatrix());
		// }
		
		this.shaderInst.setUniformMat4f('view', camera.getViewMatrix());
		this.shaderInst.setUniformMat4f('projection', camera.getProjectionMatrix());

		this.shaderInst.setUniform3f('color', renderable.color);
	}
}