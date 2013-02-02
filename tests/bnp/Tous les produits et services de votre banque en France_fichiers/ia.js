function callIAWithForm(url, serviceName, form, divId ){
	//obtain the form
	var params = Form.serialize(form, true);
	callIA(url, serviceName, params, divId);
}

function callIAWithParams(url, serviceName, params, divId ){
	callIA(url, serviceName, params, divId);
}

function getTransport(){
	 try { return new XMLHttpRequest(); } catch(e) {}
     try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
     try { return new ActiveXObject('Microsoft.XMLHTTP')} catch (e) {}
	return false;
}
/**
* Permet d'appeler les IA en mode asynchrone. 
* 
* 
* @param url
* 	Url du proxy
* @param serviceName
* 	Service
* @param params
* 	Parametres
* @param divId
* 	Element d'insertion du contenu html.
* @return
*/
function callIA(url, serviceName, params, page, methodSuccess){
	var xhReq = getTransport();
	xhReq.open("get", url + "?cleOutil=" +serviceName+"&mode=asyn&cache="+(new Date()).getTime(), true);
	xhReq.onreadystatechange = function() {
	   if (xhReq.readyState != 4)  { return; }
	   var serverResponse = xhReq.responseText;
	   if(serverResponse.indexOf("ERROR")>=0){
		   var msg = serverResponse.split(';');
		   if(msg[1] == "DISCONNECT"){
			   document.location.href="/banque/portail/particulier/HomeConnexion?type=homeconnex";
		   }
	   }else{
		   document.getElementById(page).innerHTML = serverResponse;
		   methodSuccess();
	   }
	 };
	 xhReq.send(null);
}

