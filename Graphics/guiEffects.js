function applySceneMode(){
	renderer.mode = 'world';
	document.getElementById("transform-apply").style.display= "none";
}

function initGui(){
	resetSliderSlicer();
}

function showTools(toolsToShow){
	if(toolsToShow == "transform"){
		if(renderer.renderables.length > 0)
		{
			showTransformTools('translate');
			hideTools();
			document.getElementById(toolsToShow+"-tools").style.display = "flex";
		}
		else{
			showPopup("There are no objects to Transform");
		}
	}
	else{
		hideTools();
		document.getElementById(toolsToShow+"-tools").style.display = "flex";
	}
}

// to commit
function hideTools(){
	// renderer.mode = 'world';
	document.getElementById("add-tools").style.display = "none";
	document.getElementById("transform-tools").style.display = "none";
	document.getElementById("infill-tools").style.display = "none";
}

// canvas mouse click
document.getElementById("glcanvas").addEventListener("click", function(e){
	hideTools();	
	document.getElementById("slider-layers-box").style.display = "none";	
	document.getElementById("slider-layer-number").style.display = "none";	
});

function showTransformTools(transformToShow){
	document.getElementById("transform-apply").style.display= "block";

	if(transformToShow == "translate")
	{
		renderer.mode = 'trans';
	}
	else if(transformToShow == "scale")
	{
		renderer.mode = 'scale';
	}
	else if(transformToShow == "rotate")
	{
		renderer.mode = 'rot';
	}

	hideTransfromTools();
	document.getElementById("transform-tools-option-"+transformToShow).style.background = "#4884da";
	document.getElementById(transformToShow+"-box").style.display = "flex";
}

function hideTransfromTools(){
	document.getElementById("transform-tools-option-translate").style.background = "white";
	document.getElementById("transform-tools-option-scale").style.background = "white";
	document.getElementById("transform-tools-option-rotate").style.background = "white";

	document.getElementById("translate-box").style.display = "none";	
	document.getElementById("scale-box").style.display = "none";	
	document.getElementById("rotate-box").style.display = "none";	
}

function scaleTypeChange(){
	if(document.getElementById("scale-uniform-btn").checked){
		document.getElementById("uniform-scale-input").disabled = false;
		document.getElementById("nonuniform-scale-input-x").disabled = true;
		document.getElementById("nonuniform-scale-input-y").disabled = true;
		document.getElementById("nonuniform-scale-input-z").disabled = true;
	}
	else{
		document.getElementById("uniform-scale-input").disabled = true;
		document.getElementById("nonuniform-scale-input-x").disabled = false;
		document.getElementById("nonuniform-scale-input-y").disabled = false;
		document.getElementById("nonuniform-scale-input-z").disabled = false;	
	}
}

function scaleApply(axis, value, e){
	if(e.key == "Enter"){
		value = Number(value);

		if(axis == "xyz"){
			scaleTool(value, value, value);
		}
		else if(axis == "x"){
			scaleTool(value, null, null);
		}
		else if(axis == "y"){
			scaleTool(null, value, null);
		}
		else if(axis == "x"){
			scaleTool(null, null, value);
		}
	}
}

function rotateApply(){
	var x = Number(document.getElementById("rotate-input-x").value);
	var y = Number(document.getElementById("rotate-input-y").value);
	var z = Number(document.getElementById("rotate-input-z").value);

	rotateTool(x,y,z);
}


// to commit
//==================== slider =========================================

var activeHandleIndex = 0;
function handleDown(handleIndex){

	if(handleIndex != -1){
		activeHandleIndex = handleIndex;

		sliderHandleStyle(handleIndex);
		document.getElementById("slider-layers-box").setAttribute("class", "");
	    document.getElementById("slider-layers-box").style.visibility = "visible";

		currentHandleElement = document.getElementById("slider-handle-"+handleIndex);
		prevHandleElementPos = ( document.getElementById("slider-handle-"+(handleIndex-1)) == null ? document.getElementById("slider").getBoundingClientRect().bottom : document.getElementById("slider-handle-"+(handleIndex-1)).getBoundingClientRect().top );
		nextHandleElementPos = ( document.getElementById("slider-handle-"+(handleIndex+1)) == null ? document.getElementById("slider").getBoundingClientRect().top : document.getElementById("slider-handle-"+(handleIndex+1)).getBoundingClientRect().top );
	}


	function documentMouseUp(e){
		if(handleIndex != -1){
			showLayersBox(handleIndex);
			sliderColorsStyle();
			sendSliderToWorld();	
		}
		
		document.removeEventListener('mousemove', documentMouseMove);
		document.removeEventListener('mouseup', documentMouseUp);
	}
	document.addEventListener('mouseup', documentMouseUp);


	function documentMouseMove(e){

		if(handleIndex != -1){
			// if it's not the slicer handle
			if(e.clientY < prevHandleElementPos && e.clientY > nextHandleElementPos){
				document.getElementById("slider-handle-"+handleIndex).style.bottom = (document.getElementById("slider").getBoundingClientRect().bottom - e.clientY) - document.getElementById("slider-handle-"+handleIndex).getBoundingClientRect().height +"px";
			}
		}
		else{
			if(e.clientY < (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-slicer-handle").getBoundingClientRect().height/2) && e.clientY > (document.getElementById("slider").getBoundingClientRect().top - document.getElementById("slider-slicer-handle").getBoundingClientRect().height/2) ){
				document.getElementById("slider-slicer-handle").style.top = e.clientY +"px";
			}

			// send the slider slicer pos to the graphics
			var sliderSlicerPos = (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById('slider-slicer-handle').getBoundingClientRect().top) - document.getElementById('slider-slicer-handle').getBoundingClientRect().height/2;
			slicer.moveSingle(sliderSlicerPos);
		}

	}
	document.addEventListener('mousemove', documentMouseMove);
}

function sliderHandlePlus(){
	var handlesNumber = document.getElementById("slider").children.length;

	if(handlesNumber < 10){
		var newHandleIndex = handlesNumber;
		var lastHandleIndex = handlesNumber-1;
		var lastHandleIndexPos = ( document.getElementById("slider-handle-"+lastHandleIndex) == null ? 0 : Number(document.getElementById("slider-handle-"+lastHandleIndex).style.bottom.split("px")[0]) );

		document.getElementById("slider").innerHTML += "<div id='slider-handle-"+newHandleIndex+"' class='slider-handle' onmousedown='handleDown("+handlesNumber+")'></div>";	
		document.getElementById("slider-handle-"+newHandleIndex).style.bottom = lastHandleIndexPos+30 +"px";
		
		sliderColorsStyle();
		sendSliderToWorld();

		// set the new segment layers thikness and info
		// first reset the normal values in the html
		document.getElementById("normal-exposure-time-input").value = 2000;
		document.getElementById("normal-retract-speed-input").value = 150;
		document.getElementById("normal-peeling-speed-input").value = 25;
		document.getElementById("normal-peeling-dist-input").value = 25;
		document.getElementById("normal-thickness-input").value = 100;

		var layerInfoObject = {'thickness': 100};
		layersInfo[newHandleIndex] = layerInfoObject;
		setSliderLayers(newHandleIndex, 0);
	}
}

function sliderHandleMinus(){
	var lastHandleIndex = document.getElementById("slider").children.length-1;

	if(lastHandleIndex > -1){
		document.getElementById("slider").removeChild(document.getElementById("slider").children[lastHandleIndex]);
		sliderColorsStyle();
		sendSliderToWorld();

		layersInfo.pop();

		showLayersBox(lastHandleIndex-1);
	}
}

// just styling
function sliderHandleStyle(handleIndex){
	var handlesNumber = document.getElementById("slider").children.length;

	for(var i=0; i<handlesNumber; i++){
		document.getElementById("slider-handle-"+i).style.border = "1px solid #505098";
	}

	document.getElementById("slider-handle-"+handleIndex).style.border = "2px solid #505098";
}

var sliderColors = ["#a52a2a", "#3F51B5", "#00897b", "#FF5722", "#607D8B", "#4E342E", "#33691E", "#C51162", "#424242", "#D50000"];
function sliderColorsStyle(){
	var handlesNumber = document.getElementById("slider").children.length;

	if(handlesNumber > -1){

		var linearGradient = "to top ";

		for(var i=0; i<handlesNumber; i++){
			if(i==0){
				var prevPosPercent = 0;
			}
			else{
				var prevHandleIndex = i-1;
				var prevPosPercent = 100 - ( ( ( (document.getElementById("slider-handle-"+prevHandleIndex).getBoundingClientRect().top - document.getElementById("slider").getBoundingClientRect().top) *100 )/500).toFixed(2) );
			}

			var posPercent = (100 - ( ( (document.getElementById("slider-handle-"+i).getBoundingClientRect().top - document.getElementById("slider").getBoundingClientRect().top) *100 )/500) ).toFixed(2);

			linearGradient += ", "+sliderColors[i]+" "+prevPosPercent+"%, "+sliderColors[i]+" "+posPercent+"%";
		}

		var lastHandleIndex = handlesNumber-1;
		var lastHandleIndexPos = ( document.getElementById("slider-handle-"+lastHandleIndex) == null ? 0 : document.getElementById("slider-handle-"+lastHandleIndex).getBoundingClientRect().top );
		var lastPosPercent = (100 - ( ( (lastHandleIndexPos - document.getElementById("slider").getBoundingClientRect().top) *100 )/500) ).toFixed(2);

		linearGradient += ", white "+lastPosPercent+"%, white 100%";

		document.getElementById("slider").style.background = "linear-gradient("+linearGradient+")";
	}

}


function sendSliderToWorld(){
	var sliderArray = [];

	var handlesNumber = document.getElementById("slider").children.length;

	for(var i=0; i<handlesNumber; i++)
	{
		// slider bottom pos - handle top pos - 2.5 (for border pixels approximate number)
		var handleTruePos = (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-handle-"+i).getBoundingClientRect().top) - 2.5;
		var temparray = [handleTruePos, sliderColors[i]];
		sliderArray.push( temparray );
		//=================================
		var hCol ;
		// to remove th "#" from the color then convert it to rgb
		hCol = sliderColors[i].substr(1);
		var r = 0; var  g = 0; var b = 0;

		r = parseInt('0x' + hCol.substr(0,2)) / 255.0;
		g = parseInt('0x' + hCol.substr(2,2)) / 255.0;
		b = parseInt('0x' + hCol.substr(4,2)) / 255.0;


		// call esam
		var activehandleTruePos = (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-handle-"+i).getBoundingClientRect().top) - 2.5;
		var prevhandleTruePos = ( document.getElementById("slider-handle-"+(i-1)) == null ? 0 : (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-handle-"+(i-1)).getBoundingClientRect().top) - 2.5 );
		slicer.editSlice(i, prevhandleTruePos, activehandleTruePos, new vector3(r, g, b), 100, 1);
	}
	slicer.editSlice(handlesNumber, activehandleTruePos, 500, new vector3(0.3, 0.5, 0.7), 100, 1);

	// remove remaning handles from the graphics slices
	for (var i = handlesNumber + 1; i < slicer.sliceLayers.length-1; i++) {
		slicer.removeSlice(i);
	};
}

//==================== layers data box
// to commit in esam code
function showLayersBox(handleIndex){
	if(handleIndex > -1 && handleIndex <= 10){
		document.getElementById("slider-layers-box").style.display = "block";
		document.getElementById("slider-layers-box").style.top = document.getElementById("slider-handle-"+handleIndex).getBoundingClientRect().top+"px";
		// update the layerbox info with the handle info
		var printType = layersInfo[handleIndex].type;
		if(printType == 0){
			selectLayerType(0);
			document.getElementById("normal-exposure-time-input").value = layersInfo[handleIndex].normalExposureTime;
			document.getElementById("normal-retract-speed-input").value = layersInfo[handleIndex].normalRetractSpeed;
			document.getElementById("normal-peeling-speed-input").value = layersInfo[handleIndex].normalPeelingSpeed;
			document.getElementById("normal-peeling-dist-input").value = layersInfo[handleIndex].normalPeelingDist;
			document.getElementById("normal-thickness-input").value = layersInfo[handleIndex].thickness;
		}
		else if(printType == 1){
			selectLayerType(1);
			document.getElementById("sequential-exposure-time-input").value = layersInfo[handleIndex].sequentialExposureTime;
			document.getElementById("sequential-speed-input").value = layersInfo[handleIndex].sequentialSpeed;
			document.getElementById("sequential-thickness-input").value = layersInfo[handleIndex].thickness;
		}
		else if(printType == 2){
			selectLayerType(2);
			document.getElementById("continuous-speed-input").value = layersInfo[handleIndex].continuousSpeed;
			document.getElementById("continuous-thickness-input").value = layersInfo[handleIndex].thickness;
		}

		// layer number
		document.getElementById("slider-layer-number").innerHTML = getLayerNumber(handleIndex);
		document.getElementById("slider-layer-number").style.display = "block";
		document.getElementById("slider-layer-number").style.top = document.getElementById("slider-handle-"+handleIndex).getBoundingClientRect().top+"px";
	
	}
	else{
		// hide the layers box if ti's the last handle instead of moving it down
		document.getElementById("slider-layers-box").style.display = "none";
		document.getElementById("slider-layer-number").style.display = "none";
	}
}

// just styling
function selectLayerType(layerType){
	document.getElementById("slider-layers-types-normal").style.backgroundColor = "whitesmoke";
	document.getElementById("slider-layers-types-sequential").style.backgroundColor = "whitesmoke";
	document.getElementById("slider-layers-types-continuous").style.backgroundColor = "whitesmoke";

	document.getElementById("slider-layers-data-normal").style.display = "none";
	document.getElementById("slider-layers-data-sequential").style.display = "none";
	document.getElementById("slider-layers-data-continuous").style.display = "none";

	if(layerType == 0){
		document.getElementById("slider-layers-types-normal").style.backgroundColor = "#4884da";
		document.getElementById("slider-layers-data-normal").style.display = "block";
	}
	else if(layerType == 1){
		document.getElementById("slider-layers-types-sequential").style.backgroundColor = "#4884da";
		document.getElementById("slider-layers-data-sequential").style.display = "block";
	}
	else if(layerType == 2){
		document.getElementById("slider-layers-types-continuous").style.backgroundColor = "#4884da";
		document.getElementById("slider-layers-data-continuous").style.display = "block";
	}
}

var layersInfo = [];
var QTlayersInfo = [];
function setSliderLayers(handleIndex, printType){

	var layerGeneralThikness;

	if(printType == 0){
		// normal
		var normalExposureTime = Number(document.getElementById("normal-exposure-time-input").value);
		var normalRetractSpeed = Number(document.getElementById("normal-retract-speed-input").value);
		var normalPeelingSpeed = Number(document.getElementById("normal-peeling-speed-input").value);
		var normalPeelingDist = Number(document.getElementById("normal-peeling-dist-input").value);
		var thickness = Number(document.getElementById("normal-thickness-input").value);

		var firstLayerNumber = ( layersInfo[handleIndex-1] == undefined ? 0 : layersInfo[handleIndex-1].end );
		var lastLayerNumber = getLayerNumber(handleIndex);

		var layerInfoObject = {'start':firstLayerNumber, 'end':lastLayerNumber, 'type':printType,
		'normalExposureTime':normalExposureTime, 'normalRetractSpeed':normalRetractSpeed, 'normalPeelingSpeed':normalPeelingSpeed,
		'normalPeelingDist': normalPeelingDist, 'thickness': thickness};

		layersInfo[handleIndex] = layerInfoObject;

		layerGeneralThikness = thickness;

		//========== QT
		var QTlayersInfoObject = [];
		QTlayersInfoObject.push(printType);
		QTlayersInfoObject.push(firstLayerNumber);
		QTlayersInfoObject.push(lastLayerNumber);
		QTlayersInfoObject.push(normalExposureTime);
		QTlayersInfoObject.push(normalRetractSpeed);
		QTlayersInfoObject.push(normalPeelingSpeed);
		QTlayersInfoObject.push(normalPeelingDist);
		QTlayersInfoObject.push(thickness);

		QTlayersInfo[handleIndex] = QTlayersInfoObject;
	}
	else if(printType == 1){
		// sequential
		var sequentialExposureTime = Number(document.getElementById("sequential-exposure-time-input").value);
		var sequentialSpeed = Number(document.getElementById("sequential-speed-input").value);
		var thickness = Number(document.getElementById("sequential-thickness-input").value);

		var firstLayerNumber = ( layersInfo[handleIndex-1] == undefined ? 0 : layersInfo[handleIndex-1].end );
		var lastLayerNumber = getLayerNumber(handleIndex, thickness);

		var layerInfoObject = {'start':firstLayerNumber, 'end':lastLayerNumber, 'type':printType,
		'sequentialExposureTime':sequentialExposureTime, 'sequentialSpeed':sequentialSpeed, 'thickness':thickness};

		layersInfo[handleIndex] = layerInfoObject;

		layerGeneralThikness = thickness;

		//========== QT
		var QTlayersInfoObject = [];
		QTlayersInfoObject.push(printType);
		QTlayersInfoObject.push(firstLayerNumber);
		QTlayersInfoObject.push(lastLayerNumber);
		QTlayersInfoObject.push(sequentialExposureTime);
		QTlayersInfoObject.push(sequentialSpeed);
		QTlayersInfoObject.push(thickness);

		QTlayersInfo[handleIndex] = QTlayersInfoObject;
	}
	else if(printType == 2){
		// continuous
		var continuousSpeed = Number(document.getElementById("continuous-speed-input").value);
		var thickness = Number(document.getElementById("continuous-thickness-input").value);
	
		var firstLayerNumber = ( layersInfo[handleIndex-1] == undefined ? 0 : layersInfo[handleIndex-1].end );
		var lastLayerNumber = getLayerNumber(handleIndex, thickness);

		var layerInfoObject = {'start':firstLayerNumber, 'end':lastLayerNumber, 'type':printType,
		'continuousSpeed':continuousSpeed, 'thickness': thickness};

		layersInfo[handleIndex] = layerInfoObject;

		layerGeneralThikness = thickness;

		//========== QT
		var QTlayersInfoObject = [];
		QTlayersInfoObject.push(printType);
		QTlayersInfoObject.push(firstLayerNumber);
		QTlayersInfoObject.push(lastLayerNumber);
		QTlayersInfoObject.push(continuousSpeed);
		QTlayersInfoObject.push(thickness);

		QTlayersInfo[handleIndex] = QTlayersInfoObject;
	}

	document.getElementById("slider-layers-box").setAttribute("class", "bounceout");
    document.getElementById("slider-layers-box").style.visibility = "hidden";

    // send slicer data to graphics slicer
    slicer.editSlice(handleIndex, null, null, null, layerGeneralThikness, 1);
}

function getLayerNumber(handleIndex){
	// position on the slider form 0 to 500
	var handleTruePos = (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-handle-"+handleIndex).getBoundingClientRect().top) - 2.5;
	var prevhandleTruePos = ( document.getElementById("slider-handle-"+(handleIndex-1)) == null ? 0 : (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById("slider-handle-"+(handleIndex-1)).getBoundingClientRect().top) - 2.5 );

	// position on the graphics vertices
	var handleVertPos = Number( (((handleTruePos - 0) / (500 - 0)) * (renderer.maxBounds.y - renderer.minBounds.y)).toFixed(0) );
	var prevhandleVertPos = Number( (((prevhandleTruePos - 0) / (500 - 0)) * (renderer.maxBounds.y - renderer.minBounds.y)).toFixed(0) );

	// number of layers in the current segment
	// max vert pos - min vert pos / (thikness/1000) to convert from micron to milli
	var layersNumber = (handleVertPos - prevhandleVertPos) / ( layersInfo[handleIndex].thickness /1000);
	
	var lastPrevLayerNumber = ( layersInfo[handleIndex-1] == undefined ? 0 : layersInfo[handleIndex-1].end );

	// last lauyer is equal to the last segment layer plus the last segment last layer
	var lastLayerNumber = lastPrevLayerNumber + layersNumber;

	return lastLayerNumber;
}

function resetSliderSlicer(){
	document.getElementById("slider-slicer-handle").style.top = document.getElementById("slider").getBoundingClientRect().top - (document.getElementById("slider-slicer-handle").getBoundingClientRect().height/2) + "px";

	var sliderSlicerPos = (document.getElementById("slider").getBoundingClientRect().bottom - document.getElementById('slider-slicer-handle').getBoundingClientRect().top) - document.getElementById('slider-slicer-handle').getBoundingClientRect().height/2;
	slicer.moveSingle(sliderSlicerPos);
}

// get infill data
function getInfillData(){
	var thicknessDensity = Number(document.getElementById("infill-thickness-density-input").value);
	var thickness = Number(document.getElementById("infill-thickness-input").value);
	var offsetThickness = Number(document.getElementById("infill-offset-thickness-input").value);
	var topLayers = Number(document.getElementById("infill-top-layers-input").value);
	var baseLayers = Number(document.getElementById("infill-base-layers-input").value);

	var infillData = {"thicknessDensity":thicknessDensity, "thickness":thickness, "offsetThickness":offsetThickness, "topLayers":topLayers, "baseLayers":baseLayers};

	return infillData;
}

// popup
function showPopup(msg){
	document.getElementById("popup").style.display = "flex";

	document.getElementById("popup-box-msg").innerHTML = msg;

	document.getElementById("popup").addEventListener('click', hidePopup);
}

function hidePopup(e, userClick){
	if(userClick){
		document.getElementById("popup").style.display = "none";
		document.getElementById("popup").removeEventListener('click', hidePopup);
	}
	else{
		if(e.target.id == "popup"){
			document.getElementById("popup").style.display = "none";
			document.getElementById("popup").removeEventListener('click', hidePopup);
		}
	}
}

// view mode cube
var xAngle = 0;
var yAngle = 0;
var zAngle = 0;
var axis = "Y";
function changeViewMode(face, dir){
	document.getElementById("cube-home").style.display = "block";
	if(face == "front"){
		document.getElementById("cube").style.transform = "rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(-10px)";
		axis = "Y";
		document.getElementById("cube-arrow-right").style.display = "block";
		document.getElementById("cube-arrow-left").style.display = "block";
		renderer.changeView("front");
	}
	else if(face == "top"){
		document.getElementById("cube").style.transform = "rotateY(0deg) rotateX(-90deg) rotateZ(0deg) translateZ(30px) translateY(-30px)";
		axis = "Z";
		document.getElementById("cube-arrow-right").style.display = "none";
		document.getElementById("cube-arrow-left").style.display = "none";
		renderer.changeView("top");
	}
	else if(face == "left"){
		document.getElementById("cube").style.transform = "rotateY(90deg) rotateX(0deg) rotateZ(0deg) translateY(-10px)";
		axis = "Y";
		document.getElementById("cube-arrow-right").style.display = "block";
		document.getElementById("cube-arrow-left").style.display = "block";
		renderer.changeView("left");
	}
	else if(face == "home"){
		document.getElementById("cube").style.transform = "rotateY(45deg) rotateX(-25deg) rotateZ(-25deg)";
		xAngle = 0; yAngle = 0; zAngle = 0;
		document.getElementById("cube-arrow-right").style.display = "none";
		document.getElementById("cube-arrow-left").style.display = "none";
		document.getElementById("cube-home").style.display = "none";
		renderer.changeView("home");
	}
	
	if(face == "none"){
		if(axis == "Y"){
			if(dir == "left"){
				document.getElementById("cube").style.transform = "rotateY("+(yAngle+90)+"deg) rotateX(0deg) rotateZ(0deg) translateY(-10px)";
				yAngle += 90;
				renderer.changeView("none", "Y", 90);
			}
			else if(dir == "right"){
				document.getElementById("cube").style.transform = "rotateY("+(yAngle-90)+"deg) rotateX(0deg) rotateZ(0deg) translateY(-10px)";
				yAngle -= 90;
				renderer.changeView("none", "Y", -90);
			}
		}
	}
}

//======================================================================================
//======================================================================================

function selectObject(obj){
	var objNumber = obj.innerHTML.split(":")[0];

	if(CSGOperationMode == 0){
		document.getElementById("current-objects").children[renderer.activeRenderable].style.backgroundColor = "gray";
		//renderer.activeRenderable = objNumber - 1;
		document.getElementById("current-objects").children[renderer.activeRenderable].style.backgroundColor = "brown";
	}
	else if(CSGOperationMode == 1){
		CSGOperationObject = objNumber-1;
		subtractTool();
	}
	else if(CSGOperationMode == 2){
		CSGOperationObject = objNumber-1;
		unionTool();
	}
	else if(CSGOperationMode == 3){
		CSGOperationObject = objNumber-1;
		intersectTool();
	}
}

//======================================================================	

var translateInterval;
function translateBtnUp(){
	clearInterval(translateInterval);
}

function translateBtnDown(axis, value){
	translateInterval = setInterval( function(){translateTool(axis, value);}, 100 );
}

function translateTool(axis, value){
	if(renderer.renderables.length > 0) 
	{
		var index = renderer.activeRenderable;

		if (index != -1) 
		{
			if(axis == "x"){
				if(value>0){
					value = Math.abs(value);				
					renderer.renderables[index].transform.position.x += value;
				}
				else{
					value = Math.abs(value);
					renderer.renderables[index].transform.position.x -= value;
				}
			}
			else if(axis == "y"){
				if(value>0){
					value = Math.abs(value);
					renderer.renderables[index].transform.position.y += value;
				}
				else{
					value = Math.abs(value);
					renderer.renderables[index].transform.position.y -= value;	
				}
			}
			else if(axis == "z"){
				if(value>0){
					value = Math.abs(value);
					renderer.renderables[index].transform.position.z += value;
				}
				else{
					value = Math.abs(value);
					renderer.renderables[index].transform.position.z -= value;	
				}
			}
		}
	}
}

function centerTool(){
	if(renderer.renderables.length > 0) 
	{
		var index = renderer.activeRenderable;
		renderer.renderables[index].transform.position = new vector3();
	}
}

function rotateTool(valueX, valueY, valueZ)
{
	if(renderer.renderables.length > 0) 
	{
		var index = renderer.activeRenderable;
		if (index != -1) 
		{
			if (valueX != null) 
			{
				renderer.renderables[index].transform.rotation.x += Number(valueX);
			}

			if (valueY != null) 
			{
				renderer.renderables[index].transform.rotation.z += Number(valueY);
			}

			if (valueZ != null) 
			{
				renderer.renderables[index].transform.rotation.y += Number(valueZ);
			}
		}		
	}
}

function scaleTool(valueX, valueY, valueZ)
{
	if(renderer.renderables.length > 0) 
	{
		var index = renderer.activeRenderable;
		if (index != -1) 
		{
			if (valueX != null) 
			{
				renderer.renderables[index].transform.scale.x = Number(valueX);
			}

			if (valueY != null) 
			{
				renderer.renderables[index].transform.scale.y = Number(valueY);
			}

			if (valueZ != null) 
			{
				renderer.renderables[index].transform.scale.z = Number(valueZ);
			}
		}		
	}
}

function addCuboid()
{
	// renderer.addRenderable(new renderable(createCuboid(new vector3(0, 0, 0), new vector3(1, 1, 1))
	// 							, new vector3(0.7, 0.4, 1)
	// 							, new transform(new vector3(-4, 0, 0))));
}

function deleteTool(){
	if(renderer.renderables.length > 0) 
	{
		var index = renderer.activeRenderable;

		renderer.removeRenderable(index);
		
		if(index+1 > renderer.renderables.length){
			renderer.activeRenderable = renderer.renderables.length - 1;
		}
	}
	else{
		showPopup("There are no Objects To Delete");
	}
}

function downloadObject(){
	
	function ObjectBoundary(v){
		var ObjMaxX = -99999999; var ObjMinX = 99999999;
		var ObjMaxY = -99999999; var ObjMinY = 99999999;
		var ObjMaxZ = -99999999; var ObjMinZ = 99999999;
		for(var i=0; i<v.length; i+=3){
			
			if(v[i] >= ObjMaxX){
				ObjMaxX = v[i];
			}
			else if(v[i] <= ObjMinX){
				ObjMinX = v[i];
			}

			if(v[i+1] >= ObjMaxY){
				ObjMaxY = v[i+1];
			}
			else if(v[i+1] <= ObjMinY){
				ObjMinY = v[i+1];
			}

			if(v[i+2] >= ObjMaxZ){
				ObjMaxZ = v[i+2];
			}
			else if(v[i+2] <= ObjMinZ){
				ObjMinZ = v[i+2];
			}
		}

		var ObjBoundryArr = [];
		ObjBoundryArr.push(ObjMaxX);ObjBoundryArr.push(ObjMinX);
		ObjBoundryArr.push(ObjMaxY);ObjBoundryArr.push(ObjMinY);
		ObjBoundryArr.push(ObjMaxZ);ObjBoundryArr.push(ObjMinZ);

		return ObjBoundryArr;
	}

	// download
	function download(VerticesD, NormalsD){
		//Center the Vertices
		var VBoundries = ObjectBoundary(VerticesD);
		var Vxdiff = ( VBoundries[0] + VBoundries[1] ) /2;
		var Vydiff = ( VBoundries[2] + VBoundries[3] ) /2;
		var Vzdiff = ( VBoundries[4] + VBoundries[5] ) /2;
		
		for(var i=0; i<VerticesD.length; i+=3){
			VerticesD[i] -= Vxdiff;
			VerticesD[i+1] -= Vydiff;
			VerticesD[i+2] -= Vzdiff; //- ( (VBoundries[0] - VBoundries[1]) / 2 );
		}
		// end of center

		var filename = "3DS.stl";

		var buffer = new ArrayBuffer(84 + (50 * VerticesD.length/3));
		var dataview = new DataView(buffer);
		var offset = 0;
		var isLittleEndian = true;

		// To skip data, no need to write zeros, just increase the offset
		offset += 80 // For the STL header 

		dataview.setUint32(offset, VerticesD.length/3, isLittleEndian);
		offset += 4;

		var normalsIndex = 0;
		for(var i=0; i < VerticesD.length; i+=9) {
			// normals
			dataview.setFloat32(offset, NormalsD[normalsIndex], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, NormalsD[normalsIndex+1], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, NormalsD[normalsIndex+2], isLittleEndian);
			offset += 4;

			//increase normals index
			normalsIndex+=3;

			// vertices
			dataview.setFloat32(offset, VerticesD[i], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+1], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+2], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+3], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+4], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+5], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+6], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+7], isLittleEndian);
			offset += 4;
			dataview.setFloat32(offset, VerticesD[i+8], isLittleEndian);
			offset += 4;
		

			offset += 2; // unused 'attribute byte count' is a Uint16
	    }

	    var blobD = new Blob([dataview], {type: 'application/octet-binary'});

		var element = document.createElement('a');
		element.setAttribute('href', window.URL.createObjectURL(blobD) );
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		window.URL.revokeObjectURL(window.URL.createObjectURL(blobD));

		document.body.removeChild(element);
	}


	if(renderer.renderables.length > 0)
	{
		var VerticesDTemp = [];
		var NormalsDTemp = [];
		for(var i=0; i<renderer.renderables.length; i++){
			for(var k=0; k<renderer.renderables[i].mesh.vertices.length; k++){
				VerticesDTemp.push(renderer.renderables[i].mesh.vertices[k].x);
				VerticesDTemp.push(renderer.renderables[i].mesh.vertices[k].y);
				VerticesDTemp.push(renderer.renderables[i].mesh.vertices[k].z);

				if(k%3 == 0){
					NormalsDTemp.push(renderer.renderables[i].mesh.vertices[k].x);
					NormalsDTemp.push(renderer.renderables[i].mesh.vertices[k].y);
					NormalsDTemp.push(renderer.renderables[i].mesh.vertices[k].z);
				}
			}
		}

		download(VerticesDTemp, NormalsDTemp);
	}
	else{
		showPopup("There are no Objects to Download");
	}
}

//=======================================================

// first the subtract tool set the CSGOperationMode to "1" then when the user choose
//another object form the list it call the subtract tool function again but this time the CSGOperationMode is "1"
// and it has the CSGOperationObject which is the second object to do the operation on
function subtractTool(){
	if(renderer.renderables.length > 0){
		var index = renderer.activeRenderable;

		if(CSGOperationMode == 1){
			// second time with selected object
			var object1 = VerticesToCSG(renderer.renderables[index].mesh.vertices, renderer.renderables[index].mesh.normals, renderer.renderables[index].transform);
			var object2 = VerticesToCSG(renderer.renderables[CSGOperationObject].mesh.vertices, renderer.renderables[CSGOperationObject].mesh.normals, renderer.renderables[CSGOperationObject].transform);
			var object1CSG = new CSG.fromPolygons(object1);
			var object2CSG = new CSG.fromPolygons(object2);

			var outPolygons = object1CSG.subtract(object2CSG).toPolygons();
			
			var trans = new transform();
			
			if(renderer.renderables[index].transform.position.x != trans.position.x)
			{
				trans.position.x -= renderer.renderables[index].transform.position.x;
			}

			if(renderer.renderables[index].transform.position.y != trans.position.y)
			{
				trans.position.y -= renderer.renderables[index].transform.position.y;
			}

			if(renderer.renderables[index].transform.position.z != trans.position.z)
			{
				trans.position.z -= renderer.renderables[index].transform.position.z;
			}
///////////////////////////////////////////////////
			if(renderer.renderables[index].transform.rotation.x != trans.rotation.x)
			{
				trans.rotation.x -= renderer.renderables[index].transform.rotation.x;
			}

			if(renderer.renderables[index].transform.rotation.y != trans.rotation.y)
			{
				trans.rotation.y -= renderer.renderables[index].transform.rotation.y;
			}

			if(renderer.renderables[index].transform.rotation.z != trans.rotation.z)
			{
				trans.rotation.z -= renderer.renderables[index].transform.rotation.z;
			}
///////////////////////////////////////////////////

			var objectVertices = CSGToVertices(outPolygons, trans);
			var objectNormals = CSGToNormals(outPolygons, trans);

			var objectMesh = createMesh(objectVertices, objectNormals, null);
			renderer.renderables[index].transform.scale = new vector3(1, 1, 1);
			// adding the new object
			renderer.renderables[index].mesh = objectMesh;

			// delete the two old objects
			renderer.removeRenderable(CSGOperationObject);

			updateHtmlObjects();

			CSGOperationMode = 0;
		}
		else{
			CSGOperationMode = 1;
		}
		objectsListAnimatiom();
	}
}

function unionTool(){
	if(renderer.renderables.length > 0){
		var index = renderer.activeRenderable;

		if(CSGOperationMode == 2){
			// second time with selected object
			var object1 = VerticesToCSG(renderer.renderables[index].mesh.vertices, renderer.renderables[index].mesh.normals, renderer.renderables[index].transform);
			var object2 = VerticesToCSG(renderer.renderables[CSGOperationObject].mesh.vertices, renderer.renderables[CSGOperationObject].mesh.normals, renderer.renderables[CSGOperationObject].transform);
			var object1CSG = new CSG.fromPolygons(object1);
			var object2CSG = new CSG.fromPolygons(object2);

			var outPolygons = object1CSG.union(object2CSG).toPolygons();
			
			var trans = new transform();
			
			if(renderer.renderables[index].transform.position.x != trans.position.x)
			{
				trans.position.x -= renderer.renderables[index].transform.position.x;
			}

			if(renderer.renderables[index].transform.position.y != trans.position.y)
			{
				trans.position.y -= renderer.renderables[index].transform.position.y;
			}

			if(renderer.renderables[index].transform.position.z != trans.position.z)
			{
				trans.position.z -= renderer.renderables[index].transform.position.z;
			}
///////////////////////////////////////////////////
			if(renderer.renderables[index].transform.rotation.x != trans.rotation.x)
			{
				trans.rotation.x -= renderer.renderables[index].transform.rotation.x;
			}

			if(renderer.renderables[index].transform.rotation.y != trans.rotation.y)
			{
				trans.rotation.y -= renderer.renderables[index].transform.rotation.y;
			}

			if(renderer.renderables[index].transform.rotation.z != trans.rotation.z)
			{
				trans.rotation.z -= renderer.renderables[index].transform.rotation.z;
			}
///////////////////////////////////////////////////

			var objectVertices = CSGToVertices(outPolygons, trans);
			var objectNormals = CSGToNormals(outPolygons, trans);

			var objectMesh = createMesh(objectVertices, objectNormals, null);
			renderer.renderables[index].transform.scale = new vector3(1, 1, 1);
			// adding the new object
			renderer.renderables[index].mesh = objectMesh;

			// delete the two old objects
			renderer.removeRenderable(CSGOperationObject);

			updateHtmlObjects();

			CSGOperationMode = 0;
		}
		else{
			CSGOperationMode = 2;
		}
		objectsListAnimatiom();
	}
}

function intersectTool(){
	if(renderer.renderables.length > 0){
		var index = renderer.activeRenderable;

		if(CSGOperationMode == 3){
			// second time with selected object
			var object1 = VerticesToCSG(renderer.renderables[index].mesh.vertices, renderer.renderables[index].mesh.normals, renderer.renderables[index].transform);
			var object2 = VerticesToCSG(renderer.renderables[CSGOperationObject].mesh.vertices, renderer.renderables[CSGOperationObject].mesh.normals, renderer.renderables[CSGOperationObject].transform);
			var object1CSG = new CSG.fromPolygons(object1);
			var object2CSG = new CSG.fromPolygons(object2);

			var outPolygons = object1CSG.intersect(object2CSG).toPolygons();
			
			var trans = new transform();
			
			if(renderer.renderables[index].transform.position.x != trans.position.x)
			{
				trans.position.x -= renderer.renderables[index].transform.position.x;
			}

			if(renderer.renderables[index].transform.position.y != trans.position.y)
			{
				trans.position.y -= renderer.renderables[index].transform.position.y;
			}

			if(renderer.renderables[index].transform.position.z != trans.position.z)
			{
				trans.position.z -= renderer.renderables[index].transform.position.z;
			}
///////////////////////////////////////////////////
			if(renderer.renderables[index].transform.rotation.x != trans.rotation.x)
			{
				trans.rotation.x -= renderer.renderables[index].transform.rotation.x;
			}

			if(renderer.renderables[index].transform.rotation.y != trans.rotation.y)
			{
				trans.rotation.y -= renderer.renderables[index].transform.rotation.y;
			}

			if(renderer.renderables[index].transform.rotation.z != trans.rotation.z)
			{
				trans.rotation.z -= renderer.renderables[index].transform.rotation.z;
			}
///////////////////////////////////////////////////

			var objectVertices = CSGToVertices(outPolygons, trans);
			var objectNormals = CSGToNormals(outPolygons, trans);

			var objectMesh = createMesh(objectVertices, objectNormals, null);
			renderer.renderables[index].transform.scale = new vector3(1, 1, 1);
			// adding the new object
			renderer.renderables[index].mesh = objectMesh;

			// delete the two old objects
			renderer.removeRenderable(CSGOperationObject);

			updateHtmlObjects();

			CSGOperationMode = 0;
		}
		else{
			CSGOperationMode = 3;
		}
		objectsListAnimatiom();
	}
}

function objectsListAnimatiom(){
	var index = renderer.activeRenderable;
	if(CSGOperationMode != 0){
		for(var i=0; i<renderer.renderables.length; i++){
			document.getElementById("current-objects").children[i].setAttribute("class", "pulse");
		}
		document.getElementById("choose-object-hint").style.display = "block";
	}
	else{
		for(var i=0; i<renderer.renderables.length; i++){
			document.getElementById("current-objects").children[i].setAttribute("class", "");
		}
		document.getElementById("choose-object-hint").style.display = "none";

		if(index > renderer.renderables.length){
			document.getElementById("current-objects").children[renderer.renderables.length-1].style.backgroundColor = "brown";
		}
		else{
			document.getElementById("current-objects").children[index].style.backgroundColor = "brown";
		}
	}
}