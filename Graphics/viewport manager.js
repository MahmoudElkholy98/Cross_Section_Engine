var viewport = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

var ViewportManager = function()
{
	this.viewports = {};
	this.activeViewport;

	this.addViewport = function(viewport, name)
	{
		if(this.viewports[name] == undefined)
		{
			this.viewports[name] = viewport;
		}
	}

	this.activateViewport = function(name)
	{
		var active = this.viewports[name];

		if(active != undefined)
		{
			this.activeViewport = active;
			gl.viewport(active.x, active.y, active.width, active.height);
			gl.scissor(active.x, active.y, active.width, active.height);
		}
	}
}