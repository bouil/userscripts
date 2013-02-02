/**
 * Ouvre un popup. 
 * L'arriere de l'écran est grisé.
 * 
 * @param url : page à acceder.
 * @param dialogName : Nom de la popup
 * @param postData : les données transmises
 * @param imgWait : image d'attende
 * @param titleDialog : titre de la popup
 * @param disconnect : Permet de spécifier si on ne veut pas du controle de déconnexion (par exemple : affichage de la mire de connexion dans une popup)
 * @return l'ouverture de la popup.
 */
function openPageInDialog(url, dialogName, postData, imgWait, titleDialog, resizable, widthD, height, disconnect, position){

	var flagOpen = false;
	var flagSuccess = false;
		
	if(!postData){
		postData = {};
	}
	if(typeof postData == "object") {
		postData.random = Math.floor(Math.random()*1000000000000000000000);
	} else {
		postData += "&random="  + Math.floor(Math.random()*1000000000000000000000);
	}
	
	if(position == null){
		position = 'center';
	}
	
	if(imgWait == null || imgWait == ''){
		imgWait = "/SCUW/images/waitRond.gif";
	}
	
	if(resizable == null) {
		resizable = false;
	}

	if(position == null){
		position = 'center';
	}
	
	if(typeof(jQuery("#" + dialogName).attr("id"))=='undefined'){
		jQuery("body").after("<div id=\"" + dialogName + "\"></div>");
	}
	
	var dialogJ = $("#" + dialogName);
	
	if(dialogJ.dialog('isOpen') != true && dialogJ.contents().length == 0){
		dialogJ.dialog({
			beforeclose: function(event, ui){
				dialogJ.html("");
			},
			open: function(event, ui){
				dialogJ.show('scale', function(){
					if(flagSuccess) {
						dialogJ.dialog('option', 'position', position);
					}
					flagOpen = true
				});
			},
			close: function(event, ui) {
				jQuery('#componentContainer').removeClass('impressionPageNone');
				dbClick=true;
			},
			bgiframe:true,
			modal: true,
			resizable: false,
			draggable: true,
			autoOpen: false,
			show: 'scale',
			hide: 'scale',
			resize: 'auto',
			closeOnEscape : true,
			closeText: 'hide',
			width: 'auto',
			height: 'auto',
			position: position,
			cache:false,
			stack:true
		});
		
	}
	
	if(titleDialog != null){
		//var d = dialogJ.dialog();
		dialogJ.dialog("option", "title", titleDialog);
	}
	
	jQuery.ajax({
		type: "POST",
		url: url,
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		dataType : "html",
		data : postData,
		error:  function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.responseText != ""){
				dialogJ.html(XMLHttpRequest.responseText);
			}else{
				dialogJ.html("Suite à  un incident, nous ne pouvons donner suite à  votre demande. Veuillez nous en excuser");
			}
			if(flagOpen || (dialogJ.dialog('isOpen') == true && dialogJ.contents().length != 0)) {
				dialogJ.dialog('option', 'position', position);
			}
			flagSuccess = true;
		},
		success: function(html, textStatus){
			//Si c'est le formulaire d'authentification, on redirige en pleine page vers UAUT. 
			if(html.indexOf("/outil/UAUT/Authentication/authenticate") != -1 && (disconnect == undefined || disconnect == null)){
				document.location.href="/outil/UAUT/Accueil/index";
			}else{
				dialogJ.html("<div id=\"contenuPopup\">"+ html + "</div>");
				//fix la taille de la popup sous IE7
				if(jQuery.browser.msie && jQuery.browser.version.substr(0,1) == "7") {
					dialogJ.dialog('option', 'width', widthD);
				}
				if(flagOpen || (dialogJ.dialog('isOpen') == true && dialogJ.contents().length != 0)) {
					dialogJ.dialog('option', 'position', position);
				}
				flagSuccess = true;
			}
		}
	});
	
	if(dialogJ.dialog('isOpen') != true && dialogJ.contents().length == 0){
		var content = "<br/><br/><br/><img class=\"centrer\" src=\"" + imgWait + "\" border=\"0\" />";
		//fix la taille de la popup en attente sous IE7
		if(jQuery.browser.msie && jQuery.browser.version.substr(0,1) == "7") {
			content = "<div style='width:30px'>" + content + "</div>" ;
		}
		dialogJ.html(content);
		dialogJ.dialog('open');
	}
	
	/** Permet d'imprimer que la dialog via le bouton impression du navigateur **/
	jQuery('#componentContainer').addClass('impressionPageNone');
	/****************************************************************************/
}


/**
* Ouvre un popup pour majic. 
* L'arriere de l'écran est grisé.
* 
* @param url : page à acceder.
* @param dialogName : Nom de la popup
* @param postData : les données transmises
* @position position : la position .
* @return l'ouverture de la popup.
*/
function openPageInDialogMajic(url, dialogName, postData, position){
	var dialogJ = $("#" + dialogName);
	
	if(position == null){
		position = 'center';
	}
	
	jQuery.ajax({
		type: "POST",
		url: url,
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		dataType : "html",
		data : postData,
		error:  function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.responseText != ""){
				dialogJ.html(XMLHttpRequest.responseText);
			}else{
				dialogJ.html("Suite à  un incident, nous ne pouvons donner suite à  votre demande. Veuillez nous en excuser");
			}
			dialogJ.dialog('option', 'position', position);
			flagSuccess = true;
		},
		success: function(html, textStatus){
				dialogJ.html("<div id=\"contenuPopup\">"+ html + "</div>");
				dialogJ.dialog('option', 'position', position);
		}
		
	});
}


/**
 * Ouvre une popup, avec des dimention fixe.
 * @param page : url de la page
 * @param nomPopup : nom de la popup
 */
 function ouvrirPopup(page, nomPopup){	 
	  window.open(page,nomPopup,'width=300, height=250');
 }