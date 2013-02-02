function addEvent(elm, evType, fn, useCapture)
{
	  if (elm.addEventListener){
	    elm.addEventListener(evType, fn, useCapture);
	    return true;
	  } else if (elm.attachEvent){
	    var r = elm.attachEvent("on"+evType, fn);
	    return r;
	  } else {
	    	//fonctionnalité non supportée
	  }
}

/**
* Active l'affichage de l'image de fond en bas de page
*/
function activeHabillageBottom(){
		var elementTr = document.getElementById("habillage-bottom");
		var elementTd = document.createElement('td');
		elementTd.colSpan = 2;
		var elementImg = document.createElement('img');
		elementImg.src = imagePath;
		elementTd.appendChild(elementImg);
		elementTr.appendChild(elementTd);
}

/**
*Permet de charger l'image de fond en bas de page apres chargement de la page html
*/
function loadHabillageBottom(){
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", activeHabillageBottom, false);
	}else{
		addEvent(window, "load", activeHabillageBottom);
	}
}
	