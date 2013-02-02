<!--
function IsCoordonneesExpatOK(mailForm) {
mailForm.email.value = CleanSpace(mailForm.email.value);
mailForm.telephone.value = CleanSpace(mailForm.telephone.value);
mailForm.portable.value = CleanSpace(mailForm.portable.value);

if (mailForm.email.value.length == 0) {
	alert("Vous devez renseigner votre email.\nPlease enter your email address.");
	mailForm.email.focus();
	return false;
} else if (IsNotEmail(mailForm.email.value)) {
	alert("Votre email est invalide.\nEmail address contains non-valid characters.");
	mailForm.email.focus();
	return false;
} else if (mailForm.telephone.value.length == 0 && mailForm.portable.value.length == 0) {
	alert("Vous devez renseigner votre numéro de téléphone fixe ou votre numéro de téléphone mobile.\nPlease enter your home phone number or your mobile phone number.");
	mailForm.telephone.focus();
	return false;
} /*
else if (mailForm.portable.value.length != 0 &&
			(IsNotAnInt(mailForm.portable.value)
			|| mailForm.portable.value.length != 10
			|| mailForm.portable.value.charAt(0) != "0"
			|| mailForm.portable.value.charAt(1) != "6")) {
	alert("Votre numéro de téléphone mobile est invalide.\nMobile phone number contains non-valid characters.");
	mailForm.portable.focus();
	return false;
}
*/
return true;
}

function IsCoordonneesLightOK(mailForm) {
/*Plus de téléphone portable*/
mailForm.email.value = CleanSpace(mailForm.email.value);
mailForm.telephone.value = CleanSpace(mailForm.telephone.value);

if (mailForm.telephone.value.length == 0) {
	alert("Vous devez renseigner votre numéro de téléphone privilégié.");
	mailForm.telephone.focus();
	return false;
}else if (mailForm.telephone.value.length != 0 &&
			(mailForm.telephone.value.length != 10
			|| mailForm.telephone.value.charAt(1) == "0"
			|| IsNotAnInt(mailForm.telephone.value)
			)) {
	alert("Votre numéro de téléphone est invalide.");
	mailForm.telephone.focus();
	return false;
}else if (mailForm.telephone.value.length != 0 &&
			(mailForm.telephone.value.length != 10
			|| IsNotAnInt(mailForm.telephone.value)
			|| mailForm.telephone.value.charAt(0) != "0"
      )) {
	alert("Votre numéro de téléphone doit commencer par 0.");
	mailForm.telephone.focus();
	return false;
} else if (mailForm.email.value.length == 0) {
	alert("Vous devez renseigner votre email.");
	mailForm.email.focus();
	return false;
} else if (IsNotEmail(mailForm.email.value)) {
	alert("Votre email est invalide.");
	mailForm.email.focus();
	return false;
}
return true;
}

function IsCoordonneesOK(mailForm) {
mailForm.email.value = CleanSpace(mailForm.email.value);
mailForm.telephone.value = CleanSpace(mailForm.telephone.value);
mailForm.portable.value = CleanSpace(mailForm.portable.value);

if (mailForm.email.value.length == 0) {
	alert("Vous devez renseigner votre email.");
	mailForm.email.focus();
	return false;
} else if (IsNotEmail(mailForm.email.value)) {
	alert("Votre email est invalide.");
	mailForm.email.focus();
	return false;
} else if (mailForm.telephone.value.length == 0 && mailForm.portable.value.length == 0) {
	alert("Vous devez renseigner votre numéro de téléphone fixe ou votre numéro de téléphone mobile.");
	mailForm.telephone.focus();
	return false;
}else if (mailForm.telephone.value.length != 0 &&
			(mailForm.telephone.value.length != 10
			|| mailForm.telephone.value.charAt(1) == "0"
			|| IsNotAnInt(mailForm.telephone.value)
			)) {
	alert("Votre numéro de téléphone est invalide.");
	mailForm.telephone.focus();
	return false;
}else if (mailForm.telephone.value.length != 0 &&
			(mailForm.telephone.value.length != 10
			|| IsNotAnInt(mailForm.telephone.value)
			|| mailForm.telephone.value.charAt(0) != "0"
      )) {
	alert("Votre numéro de téléphone doit commencer par 0.");
	mailForm.telephone.focus();
	return false;
} else if (mailForm.portable.value.length != 0 &&
			(IsNotAnInt(mailForm.portable.value)
			|| mailForm.portable.value.length != 10
			|| mailForm.portable.value.charAt(0) != "0"
			|| mailForm.portable.value.charAt(1) == "0"
			|| 
				// EVOL mobile en 07
				(mailForm.portable.value.charAt(1) != "6"
				&&
				mailForm.portable.value.charAt(1) != "7")
			)) {
	alert("Votre numéro de téléphone mobile est invalide.");
	mailForm.portable.focus();
	return false;
}
return true;
}

function CleanLeftRightSpace(chaine) {
var chaine;
while (chaine.charAt(0)==" ") {
	chaine = chaine.substring(1, chaine.length);
}
while (chaine.charAt(chaine.length-1)==" ") {
	chaine = chaine.substring(0, chaine.length-1);
}
return chaine;
}

function CleanSpace(chaine) {
var chaine;
var i = 0;
while (i<chaine.length) {
	if (chaine.charAt(i)==" ") {
		chaine = chaine.substring(0,i) + chaine.substring(i+1, chaine.length);
	} else {
		i++;
	}
}
return chaine;
}

function CleanLeftZeros(chaine) {
var chaine;
var stop = false;
while (!stop) {
	if (chaine.length == 1) {
		stop = true;
	} else if (chaine.charAt(0)=="0") {
		chaine = chaine.substring(1, chaine.length);
	} else {
		stop=true;
	}
}
return chaine;
}

function CommaToDot(object) {
if (object.type == "text") {
var chaine = CleanSpace(object.value);
if (chaine.length > 0) {
	for (pos = 0; pos < chaine.length; pos++) {
		if (chaine.charAt(pos) == ",") {
			chaine = chaine.substring(0,pos) + "." + chaine.substring(pos+1, chaine.length);
		}
	}
	if ((chaine.charAt(chaine.length - 1) == ",") || (chaine.charAt(chaine.length - 1) == ".")) {
		chaine = chaine.substring(0, chaine.length - 1);
	}
}else{
	chaine = "0";
	}
object.value = chaine;
}
}

function IsNonWorking(month,day) {
var ferie=new Array("01/01","01/05","08/05","14/07","15/08","01/11","11/11","25/12");
var nb = ferie.length;
var i = 0;
for(i=0; i<nb; i++) {
	if ((parseInt(ferie[i].substring(0,2))==day)&&(parseInt(ferie[i].substring(3,5))==month)) {
		return true;
	}
}
return false;
}

function IsNotADate(year, month, day) {
month = month - 1;
var tempDate = new Date(year,month,day);
var correctYear;
if (tempDate.getYear() < 1000) {
	correctYear = tempDate.getYear() + 1900;
} else {
	correctYear = tempDate.getYear();
}
if ((year == correctYear) &&
	(month == tempDate.getMonth()) &&
	(day == tempDate.getDate()) ) {
	return false;
}
return true;
}

function IsWeekEnd(year, month, day) {
month=month-1;
tempDate=new Date(year, month, day);
if (tempDate.getDay()==0) {
	return true;
}
return false;
}

function IsNotAnInt(chaine) {
var i = 0;
for (i=0; i<chaine.length; i++){
	if ((chaine.charAt(i)<"0") || (chaine.charAt(i)>"9")) {
		return true;
	}
}
return false;
}

function IsNotEmail(email) {
if (	(email.indexOf('"') >= 0)
		|| (email.indexOf(' ') >= 0)
		|| (email.indexOf('(') >= 0)
		|| (email.indexOf(')') >= 0)
		|| (email.indexOf(',') >= 0)
		|| (email.indexOf(';') >= 0)
		|| (email.indexOf(':') >= 0)
		|| (email.indexOf('[') >= 0)
		|| (email.indexOf(']') >= 0)
		|| (email.indexOf('\\') >= 0)) {
return true;
}
atPosition = email.indexOf("@");
if (atPosition < 0) {
	return true;
}
localName = email.substring(0, atPosition);
if (localName.length == 0) {
	return true;
}
domainName = email.substring(atPosition + 1, email.length);
if (domainName.length == 0) {
	return true;
}
dotPosition = domainName.indexOf(".");
if (dotPosition < 0) {
	return true;
}
if ((domainName.charAt(0) == '.') || (domainName.charAt(domainName.length - 1) == '.')) {
	return true;
}
if (localName.indexOf('@') >= 0) {
	return true;
}
if (domainName.indexOf('@') >= 0) {
	return true;
}
return false;
}

function IsNotLetters(chaine) {
var i = 0;
for(i=0; i<chaine.length; i++){
	if (!( ((chaine.charAt(i)>="a") && (chaine.charAt(i)<="z"))
		|| ((chaine.charAt(i)>="A") && (chaine.charAt(i)<="Z"))
		|| (chaine.charAt(i)=="à")
		|| (chaine.charAt(i)=="â")
		|| (chaine.charAt(i)=="ä")
		|| (chaine.charAt(i)=="é")
		|| (chaine.charAt(i)=="è")
		|| (chaine.charAt(i)=="ê")
		|| (chaine.charAt(i)=="ë")
		|| (chaine.charAt(i)=="î")
		|| (chaine.charAt(i)=="ï")
		|| (chaine.charAt(i)=="ô")
		|| (chaine.charAt(i)=="ö")
		|| (chaine.charAt(i)=="ù")
		|| (chaine.charAt(i)=="û")
		|| (chaine.charAt(i)=="ü")
		|| (chaine.charAt(i)=="ã")
		|| (chaine.charAt(i)=="ñ")
		|| (chaine.charAt(i)=="õ")
		|| (chaine.charAt(i)=="ç")
		|| (chaine.charAt(i)==" ")
		|| (chaine.charAt(i)==",")
		|| (chaine.charAt(i)=="&")
		|| (chaine.charAt(i)==" ")
		|| (chaine.charAt(i)=="'")
		|| (chaine.charAt(i)=='"')
		|| (chaine.charAt(i)=="'")
		|| (chaine.charAt(i)==".")
		|| (chaine.charAt(i)=="-")
		|| (chaine.charAt(i)=="_")))
		 {
		 return true;
	}
}
return false;
}
//-->
