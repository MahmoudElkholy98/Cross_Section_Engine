var screenVertexSource = 
[
	'precision mediump float;',

	'attribute vec3 pos;',
	'attribute vec3 norm;',
	'attribute vec2 texcoords;',

	'varying vec2 frag_texcoords;',

	'void main()',
	'{',
		'gl_Position = vec4(pos, 1.0);',
		'frag_texcoords = texcoords;',
	'}'
].join('\n');

var screenFragmentSource = 
[
	'precision mediump float;',

	'varying vec2 frag_texcoords;',

	'uniform vec3 color;',
	'uniform sampler2D tex;',

	'void main()',
	'{',
		'gl_FragColor = texture2D(tex, frag_texcoords);',
	'}'
].join('\n');

var ScreenShader = function()
{
	this.shaderInst = new shader(screenVertexSource, screenFragmentSource);

	this.init = function()
	{
		this.shaderInst.init();

		this.shaderInst.activate();

		this.shaderInst.addAttribute('pos', 0);
		this.shaderInst.addAttribute('norm', 1);
		this.shaderInst.addAttribute('texcoords', 2);

		this.shaderInst.addUniform('tex');
	}

	this.updateUniforms = function()
	{
		this.shaderInst.activate();

		//this.shaderInst.setUniform1f('tex', 0);
	}
}