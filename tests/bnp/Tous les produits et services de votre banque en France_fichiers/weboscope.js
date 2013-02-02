<!--
(document.URL.indexOf("https://") != -1)? WEBO_CONNEXION = "https://" : WEBO_CONNEXION = "http://";
SERVERDEV = "comptintra.dev.echonet"
SERVERSTAGINGINTRA = "comptintra.staging.echonet"
SERVERSTAGINGINTER = "comptinter.staging.echonet"
SERVERINTRA = "statsweb.sig.echonet"
SERVERINTER = "statsweb.bnpparibas.com"
SERVERINTERQ = "bnpparibas.weborama.fr"
WEBO_SERVEUR = SERVERINTER;
WEBOID=100;
WEBOID_FICHE=204;
WEBO_TIME = new Date();
WEBO_TIME = parseInt(WEBO_TIME.getTime());
WEBO_ZONE=0;
WEBO_PAGE=0;
WEBO_ARG1=0;
WEBO_ARG2=0;
WEBO_ARG3=0;
WEBO_ARG4=0;
WEBO_ZONE_FICHE=0;
WEBO_PAGE_FICHE=0;
WEBO_ARG1_FICHE=0;
WEBO_FICHE_NB_APPELS = 0;
WEBO_FICHE_OK = false;
WEBO_ARGS234 = new Array();
function webo_args(arg2, arg3, arg4) {
  this.WEBO_ARG2_FICHE = arg2;
  this.WEBO_ARG3_FICHE = arg3;
  this.WEBO_ARG4_FICHE = arg4;
}
function webo_addStatArgs(arg2, arg3, arg4) {
	WEBO_ARGS234[WEBO_FICHE_NB_APPELS] = new webo_args(arg2, arg3, arg4);
	WEBO_FICHE_NB_APPELS ++;
}
function webo_ficheAppels() {
	if (WEBO_FICHE_OK) {
	
		if (WEBO_FICHE_NB_APPELS == 0) {
			webo_addStatArgs(0, 0, 0);
		}
		for (i=0; i<WEBO_FICHE_NB_APPELS; i++) {
			webo_zpi(WEBOID_FICHE, WEBO_ZONE_FICHE, WEBO_PAGE_FICHE, WEBO_TIME, WEBO_ARG1_FICHE, WEBO_ARGS234[i].WEBO_ARG2_FICHE, WEBO_ARGS234[i].WEBO_ARG3_FICHE, WEBO_ARGS234[i].WEBO_ARG4_FICHE);
		}
	}
}
function webo_siteAppel_pnp() {
	WEBO_SERVEUR=WEBO_SERVEUR_PNP;
	webo_zpi(WEBOID_PNP, WEBO_ZONE_PNP, WEBO_PAGE_PNP, WEBO_TIME, WEBO_ARG1_PNP, WEBO_ARG2, WEBO_ARG3, WEBO_ARG4);
}
function webo_siteAppel() {
	webo_zpi(WEBOID, WEBO_ZONE, WEBO_PAGE, WEBO_TIME, WEBO_ARG1, WEBO_ARG2, WEBO_ARG3, WEBO_ARG4);
}
function webo_zpi(_WEBOID, _WEBOZONE, _WEBOPAGE, _WEBOTIME, _WEBOARG1, _WEBOARG2, _WEBOARG3, _WEBOARG4) {
  	var wbs_da = new Date();
	_WEBOTIME = parseInt(wbs_da.getTime()) - _WEBOTIME;
	wbs_da = parseInt(wbs_da.getTime()/1000 - 60*wbs_da.getTimezoneOffset());
	var wbs_ref = '' + escape(document.referrer);
	var wbs_ta = '0x0';
	var wbs_co = 0;
	var wbs_nav = navigator.appName;
	if (parseInt(navigator.appVersion) >= 4) {
		wbs_ta = screen.width + "x" + screen.height;
		wbs_co = (wbs_nav!="Netscape")? screen.colorDepth : screen.pixelDepth;
	}
	
	// pour tests
	var wbs_arg = WEBO_CONNEXION + WEBO_SERVEUR + "/fcgi-bin/comptage.fcgi?ID=" + _WEBOID;
	wbs_arg += "&ZONE=" + _WEBOZONE + "&PAGE=" + _WEBOPAGE;
	wbs_arg += "&ver=2&da2=" + wbs_da + "&ta=" + wbs_ta + "&co=" + wbs_co + "&ref=" + wbs_ref;
	wbs_arg += "&BNP1=" + _WEBOTIME + "&BNP2=" + _WEBOARG1 + "&BNP3=" + _WEBOARG2 + "&BNP4=" + _WEBOARG3 + "&BNP5=" + _WEBOARG4;

	var wbs_t = " border='0' height='1' width='1' alt=''>";
	if (parseInt(navigator.appVersion) >= 3) {
		webo_compteur = new Image(1,1);
		webo_compteur.src = wbs_arg;
		
	} else {
		document.write('<IMG SRC=' + wbs_arg+wbs_t);
	}
	
	
}
webo_ok = 0;
//-->