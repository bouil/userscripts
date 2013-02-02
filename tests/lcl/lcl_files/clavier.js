var encodeXor = false;

function myXOR(valeur, aleatoire){
	var to_enc = valeur;
	var xor_key = aleatoire; 
	var the_res="";
	for(i=0; i < to_enc.length; ++i){
		the_res+=String.fromCharCode(xor_key^to_enc.charCodeAt(i));
	}
	return the_res;
} 

$(function() {
	$('.postClavier').val('');
		
	if(flag == false) {
		flag=true;
		
		//Fonction pour le toucheClavier
		$(".toucheClavier").live("click", function(){
			//On récupère la div parent
			var touche = this.id.split("_")[1];
			
			var divParent = $(".pwdFields", $(this).parent().parent().parent());
			//On récupère le champs du code
			var password = $(divParent).children(".password");
			var code = $(password).val();
			//On récupère le champs caché
			var postClavier = $(divParent).children(".postClavier");
			var num = $(postClavier).val();
			
			if(code.length <6){
				num = num +''+ touche;
				$(postClavier).val(num);
				code = code + '' + "*";
				$(password).val(code);
				encodeXor = false;
			}
		});
		
		//Fonction de correction
		$(".button").live("click", function(){
			if(this.id.indexOf('ResetClavier', 0) != -1){
				//On récupère la div parent
				var divParent = $(".pwdFields", $(this).parent().parent().parent());
				//On vide le champs
				$(divParent).children(".password").val('');
				$(divParent).children(".postClavier").val('');
				encodeXor = false;
			}
		});
	}
	var vel = "";
	if($("#vel").val() != undefined){
		vel = $("#vel").val();
	}
			
	//On récupère la valeur si on utilise un random
	if($("#random") != undefined){
		if($("#random").val() != undefined && $("#random").val() == "true"){
//			$(".clavier").attr("src", vel+"/outil/UAUT/Clavier/creationClavier?random=" + Math.floor(Math.random()*1000000000000000000000));
		}else{
//			$(".clavier").attr("src", vel+"/outil/UAUT/Clavier/creationClavier");
		}
	}else{
//		$(".clavier").attr("src", vel+"/outil/UAUT/Clavier/creationClavier?random=" + Math.floor(Math.random()*1000000000000000000000));
	}
});
