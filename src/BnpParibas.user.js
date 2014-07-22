//#include "parts/BnpParibasHeader.js"
//#include "parts/Md5.js"

var scriptName= GM_info.script.name
var version = GM_info.script.version;
var debug = false;

var md5ToNumber = new Object();
// firefox
md5ToNumber["f3543cedaee50789fc8ce978ce402399"] = -1;
md5ToNumber["23c03b703a8a817b1a314c9fb80cb7fa"] = 0;
md5ToNumber["744f74197d3a9526c04259bd058f278f"] = 1;
md5ToNumber["527a26b94f74de72e4b630313e518d59"] = 2;
md5ToNumber["4b37641fbeebe7d0cb7d6a9725ec07b0"] = 3;
md5ToNumber["ae9f29c4db8f33224f525242c45db607"] = 4;
md5ToNumber["ae9f29c4db8f33224f525242c45db607"] = 4;
md5ToNumber["b9268ee64a09cfb95f756c1850959b1f"] = 5;
md5ToNumber["4f521ab60c7dccb31a4df734cc1a01ba"] = 6;
md5ToNumber["5bb3a6c80cbf9aa379ca2b64b6e379b7"] = 7;
md5ToNumber["9fa178bbb2c86711f7f6a537e235ef2d"] = 8;
md5ToNumber["390f9e42e02fe5e91f2384ab25b24f4b"] = 9;

// chrome
md5ToNumber["83a3102b20ac27ecfb56f58cc81db2b3"] = -1;
md5ToNumber["0e5e939030233b16142d780f851e1d17"] = 0;
md5ToNumber["aceef4b573b173f1a8ba71832b4cbd03"] = 1;
md5ToNumber["4295a72207c26072623486a0fc730e9f"] = 2;
md5ToNumber["9f69717913d583231d7edd7f35b546cd"] = 3;
md5ToNumber["edefdb0e05735bd295d31c9521108e7b"] = 4;
md5ToNumber["2e4d57f80e298758f2bf717c22c9b7e7"] = 5;
md5ToNumber["4f47364e582099205efad7b6465af962"] = 6;
md5ToNumber["5b1c2ce646ea54c438cf23c21732ae17"] = 7;
md5ToNumber["a37439d81d6545237656aa096faa80d4"] = 8;
md5ToNumber["4dbad727dec54840449bdf9fd38c2fa6"] = 9;

var number2GridPosition;

function _(elt) {
    return document.createElement(elt);
};

function getNumberFromImgMd5(imageDataBase64) {

    var imageMd5 = MD5(imageDataBase64);
    var number = md5ToNumber[imageMd5];
    return number;
};

/**
 * Taken from http://userscripts.org/scripts/show/126488 - FreeMobile TinyAuth
 */
function convertColor(image_data) {
    for (var x = 0; x < image_data.width; x++) {
        for (var y = 0; y < image_data.height; y++) {
            var i = x * 4 + y * 4 * image_data.width;
            var luma = Math.floor(image_data.data[i] * 299 / 1000 + image_data.data[i + 1] * 587 / 1000 +
                                      image_data.data[i + 2] * 114 / 1000);

            image_data.data[i] = luma;
            image_data.data[i + 1] = luma;
            image_data.data[i + 2] = luma;
            image_data.data[i + 3] = 255;
            if (image_data.data[i] > 200 || image_data.data[i + 3] == 0) {
                image_data.data[i] = 255;
                image_data.data[i + 1] = 255;
                image_data.data[i + 2] = 255;
                image_data.data[i + 3] = 0;
            }
        }
    }
};

function decodeGrid(gridImgSrc) {
    var canvas, ctx, imageData;
    var img = new Image();
    img.src = gridImgSrc;

    number2GridPosition = new Object();

    for (y = 1; y <= 5; y++) {
        for (x = 1; x <= 5; x++) {
            canvas = _("canvas");
            canvas.setAttribute("width", 26);
            canvas.setAttribute("height", 26);
            canvas.setAttribute("style", "display: inline; border: 1px solid red;");
            ctx = canvas.getContext('2d');

            ctx.fillStyle = "rgb(255,255,100)";
            ctx.fillRect(0, 0, 26, 26);
            // chaque case chiffre fait 26px*26px sans la bordure de 1px

            ctx.drawImage(img, x + (26 * (x - 1)), y + (26 * (y - 1)), 26, 26, 0, 0, 26, 26);
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            convertColor(imageData);
            ctx.putImageData(imageData, 0, 0);
            var imageDataBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            var number = getNumberFromImgMd5(imageDataBase64);
            var gridPosition = (((y - 1) * 5) + x);

            if (debug) {
                var br = _("br");
                $("body").append(br);
                $("body").append(canvas);
                $numberElement =
                    $(_("span")).attr("style", "border-bottom: 1px solid red;").text(" row=" + y + ";col=" + x +
                        ";imgNumber=" + gridPosition +
                        ";md5=" +
                        MD5(imageDataBase64) + " = " +
                        number);
                $("body").append($numberElement)
                $("body").append(br);
            }

            if (number != -1) {
                number2GridPosition[number] = gridPosition;
            }

            if (number < -1 || number > 9) {
                alert("Décodage de la grille échoué " + number);
                throw new Error("Décodage échoué.");
            }

        }
    }

    if (debug) {
        console.log("Number -> Grille =");
        console.log(number2GridPosition);
    }

    for(n=0;n<10;n++){
        if (typeof number2GridPosition[n] == "undefined"){
            alert("Grille non decodee pour le chiffre " + n + ". Essayez de mettre a jour le script ou refraichir la page.");
            break;
        }
    }

    return number2GridPosition;
};

/**
 * Called when user click on the link to log in
 */
function submitGrid($grid) {

    if (!number2GridPosition) {
        alert("Grille non decodee");
        return;
    }

    var password = $("#gm_password").val();
    var $targetPasswordField = $("form[name=logincanalnetbis]").find("input[name=ch5temp]");
    var $targetPasswordStarField = $("form[name=logincanalnetbis]").find("input[name=ch2]");
    for (s = 0; s < password.length; s++) {
        var grilleChar = number2GridPosition[password[s]];
        if (grilleChar < 10) {
            grilleChar = "0" + grilleChar;
        }
        if (debug){
            console.log(grilleChar);
        }
        $targetPasswordField.val($targetPasswordField.val() + grilleChar);
        $targetPasswordStarField.val($targetPasswordStarField.val() + "*");

    }

    if (!debug) {
        var $formToSubmit = $("form[name=logincanalnet]");
        var $passwordToSubmit = $formToSubmit.find("input[name=ch5]");
        $passwordToSubmit.val($targetPasswordField.val());
        $formToSubmit.get(0).submit();
    } else {
        console.log("Debug mode: no submit");
    }
};

function addLoginInput($form) {
    // add a new login input

    var $divControlGroupLogin = $(_("div")).addClass("control-group");
    var $labelLogin = $(_("label")).addClass("control-label").attr("for", "ch1").text("Identifiant");
    $divControlGroupLogin.append($labelLogin);
    var $divControlLoginInput = $(_("div")).addClass("controls");

    var $login = $form.find("input[name=ch1]").attr("placeholder", "identifiant");
    $newInputLogin = $login.clone();
    $login.attr("name", "oldCh1");

    // remove the old login input
    var $tableLogin = $form.find(":last-child");
    $tableLogin.hide();

    $newInputLogin.appendTo($divControlLoginInput);

    $divControlGroupLogin.append($divControlLoginInput);

    $form.append($divControlGroupLogin);
    // put caret in login input
    $newInputLogin.focus();
}

function addPasswordInput($form) {
    // add a password input

    var $divControlGroupPassword = $(_("div")).addClass("control-group");
    var $labelPassword = $(_("label")).addClass("control-label").attr("for", "gm_password").text("Mot de passe");
    $divControlGroupPassword.append($labelPassword);
    var $divControlPasswordInput = $(_("div")).addClass("controls");
    var $newInputPassword = $(_("input")).attr("type", "password").attr("name", "gm_password").attr("id",
                                                                                                    "gm_password").attr("autocomplete",
                                                                                                                        "On").attr("maxlength",
                                                                                                                                   "6").attr("placeholder",
                                                                                                                                             "mot de passe");
    $newInputPassword.appendTo($divControlPasswordInput);
    $divControlGroupPassword.append($divControlPasswordInput);
    $form.append($divControlGroupPassword);
}

function addSubmitButton($form, $grid) {
    // add a submit link "button"
    var $divControlGroupSubmit = $(_("div")).addClass("control-group");
    var $divControlButtonInput = $(_("div")).addClass("controls");
    var $newInputButton = $(_("a")).addClass("btn").addClass("btn-primary").text("Acceder aux comptes");
    $newInputButton.appendTo($divControlButtonInput);
    $divControlGroupSubmit.append($divControlButtonInput);
    $form.append($divControlGroupSubmit);
    // bind events
    $newInputButton.bind("click", function () {
        submitGrid($grid);
    });
}

function addScriptInfos($form) {
    // add some info about this script
    var $baseline = $(_("div")).addClass("hero-unit");
    var $p = $(_("h3")).text(scriptName);
    $baseline.append($p);
    $baseline.append($(_("p")).addClass("muted").text("Version " + version));
    $baseline.append($(_("p")));

    $form.append($baseline);
}

function customizeUi($form, $grid) {
    GM_addStyle(GM_getResourceText("bootstrapcss"));

    $form.addClass("form-horizontal");

    addLoginInput($form);

    addPasswordInput($form);

    addSubmitButton($form, $grid);

    addScriptInfos($form);

    if (!debug) {
        $("table.identification div.rubrique").hide();
    }
}

function main() {
    var $form = $("form[name=logincanalnet]");
    var $grid = $("#secret-nbr-keyboard");

    if (!$grid || ($grid.length == 0)) {
        alert("Aucune grille d'identification trouvee")
        return;
    }

    if (debug) {
        console.log("Grid is");
        console.log($grid);
        console.log($grid.get()[0]);
    }

    gridImgSrc = $grid.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    if (debug){
        console.log("Grid image = " + gridImgSrc);
    }

    $('<img/>').attr('src', gridImgSrc).load(function() {
        $(this).remove(); // prevent memory leaks
        decodeGrid(gridImgSrc);
        customizeUi($form, $grid);
    });

};

main();
