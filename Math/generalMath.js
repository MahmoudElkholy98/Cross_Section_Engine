var PI = 3.1415926535;

var toRadians = function(angle)
{
	return angle * PI / 180.0;
}

var toDegrees = function(angle)
{
	return angle * 180.0 / PI;
}

function mToNum(x)
{
	var floatNum = 0;

	var numarr = x.split("e");

	floatNum = parseFloat(numarr[0]) * Math.pow(2, parseFloat(numarr[1]) );

	return floatNum;
}