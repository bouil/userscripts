//= require parts/LCLHeader.js
//= require parts/Md5.js

var start = function (jQuery) {
    var debug = false;
    
    if (debug){
        console.log('jQuery is installed with no conflicts! The version is: ' + $.fn.jquery);
    }

    var scriptNumber = "158204";
    var scriptHome = "http://userscripts.org/scripts/show/" + scriptNumber;
    var version = "0.9";


    var number2Grilleposition;

    var get_number = function (imageDataBase64) {
        var md5ToNumber = new Object();
        // firefox
        md5ToNumber["e9e07e8e6894dd42ddda9fbf2ecd3a00"] = 0;
        md5ToNumber["6285ac842f6d42f97ea8325f9b081c07"] = 1;
        md5ToNumber["0298b2abec5f6a6d122fdf047bfa1041"] = 2;
        md5ToNumber["f4393edd45e72e3e4c222e60e6dc3191"] = 3;
        md5ToNumber["e30c2870441ac2fdf4be23b88109c7f6"] = 4;
        md5ToNumber["8421aa6a9a2ab9552dab04c97e9cf522"] = 5;
        md5ToNumber["b224cbab312d84ededa5f86660121dbd"] = 6;
        md5ToNumber["52c287d112beddf5de5fd71a02cb3092"] = 7;
        md5ToNumber["a6e26601494735643ab28f3bff3cb4ac"] = 8;
        md5ToNumber["e83d0058887db2a78327f44640605b7c"] = 9;

        // chrome
        md5ToNumber["bc2048fc38912eee2f86f7afe833148d"] = 0;
        md5ToNumber["0feee6afd2647c04c1b8b9c5e666604c"] = 1;
        md5ToNumber["4ff57cb01c9db0c2254f8e5b824f6519"] = 2;
        md5ToNumber["3e457d68ef50b1012a0e2153bca6dfe9"] = 3;
        md5ToNumber["aa8f0a6e46dfa27b1048ff1a8d88cbbb"] = 4;
        md5ToNumber["5a75fc01ad25284cbf894010d45d1fe6"] = 5;
        md5ToNumber["49c7a0f8838efbd5b99e702f225a4d0e"] = 6;
        md5ToNumber["66e2c15e2768d7b3d06ff512b69be33a"] = 7;
        md5ToNumber["0c1a80f6ee9539c2ed32526679294209"] = 8;
        md5ToNumber["c9d94cc2e98c773625bed0d98949c63e"] = 9;

        var imageMd5 = MD5(imageDataBase64);
        var number = md5ToNumber[imageMd5];
        return number;
    };

    /**
     * Taken from http://userscripts.org/scripts/show/126488 - FreeMobile TinyAuth
     */
    var convert_color = function convert_color(image_data) {
        for (var x = 0; x < image_data.width; x++) {
            for (var y = 0; y < image_data.height; y++) {
                var i = x * 4 + y * 4 * image_data.width;
                if (image_data.data[i] > 200) {
                    image_data.data[i] = 255;
                    image_data.data[i + 1] = 255;
                    image_data.data[i + 2] = 255;
                    image_data.data[i + 3] = 255;
                } else {
                    image_data.data[i] = 0;
                    image_data.data[i + 1] = 0;
                    image_data.data[i + 2] = 0;
                    image_data.data[i + 3] = 255;
                }
            }
        }
    };

    var findEdges = function (image_data) {

        var result = new Object();
        result.minWhiteFoundX = image_data.width;
        result.minWhiteFoundY = image_data.height;
        result.maxWhiteFoundX = 0;
        result.maxWhiteFoundY = 0;

        for (var x = 0; x < image_data.width; x++) {
            for (var y = 0; y < image_data.height; y++) {
                var i = x * 4 + y * 4 * image_data.width;

                if ((image_data.data[i] == 255)) {
                    result.minWhiteFoundX = Math.min(x, result.minWhiteFoundX);
                    result.minWhiteFoundY = Math.min(y, result.minWhiteFoundY);
                    result.maxWhiteFoundX = Math.max(x, result.maxWhiteFoundX);
                    result.maxWhiteFoundY = Math.max(y, result.maxWhiteFoundY);
                }
            }
        }
        return result;
    }

    var decodeLCL = function ($grilleImg) {

        if (debug){
            console.log("Decode Grille");
        }

        var canvas, canvas2, ctx, ctx2, imageData;
        var debugCanvas, debugCtx;

        var imageClip = 2;
        var initialGutter = imageClip + 0;
        var xGutterSize = (2 * imageClip) + 7;
        var yGutterSize = (2 * imageClip) + 6;
        var numberSize = 29 - (2 * imageClip);

        number2Grilleposition = new Object();

        var cols = 5;
        var rows = 2;
        for (x = 1; x <= cols; x++) {
            for (y = 1; y <= rows; y++) {
                canvas = document.createElement("canvas");
                canvas.setAttribute("width", numberSize);
                canvas.setAttribute("height", numberSize);
                canvas.setAttribute("style", "display: inline; border: 1px solid red;");
                ctx = canvas.getContext('2d');

                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(0, 0, numberSize, numberSize);

                var sx = initialGutter + ((x - 1) * xGutterSize) + (numberSize * (x - 1));
                var sy = initialGutter + ((y - 1) * yGutterSize) + (numberSize * (y - 1));

                ctx.drawImage($grilleImg.get()[0], sx, sy, numberSize, numberSize, 0, 0, numberSize, numberSize);
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                convert_color(imageData);
                ctx.putImageData(imageData, 0, 0);
                var edges = findEdges(imageData);

                // draw a new canvas
                canvas2 = document.createElement("canvas");
                var edgesWidth = edges.maxWhiteFoundX - edges.minWhiteFoundX + 1;
                var edgesHeight = edges.maxWhiteFoundY - edges.minWhiteFoundY + 1;
                canvas2.setAttribute("width", edgesWidth);
                canvas2.setAttribute("height", edgesHeight);
                canvas2.setAttribute("style", "display: inline; border: 1px solid red;");
                ctx2 = canvas2.getContext('2d');
                ctx2.fillStyle = "rgb(0,0,0)";
                ctx2.fillRect(0, 0, edges.imgW, edges.imgH);
                ctx2.drawImage($grilleImg.get()[0], sx + edges.minWhiteFoundX, sy + edges.minWhiteFoundY, edgesWidth,
                               edgesHeight, 0, 0, edgesWidth, edgesHeight);
                imageData = ctx2.getImageData(0, 0, canvas.width, canvas.height);
                convert_color(imageData);
                ctx2.putImageData(imageData, 0, 0);

                var imageDataBase64 = canvas2.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
                var number = get_number(imageDataBase64);

                var positionGrille = (((x - 1) * rows) + y);

                if (debug) {
                    var br = document.createElement("br");
                    jQuery("body").append(br);
                    jQuery("body").append(canvas);
                    jQuery("body").append(canvas2);
                    $numberElement = jQuery(document.createElement("span")).attr("style",
                                                                                 "border-bottom: 1px solid red;").text(" row=" +
                                                                                                                           y +
                                                                                                                           ";col=" +
                                                                                                                           x +
                                                                                                                           ";img=" +
                                                                                                                           positionGrille +
                                                                                                                           " = " +
                                                                                                                           MD5(imageDataBase64) +
                                                                                                                           " = " +
                                                                                                                           number);
                    jQuery("body").append($numberElement)
                    jQuery("body").append(br);
                }

                if (number != -1) {
                    number2Grilleposition[number] = positionGrille;
                }

                if (number < -1 || number > 9) {
                    alert("Décodage de la grille échoué " + number);
                    throw new Error("Décodage échoué.");
                }

            }
        }

        if (debug) {
            console.log(number2Grilleposition);
        }
    };

    /**
     * Called when user click on the link to log in
     */
    var typePassword = function () {

        // input ou mettrele numéro
        $encodedPasswordField = jQuery("input#postClavier");
        $encodedPasswordField2 = jQuery("input#CodeId");

        if (!number2Grilleposition) {
            alert("Grille non decodee");
            return;
        }
        var password = jQuery("#gm_password").val();
        var encodedPassword = "";
        for (s = 0; s < password.length; s++) {
            var grilleChar = number2Grilleposition[password[s]];
            if (grilleChar < 10) {
                encodedPassword += "0" + grilleChar;
            } else {
                encodedPassword += grilleChar;
            }
        }
        $encodedPasswordField.val(encodedPassword);
        $encodedPasswordField2.val(password);

    };

    /**
     * Add some CSS
     */
    var addCustomCss = function () {
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.innerHTML = "<!-- ";
        //    style.innerHTML += bootstrapCss;
        style.innerHTML += " -->";
        document.head.appendChild(style);

    };

    var $imgGrille = jQuery("#idImageClavier");

    if ($imgGrille.length == 0) {
        if (debug){
            console.log("Aucune grille d'identification trouvee")
        }
        $("#home_accesclient").click(function(){setTimeout(function(){start(jQuery)}, 2000)});
        return;
    }



    var $top = jQuery("body");
    var $fieldset = jQuery("form#formNoSend fieldset").first();
    if ($fieldset.length == 0){
        $fieldset = jQuery("div#clavierVirtuel fieldset form").first();
    }

    setTimeout(function () {
        decodeLCL($imgGrille);
    }, 1000);

    // add a new input password

    var $fieldLabel = jQuery(document.createElement("div")).addClass("fieldLabel");
    var $label = jQuery(document.createElement("label")).attr("for", "gm_password").text("Code d'acces");
    var $span = jQuery(document.createElement("span")).addClass("inputNumCompte");
    var $gmPassword = jQuery(document.createElement("input")).attr("type", "password").attr("id",
                                                                                            "gm_password").attr("name",
                                                                                                                "gm_password");
    $span.append($gmPassword);
    $fieldLabel.append($label);
    $fieldLabel.append($span);
    $fieldset.append($fieldLabel);

    // bind events

    $gmPassword.bind("change", typePassword);
    $gmPassword.bind("keyup", typePassword);

    // add some info about this script

    var $baseline = jQuery(document.createElement("div")).attr("style", "clear: both; background-color: lightgray;%; text-align: center; padding: 1em;");
    var $p = jQuery(document.createElement("h3")).text("LCL - No Virtual Keyboard");
    $p.append($a);
    $baseline.append($p);
    $baseline.append(jQuery(document.createElement("p")).addClass("muted").text("Version " + version));
    var $a = jQuery(document.createElement("a")).attr("href", scriptHome).attr("style", "font-size: 100%;").text(scriptHome);
    $baseline.append(jQuery(document.createElement("p")).append($a));

    jQuery("form#formNoSend .blocDroite").append($baseline);

    if (!debug) {
        jQuery("form#formNoSend fieldset").last().hide();
        jQuery("form#formNoSend fieldset").last().prev().hide();
        jQuery("div#clavierVirtuel fieldset").last().hide();
        jQuery("div#clavierVirtuel fieldset").last().prev().hide();
    }

};

/*
http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome/12751531#12751531
 */

if (typeof jQuery === "function") {
    if (debug){
        console.log ("Running with local copy of jQuery!");
    }
    start(jQuery);
}
else {
    if (debug){
        console.log ("Fetching jQuery from some 3rd-party server.");
    }
    add_jQuery (start, "1");
}

function add_jQuery (callbackFn, jqVersion) {
    var jqVersion   = jqVersion || "1";
    var D           = document;
    var targ        = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode  = D.createElement ('script');
    scriptNode.src  = 'https://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode          = D.createElement ("script");
        scriptNode.textContent  =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}