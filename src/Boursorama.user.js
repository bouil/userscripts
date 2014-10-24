//#include "parts/BoursoramaHeader.js"
//#include "parts/Md5.js"


var scriptName = GM_info.script.name
var version = GM_info.script.version;
var debug = false;

var md5ToNumber = new Object();
// firefox
md5ToNumber["aa638e434ef27fc73aaa2b812c6d6940"] = -1;
md5ToNumber["f7eff870c6bc8a211438887feecf02ba"] = 0;

md5ToNumber["a3f2a856c6d100e180be2f52a331d23e"] = 1;
md5ToNumber["5e4c5d26750e9360dd0a674e1233b12c"] = 1;

md5ToNumber["859cf20afa3d16d35ca3bd96fdde8799"] = 2;
md5ToNumber["c9a5b1f4f63bd97bb024383a9f21ff75"] = 2;

md5ToNumber["735b7b06bd6e2bad29da18126b5080a7"] = 3;
md5ToNumber["6b0223be3d4c74c95316363d49c53be2"] = 4;

md5ToNumber["e589b3fbdfed390e108322d7a1d0ceca"] = 5;
md5ToNumber["44fc31d0f093a6b41636b2ce7fd97cd8"] = 5;

md5ToNumber["b4a14503a39e9b448f3c6dd0171018c8"] = 6;
md5ToNumber["87b9a2a3958615122657a3a05b7088b0"] = 7;
md5ToNumber["38cb00677543be37b86d1ad242e714aa"] = 8;
md5ToNumber["e3f02c152a49876d759e74e40c71774c"] = 9;


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
    var pix = image_data.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        var grayscale = pix[i  ] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
        if (grayscale > 100) {
            grayscale = 255;
        } else {
            grayscale = 0;
        }
        pix[i  ] = grayscale; 	// red
        pix[i + 1] = grayscale; 	// green
        pix[i + 2] = grayscale; 	// blue
        // alpha
    }
};

function decodeGrid(gridImgSrc) {
    var canvas, ctx, imageData;
    var img = new Image();
    img.src = gridImgSrc;

    number2GridPosition = new Object();

    var nbCols = 3;
    var nbRows = 4;
    var numberPartWidth = 98;
    var numberPartHeight = 58;
    for (y = 1; y <= nbRows; y++) { // each row
        for (x = 1; x <= nbCols; x++) { // each col
            var gridPosition = (((y - 1) * nbCols) + x);

            canvas = _("canvas");
            canvas.setAttribute("width", numberPartWidth);
            canvas.setAttribute("height", numberPartHeight);
            canvas.setAttribute("style", "display: inline; border: 1px solid red;");
            ctx = canvas.getContext('2d');

            ctx.fillStyle = "rgb(255,255,100)";
            ctx.fillRect(0, 0, numberPartWidth, numberPartHeight);
            // chaque case chiffre fait 98px*58 sans la bordure de 1px

            var xoffset = 1 + (x - 1) * 2;
            var sx = xoffset + (numberPartWidth * (x - 1)); // The x coordinate where to start clipping
            var yoffset = 1 + (y - 1) * 2;
            var sy = yoffset + (numberPartHeight * (y - 1)); // The y coordinate where to start clipping
            var swidth = numberPartWidth; // The width of the clipped image
            var sheight = numberPartHeight; // The height of the clipped image
            var dx = 0; // The x coordinate where to place the image on the canvas
            var dy = 0; // The y coordinate where to place the image on the canvas
            var width = numberPartWidth; // The width of the image to use (stretch or reduce the image)
            var height = numberPartHeight; // The height of the image to use (stretch or reduce the image)
            ctx.drawImage(img, sx, sy, swidth, sheight, dx, dy, width, height);
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            convertColor(imageData);
            ctx.putImageData(imageData, 0, 0);
            var imageDataBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            var number = getNumberFromImgMd5(imageDataBase64);

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

    for (n = 0; n < 10; n++) {
        if (typeof number2GridPosition[n] == "undefined") {
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

    var area = $("map area");

    var password = $("#gm_password").val();
    for (s = 0; s < password.length; s++) {
        var grilleChar = number2GridPosition[password[s]];
        if (debug) {
            console.log(grilleChar);
        }

        var toExec = $(area[grilleChar - 1]).attr("onclick");
        if (debug) {
            console.log("eval(" + toExec + ")");
        }
        eval(toExec);

    }

    if (!debug) {
        var $formToSubmit = $("form#identification_client");
        $formToSubmit.get(0).submit();
    } else {
        console.log("Debug mode: no submit");
    }
};

function addPasswordInput($form) {
    // add a password input

    var $divControlGroupPassword = $(_("div"));
    var $labelPassword = $(_("label")).attr("for", "gm_password").text("Mot de passe");
    $divControlGroupPassword.append($labelPassword);
    var $divControlPasswordInput = $(_("div"));
    var $newInputPassword = $(_("input")).attr("type", "password").attr("name", "gm_password").attr("id",
        "gm_password").attr("autocomplete",
        "On").attr("maxlength",
        "6").attr("placeholder",
        "mot de passe");
    $newInputPassword.appendTo($divControlPasswordInput);
    $divControlGroupPassword.append($divControlPasswordInput);
    $form.find("label#login-password-label").before($divControlGroupPassword);
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

    addPasswordInput($form);

    addSubmitButton($form, $grid);

    addScriptInfos($form);

    if (!debug) {
        $("#login-password-label").hide();
        $("#login-password-label").next().hide();
        $("#b3fdea3").hide();
    }
}

function main() {
    var $form = $("form#identification_client");
    var $grid = $("#login-pad img");

    if (!$grid || ($grid.length == 0)) {
        alert("Aucune grille d'identification trouvee")
        return;
    }

    if (debug) {
        console.log("Grid is");
        console.log($grid);
        console.log($grid.get()[0]);
    }

    gridImgSrc = $grid.attr("src");
    if (debug) {
        console.log("Grid image = " + gridImgSrc);
    }

    $('<img/>').attr('src', gridImgSrc).load(function () {
        $(this).remove(); // prevent memory leaks
        decodeGrid(gridImgSrc);
        customizeUi($form, $grid);
    });

};

main();
