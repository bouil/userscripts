

var search_libs = [];
var search_availableTags = [];

var search_unescapeHtml = function (html) {
	if(!html) {
		return false;
	}
    var temp = document.createElement("div");
    temp.innerHTML = html;
    var result = temp.childNodes[0].nodeValue;
    temp.removeChild(temp.firstChild)
    return result;
}

var fillTabsSearch = function(availableTags, libs, label, href, target) {
	if(label) {
		label = search_unescapeHtml(label);
		availableTags[label] = {
			href: href,
			target: target
		};
			
		libs.push(label);
	}
}



$(function(){
	var etat = false;
	var mouseOverLayer = false;
	var timerL = null;
	
	var showMenu = function(code) {
		if(/^menu-.+/.test(code)) {
			code = code.substring(5)
		}
		hideMenus();
		if(code) {
			$('#menu-' + code).show()
			$('#' + code).addClass('selected')
		}
	}

	var hideMenus = function() {
		$('.submenuContainer').hide()
		$('.menuItem').removeClass('selected')
	}
	
	$(".submenuContainer").click(function() {
		etat = true;
	});
	
	$("html").click(function() {
		if(!etat){
			hideMenus();
		}
		etat = false;
	});

	$('.menuItem')
		.click(function() {
			if($(this).hasClass("selected")){
				hideMenus();
			} else {
				curentLayerId = $(this).attr('id');
				etat = true;
				showMenu($(this).attr('id'));
			}
		});
	
	$('.menuItem').hover(
			function() {
				var element = $(this).attr('id');
				$(this).addClass("isHover");
				window.setTimeout(function(){
					var el = $("#"+element);
					if(el.hasClass("isHover")) {
						curentLayerId =element;
						showMenu(element);
					}
				}, 0);
			}, 
			function(){
				$(this).removeClass("isHover");
				timerL = new Date();
				window.setTimeout(function(){
					var aTime = new Date();
					if($(".isHover").length == 0 && !mouseOverLayer && (aTime.getTime()-timerL.getTime()>=500)) {
						hideMenus();
					}
				}, 500);
			});
	
	
	$('.submenuContainer').hover(
			function(){
				mouseOverLayer = true;
			}, 
			function(){
				mouseOverLayer = false;
				timerL = new Date();
				window.setTimeout(function(){
					var aTime = new Date();
					if($(".isHover").length == 0 && !mouseOverLayer && (aTime.getTime()-timerL.getTime()>=500)) {
						hideMenus();
					}
				}, 500);
			});
	
	/**deconnexion**/
	$('#deconnexion').click(function() {
		$('#formLogout').submit();
	})
	
	/** Action sur le menu **/
	var imgWait = "/SCUW/images/waitRond.gif";
	$('#Accueil').click(function(){$(location).attr('href',"/outil/UWHO/Accueil")});

	$('#monSav').click(function(){$(location).attr('href',"/outil/UWSV/Accueil")});
	
	
	$('#boutonDbleLayerInactifPar').click(function(){
			$('.submenuContainer').hide();
			$('#menu-menuSouscrireCLA').show();
			$('#menu-menuSouscrireCLAPP').show();
			$('#menu-menuSouscrireCLAPM').show();
	});
	$('#boutonDbleLayerInactifPro').click(function(){
			$('.submenuContainer').hide();
			$('#menu-menuSouscrireCLI').show();
	});
	
	
	
	/***** Recherche *****/
	
	var search_theSearch = $("#searchBEL");
	
	var labelExist = function(tab, label) {
		for(var i=0;i<tab.length;i++) {
			if(tab[i] == label) {
				return true;
			}
		}
		return false;
	}
	
	$("nav .submenuContainer a, .footer a").each(function() {
    	_this = $(this);
    	var label = _this.text().trim();
    	if(!labelExist(search_libs, label)) {
        	fillTabsSearch(search_availableTags, search_libs, label, _this.attr("href"), _this.attr("target"));
    	}
    });
    
	search_theSearch.autocomplete({
        source: search_libs,
        minLength: 2,
        autoFocus: true,
        select: function(event, ui) {
        	event.preventDefault();
        	search_theSearch.val("");
        	if(search_availableTags[ui.item.label].target != "_blank") {
        		window.location = search_availableTags[ui.item.label].href;
        	} else {
        		window.open(search_availableTags[ui.item.label].href);
        	}
        }
    });
    
	search_theSearch.val("");
	
});	
