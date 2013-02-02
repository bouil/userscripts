function getElementsByClass(searchClass, node, tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

var POLICE_CLASS = ["tbody", "body"];
var POLICE_DEFAULT = ["100", "80"];
var POLICE_EXPIRE = 1000*60*15;

/**
 * Methode permettant d'agrandir ou de retrecir la taille de la police.
 * 
 * @param classe
 * @param taille
 * @param defaut
 * @return
 */
function tailleFonte(classe, taille, defaut) {
	pos = 0;
	
	var policeSize = getCookieFonte("policeSize");
	if(policeSize == null){
		policeSize = parseInt(taille);
	}else{
		var currentTaille =0;
		var currentTaille = parseInt(taille);
		if(policeSize != "default"){
			policeSize = parseInt(policeSize) + currentTaille;
		}else{
			policeSize = currentTaille;
		}
	}
	addCookieFonte("policeSize",policeSize, POLICE_EXPIRE);
	
	for(k=0;k<POLICE_CLASS.length;k++){
		zones = document.getElementsByTagName(POLICE_CLASS[k]);
		if(defaut=="default"){
			addCookieFonte("policeSize","default" , POLICE_EXPIRE);
			for(i=0; i<zones.length; i++){
				zone = zones[i];
				zone.style.fontSize = POLICE_DEFAULT[k] + "%";
			}
		}else{
			resizePolice(taille, zones, POLICE_DEFAULT[k]);
		}
	}
}

/**
 * Redimenssion la police.
 * 
 * @param taille
 * @param zones
 * @return
 */
function resizePolice(taille, zones, police){
	for(i=0; i<zones.length; i++){
		zone = zones[i];
		if(!zone.style.fontSize){
			zone.style.fontSize = police + "%";
		}
		if((parseInt(taille)<0 && parseInt(zone.style.fontSize)>50) || (parseInt(taille)>0 && parseInt(zone.style.fontSize)<200)){
			zone.style.fontSize = parseInt(zone.style.fontSize) + parseInt(taille) + "%";
		}
	}
}

function initializePoliceSize(){
	var policeSize = getCookieFonte("policeSize");
	if(policeSize!=null && policeSize != "default"){
		for(k=0;k<POLICE_CLASS.length;k++){
			zones = document.getElementsByTagName(POLICE_CLASS[k]);
			resizePolice(policeSize, zones, POLICE_DEFAULT[k]);
		}
	}
}

/**
 * Permet d'ajouter le cookie prenant en charge la taille de la police.
 * 
 * @param c_name
 * 	Nom du cookie
 * @param value
 * 	Valeur
 * @param exdaysInMillis
 * 	Date d'expiration
 * @return
 */
function addCookieFonte(c_name,value,exdaysInMillis)
{
	var exdate=new Date();
	exdate.setTime(exdate.getTime() + exdaysInMillis);
	var c_value=escape(value) + ((exdaysInMillis==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

/**
 * Permet de retrouver la valeur d'un cookie
 * 
 * @param c_name
 * 	Nom du cookie.
 * @return
 */
function getCookieFonte(c_name)
{
	var cookies =document.cookie.split(";");
	for (i=0;i<cookies.length;i++)
	{
		x=cookies[i].substr(0,cookies[i].indexOf("="));
		y=cookies[i].substr(cookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name){
			return unescape(y);
		}
	}
	return null;
}

/**
 * Ajout de l'evenement pour redimensionner la taille de la police. 
 */
if ( document.addEventListener ) {
	// A fallback to window.onload, that will always work
	window.addEventListener( "load", initializePoliceSize, false );
// If IE event model is used
} else if ( document.attachEvent ) {
	window.attachEvent( "onload", initializePoliceSize);
}