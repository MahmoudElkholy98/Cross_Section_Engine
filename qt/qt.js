function qtToJs(){

	document.getElementById('tool-list-label-slice').click();

	var LayersArrayToQt = [];
	for(var i = 0; i < QTlayersInfo.length; i++)
    {
        LayersArrayToQt = LayersArrayToQt.concat(QTlayersInfo[i]);
    }
    LayersArrayToQt = JSON.stringify(LayersArrayToQt);

    return LayersArrayToQt;
}

function changeDocumentTitleForQtToStart(){
	// document.title = document.title.substr(0, document.title.length-1) + "1";	
}