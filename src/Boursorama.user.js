//#include "parts/BoursoramaHeader.js"
//#include "parts/Md5.js"


var scriptName = GM_info.script.name
var version = GM_info.script.version;
var debug = false;

var md5ToNumber = new Object();
// firefox
md5ToNumber["aa638e434ef27fc73aaa2b812c6d6940"] = -1;
md5ToNumber["d56cf695d3cba3f1eebb2e1c3d29c935"] = 0;
md5ToNumber["f27b157823f467d72f744902f1f17ae7"] = 1;
md5ToNumber["48469730fb940ba25abe265203ba32ab"] = 2;
md5ToNumber["0e33096667ef622fba2e2fb068340a9a"] = 3;
md5ToNumber["483d7bc550f7476210865307c8ec2ffd"] = 4;
md5ToNumber["466bb78ee3f36cc4fadf0f83fbc1501e"] = 5;
md5ToNumber["2989fbdad94698cb73301790d319eb62"] = 6;
md5ToNumber["4a33b7696dd7504349744597736c4916"] = 7;
md5ToNumber["6e906fa35496977ff5eca837a5071183"] = 8;
md5ToNumber["acacf48e6a07d6edd8abf1a67f439848"] = 9;


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

function addPasswordInput($form, $grid) {
    // add a password input

    var $divControlGroupPassword = $(_("div")).attr("id", "gm_password_div");
    var $labelPassword = $(_("label")).attr("for", "gm_password").text($("#login-password-label").text());
    $divControlGroupPassword.append($labelPassword);
    var $divControlPasswordInput = $(_("div"));
    var $newInputPassword = $(_("input"))
        .attr("type", "password")
        .attr("name", "gm_password")
        .attr("id", "gm_password")
        .attr("autocomplete", "On")
        .attr("maxlength", "8")
        .attr("tabindex", $form.find("input#login").attr("tabindex") + 1)
        .keypress(function(event) {
            if ( event.keyCode == 13 ) {
                event.preventDefault();
                submitGrid($grid);
            }
        });
    $newInputPassword.appendTo($divControlPasswordInput);
    $divControlGroupPassword.append($divControlPasswordInput);
    $form.find("label#login-password-label").before($divControlGroupPassword);
}

function addSubmitButton($form, $grid) {
    // add a submit link "button"
    var $divControlGroupSubmit = $(_("div")).addClass("control-group");
    var $divControlButtonInput = $(_("div")).addClass("controls");
    var $newInputButton = $(_("a")).addClass("btn btn-primary right").text("Accéder aux comptes")
        .css("margin-top", "5px");
    $newInputButton.appendTo($divControlButtonInput);
    $divControlGroupSubmit.append($divControlButtonInput);
    $("#gm_password_div").after($divControlGroupSubmit);
    // bind events
    $newInputButton.bind("click", function () {
        submitGrid($grid);
    });
}

function addScriptInfos($form) {
    // add some info about this script
    var $baseline = $(_("div")).addClass("hero-unit left").css("margin-top", "5px");
    var $p = $(_("h3")).text(scriptName);
    $baseline.append($p);
    $baseline.append($(_("p")).addClass("muted").text("Version " + version));
    $baseline.append($(_("p")));

    $("#gm_password_div").after($baseline);
}

function moveHelpLinks($form) {
    var original = $form.find("ul.help-links");
    original.hide();
    original.after($("form#identification ul.help-links"));
}

function customizeUi($form, $grid) {
    $form.addClass("form-horizontal");

    // Boursorama code to show the real form
    var state = window.eval("showState('client')");

    addPasswordInput($form, $grid);

    addSubmitButton($form, $grid);

    moveHelpLinks($form);

    addScriptInfos($form);

    if (!debug) {
        $("#login-password-label").hide();
        // Hide pad
        $("#login-password-label").next().next().hide();
        // Hide warning
        $("#login-password-label").next().next().next().hide();
    }

    $form.find("input#login").focus();
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
