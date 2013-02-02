var openIAConseiller = false;
var loadIAConseiller = false;

//duplication de code afin de permettre l'intégration sur toutes les pages du portail.
var ns4 = (document.layers)? true:false; //NS 4
var ie4 = (document.all)? true:false; //IE 4
var dom = (document.getElementById)? true:false; //DOM 
function getTop(MyObject) {
    if (dom || ie4) {
        if (MyObject.offsetParent)
            return (MyObject.offsetTop + getTop(MyObject.offsetParent));
        else
            return (MyObject.offsetTop);
    }
    if (ns4) return (MyObject.y);
}


function showConseillerIA(proxyUrl, bloc){
	if(loadIAConseiller){
		showConseiller();
	}else{
		callIA(proxyUrl, "IA_CONSEILLER", {}, bloc, showConseiller);
	}
}

function showConseiller() {
	 var topElement = getTop(document.getElementById("monConseillerOpen"));
	 if(document.getElementById("blocConseiller2").style.visibility == "visible") {
		//document.getElementById("blocConseiller2").style.display = "none";
		document.getElementById("blocConseiller2").style.visibility="hidden";
	 	if(document.getElementById("numeroDeCompte"))
	 		document.getElementById("numeroDeCompte").style.visibility = "";
	 	}
	 else {
		document.getElementById("blocConseiller2").style.visibility="visible";
	 	document.getElementById("blocConseiller2").style.top = topElement - 30 + "px";
	 	document.getElementById("blocConseiller2").style.left = "3px";
	 	document.getElementById("blocConseiller2").style.display = "block";
	 	if(document.getElementById("numeroDeCompte"))
			document.getElementById("numeroDeCompte").style.visibility = "hidden";
	 }
}

function hideConseiller(){
	showConseiller();
	openIAConseiller=false;
}