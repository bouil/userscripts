var w_compteur;

function make_stat(section,subsection,site,frame,channel,section_grp,subsection_grp, content, p1, p2, p3, p4){

	if(typeof(frame)=="undefined"){
		frame = "0";
	}
	
	if(typeof(wreport_hit_group)=="undefined"){
		wreport_hit_group=true;
	}
	
	if(wreport_hit_group){
		section_grp = null;
	}
	
	w_compteur = new wreport_counter(section, subsection, site, frame, channel,	section_grp, subsection_grp);
	w_compteur.add_content(content);
	w_compteur.profiling_cookie_mode = 'off';
	w_compteur.add_profile(1,p1); // identifié ?
	w_compteur.add_profile(2,p2); // Http/Https?
	w_compteur.add_profile(3,p3); // collaborateur bnp
	w_compteur.add_profile(4,p4); // client bpf
	w_compteur.count();
}
/*
ne prend pas en compte la section_groupe et la subsection_groupe
prend en compte le contenu2
*/
function make_stat_simple(section,subsection,site,frame,channel, content, p1, p2, p3, p4, contenu2){

	if(typeof(frame)=="undefined"){
		frame = "0";
	}
	
	if(typeof(wreport_hit_group)=="undefined"){
		wreport_hit_group=true;
	}
	
	if(wreport_hit_group){
		section_grp = null;
	}

	w_compteur = new wreport_counter(section, subsection, site, frame, channel);
	w_compteur.add_content(content);
	if(contenu2!=''){
		w_compteur.add_content(contenu2);
	}
	w_compteur.profiling_cookie_mode = 'off';
	w_compteur.add_profile(1,p1); // identifié ?
	w_compteur.add_profile(2,p2); // Http/Https?
	w_compteur.add_profile(3,p3); // collaborateur bnp
	w_compteur.add_profile(4,p4); // client bpf
	w_compteur.count();
}

function wreport_flash(WRP_CONTENT, WRP_SUBSECTION, WRP_ID, WRP_SECTION_GRP){

	var WRP_CHANNEL=PROFIL1;
	var WRP_ACC;
	var WRP_SUBSECTION_GRP = LIB_UNIVERS_COURANT;
	var WRP_SECTION = LIB_DOSSIER_COURANT;

	
		var w_compteur = new wreport_counter(WRP_SECTION, WRP_SUBSECTION, WRP_ID, WRP_ACC, WRP_CHANNEL, WRP_SECTION_GRP, WRP_SUBSECTION_GRP);
		w_compteur.add_content(WRP_CONTENT);
		w_compteur.profiling_cookie_mode = 'off';
		w_compteur.add_profile(1,PROFIL1); // identifié ?
		w_compteur.add_profile(2,PROFIL2); // Http/Https?
		w_compteur.add_profile(3,PROFIL3); // collaborateur bnp
		w_compteur.add_profile(4,PROFIL4); // client bpf
		w_compteur.count();
	
}