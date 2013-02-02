function z(){
	return true;
}

/**
 * Projet SAV : fonction permettant de mettre le bon fond sur les boutons contenus dans des iframes.
 * @param id l'id du bouton dont on désire changer le fond.
 */

function savPubliButtonColor(id){							
	if(navigator.appVersion.indexOf("MSIE 6.0") != -1|| navigator.appVersion.indexOf("MSIE 7.0") != -1 || navigator.appVersion.indexOf("MSIE 8.0") != -1){
		document.getElementById(id).style.background= "#EAEAEA url('/SCUW/publication/pages/pj/boutonSav-bg.png') repeat-x top";  
	}
	document.getElementById(id).style.display = "inline-block";
	}