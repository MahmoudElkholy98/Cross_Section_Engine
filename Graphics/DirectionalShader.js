var directionalVertexSource = 
[
	'precision mediump float;',

	'attribute vec3 pos;',
	'attribute vec3 norm;',

	'varying vec3 frag_normal;',
	'varying vec3 frag_eyePos;',
	'varying vec3 frag_pos;',
	'varying vec4 frag_pos2;',
	
	'uniform mat4 model;',
	'uniform mat4 view;',
	'uniform mat4 projection;',

	'uniform vec3 eyePos;',

	'void main()',
	'{',
		'gl_Position = projection * view * model * vec4(pos, 1);',
		'frag_normal = (model * vec4(norm, 0)).xyz;',
		'frag_pos = (model * vec4(pos, 1)).xyz;',
		'frag_pos2 = (model * vec4(pos, 1));',
		'frag_eyePos = eyePos;',
	'}'
].join('\n');

var directionalFragmentSource = 
[
	'precision mediump float;',

	'varying vec3 frag_normal;',
	'varying vec3 frag_eyePos;',
	'varying vec3 frag_pos;',
	'varying vec4 frag_pos2;',

	'struct DirectionalLight',
	'{',
		'vec3 direction;',

		'vec3 ambient;',
		'vec3 diffuse;',
		'vec3 specular;',

		'float ambientStrength;',
	'};',
	
	'uniform vec3 color;',
	'uniform DirectionalLight dirLight;',
	'uniform vec4 slicePlane;',

	'vec3 calcDirectional(DirectionalLight dir, vec3 normal, vec3 viewDir)',
	'{',
		'vec3 ambCol = dir.ambient * dir.ambientStrength * color;',

		'vec3 norm = (normal);',
		'vec3 lightDir = normalize(-dir.direction);',

		'float diffuseAngle = max(dot(norm, lightDir), 0.0);',
		'vec3 diffCol = diffuseAngle * dir.diffuse * color;',
		
		'vec3 halfway = normalize(viewDir + lightDir);',
	
		'float spec = pow(max(dot(norm, halfway), 0.0), 64.0);',
		'vec3 specCol = spec * dir.specular * 2.0 * color;',

		'vec3 finalLight = ambCol + (diffCol + specCol);',

		'return finalLight;',
	'}',

	'void main()',
	'{',
		'vec3 viewDir = normalize(frag_eyePos - frag_pos);',
		'vec3 normal = normalize(frag_normal);',
	
		'vec3 dirResult = calcDirectional(dirLight, normal, viewDir);',
		'float dist = clamp(dot(frag_pos.xyz, slicePlane.xyz) - slicePlane.w, 0.0, 1000.0);',
		'//if ((frag_pos2.xyz / frag_pos2.w).z > 0.0)',
		'//{',
			'//discard;',
		'//}',
		'//else',
		'//{',
			'gl_FragColor = vec4(dirResult * color, 1.0);',
		'//}',
	'}'
].join('\n');

var DirectionalShader = function()
{
	this.shaderInst = new shader(directionalVertexSource, directionalFragmentSource);

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
		this.shaderInst.addUniform('eyePos');

		this.shaderInst.addUniform('dirLight.direction');
		this.shaderInst.addUniform('dirLight.ambient');
		this.shaderInst.addUniform('dirLight.ambientStrength');
		this.shaderInst.addUniform('dirLight.diffuse');
		this.shaderInst.addUniform('dirLight.specular');
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
		this.shaderInst.setUniform3f('eyePos', camera.viewData.position);
		var dir = new vector3(-12, -10, -10);
		var diff = new vector3(1, 1, 1);
		var spec = new vector3(1, 1, 1);
		var amb = new vector3(1, 1, 1);
		var ambstr = 0.7;
		this.shaderInst.setUniform3f('dirLight.direction', dir);
		this.shaderInst.setUniform3f('dirLight.ambient', amb);
		this.shaderInst.setUniform1f('dirLight.ambientStrength', ambstr);
		this.shaderInst.setUniform3f('dirLight.diffuse', diff);
		this.shaderInst.setUniform3f('dirLight.specular', spec);
	}
}

