//= require parts/LaBanquePostaleHeader.js
//= require parts/Md5.js

var scriptNumber = "94023";
var scriptHome = "http://userscripts.org/scripts/show/" + scriptNumber;

/**
Inspired by 
	Finance::Bank::LaPoste - Check your "La Poste" accounts from Perl
	http://search.cpan.org/~pixel/Finance-Bank-LaPoste-7.03/lib/Finance/Bank/LaPoste.pm
*/

/**** START of getBase64Image found @ http://stackoverflow.com/questions/934012/get-image-data-in-javascript/934925#934925 - License CC BY-SA http://creativecommons.org/licenses/by-sa/2.5/ 
		by http://stackoverflow.com/users/2214/matthew-crumley
*/

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/**** END of getBase64Image found @ http://stackoverflow.com/questions/934012/get-image-data-in-javascript/934925#934925 - License CC BY-SA http://creativecommons.org/licenses/by-sa/2.5/ */


/**** START of own code 
	License BY-SA - http://creativecommons.org/licenses/by-sa/3.0/
	http://www.bouillon.net
*/

function getMd5For(idx){
	img = document.getElementById('val_cel_' + idx).firstChild.firstChild;
	imgBase64 = getBase64Image(img);
	return MD5(imgBase64); 
}

function go(){
	// build MD5 => number
	var images= new Object();
	images["9c29588415b4dc3ac6baaee25032093a"] = 0;
	images["a73d949e364731e80cc0f3491e8b25fa"] = 1;
	images["98da8009219cef6a5a25af08a57716cd"] = 2;
	images["955142caeacbd6aee5f62d77c17f753d"] = 3;
	images["0f84ddd8fe7d26d8fbc63bb9dc49e40b"] = 4;
	images["e622de74fdfc65326c70a3af2004d2b6"] = 5;
	images["545fbed772b94ab380c728073c1dd7cb"] = 6;
	images["08e749be2768c513adf4d51999ed4acd"] = 7;
	images["dadb7ae74ff72058b6382b1cc1b1f2a2"] = 8;
	images["76a50c079dd5b186e4a3806868c49488"] = 9;

	// build number => keyboard
	var keyboard = new Object();
	for (i=0; i<10; i++){
	   m = getMd5For(i);
	   keyboard[images[m]] = i;
	}
	var divContenuBloc = document.getElementById("val_cel_dentifiant").parentNode;
        var newLabel = document.createElement("label");
	newLabel.setAttribute("for", "gm_password");
	newLabel.setAttribute("id", "gm_labelpassword");
	newLabel.innerHTML = "Saisir le mot de passe";
	divContenuBloc.appendChild(newLabel);


        var newInput = document.createElement("input");
	newInput.setAttribute("type", "password");	
	newInput.setAttribute("id", "gm_password");
	newInput.setAttribute("name", "gm_password");
	divContenuBloc.appendChild(newInput);

	var newSubmit = document.createElement("input");
	newSubmit.setAttribute("type", "button");
	newSubmit.setAttribute("value", "VALIDER");
	divContenuBloc.appendChild(newSubmit);

	newSubmit.addEventListener('click', function(e){
		password = newInput.value;
		keyboardPass = "";
		for(i = 0 ; i < password.length ; i++){
			k = keyboard[password[i]];
			keyboardPass = keyboardPass + k;
		}
		document.getElementById("cs").value = keyboardPass;

		document.getElementsByTagName("form")[0].submit();
	}, false);

	document.getElementById("motDePasseBloc").style.display = "none";
	document.getElementById("boutonBloc").style.display = "none";


}


window.addEventListener('load', function(e) {
	go();
}, false);

