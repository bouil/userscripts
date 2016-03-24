//#include "parts/BoursoramaHeader.js"
//#include "parts/Md5.js"


var scriptName = GM_info.script.name
var version = GM_info.script.version;
var debug = false;

var md5ToNumber = new Object();
// firefox
md5ToNumber["9dab285910aeaf0e8880952a35deae76"] = -1;
md5ToNumber["1724f8e220c50fdecf8be24679585ad7"] = 0;
md5ToNumber["6459e31fabdd0cad1fc30c0f51c2f429"] = 1;
md5ToNumber["ad7a07c751009248447b1396619f2d8c"] = 2;
md5ToNumber["ff96e5a989e14653f46b9e676cd101b0"] = 3;
md5ToNumber["dabeec18c7dcd9bad401640d25407c69"] = 4;
md5ToNumber["19fe52c89fc2da2a873f3ec8c02bf750"] = 5;
md5ToNumber["e8c45e7df83231acdde4c7c4bf83918e"] = 6;
md5ToNumber["3db12e858957e0758e2b25fb67783107"] = 7;
md5ToNumber["ef89936c94cb315ce4a384cfcda831ea"] = 8;
md5ToNumber["ecb4f933ad875a0a5f49b9d2b770e227"] = 9;


var number2GridPosition;

function _(elt) {
    return document.createElement(elt);
};

function getNumberFromImgMd5(imageDataBase64) {

    var imageMd5 = MD5(imageDataBase64);
    var number = md5ToNumber[imageMd5];
    return number;
};

function decodeGrid(gridElements) {
    number2GridPosition = new Object();
    
    if (debug) {
       console.log("Decoding ", gridElements.length, " elements");
    }
    
    gridElements.each( function(index, gridElement) {
        var data = $(gridElement).find("img").attr('src');
        var number = getNumberFromImgMd5(data);
        if( number != -1 ) {
           number2GridPosition[number] = gridElement;
        }
    });

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
}

/**
 * Called when user click on the link to log in
 */
function submitGrid(form) {

    if (!number2GridPosition) {
        alert("Grille non decodee");
        return;
    }

    var password = $("#gm_password").val();
    for (s = 0; s < password.length; s++) {
        var gridButton = number2GridPosition[password[s]];
        if (debug) {
            console.log(gridButton);
        }
        gridButton.click();
    }

    if (!debug) {
        form.submit();
    } else {
        console.log("Debug mode: no submit");
    }
};

function addPasswordInput($form) {
    var originalPasswordDiv = $form.find('div[data-name="fakePassword"]');
    
    // add a password input
    var $divControlGroupPassword = $("<div/>").attr("id", "gm_password_div")
          .attr("class", originalPasswordDiv.attr("class"))
          .attr("data-name", originalPasswordDiv.attr("data-name"));
    
    var $labelPassword = $("<label/>").attr("for", "gm_password").text(originalPasswordDiv.find("label").text());
    $divControlGroupPassword.append($labelPassword);
    var $divControlPasswordInput = $("<div/>").attr("class", "form-row__widget");
    var $newInputPassword = $("<input/>")
        .attr("type", "password")
        .attr("name", "gm_password")
        .attr("id", "gm_password")
        .attr("autocomplete", "On")
        .attr("maxlength", "8")
        .attr("class", originalPasswordDiv.find("input").attr("class"))
        .keypress(function(event) {
            if ( event.keyCode == 13 ) {
                event.preventDefault();
                submitGrid(form);
            }
        });
    $newInputPassword.appendTo($divControlPasswordInput);
    $divControlGroupPassword.append($divControlPasswordInput);
    
    originalPasswordDiv.before($divControlGroupPassword);
    
    // Remove tabindex to have a better UI
    $form.find("div[data-name='rememberMe'] a").attr('tabindex', -1);
}

function addSubmitButton(form) {
    
    var newInputButton = $("<input/>").attr("value", "Valider").attr("class", "button button--lg");
    newInputButton.bind("click", function () {
        submitGrid(form);
    });
    $("#gm_password_div").after(newInputButton);
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

function customizeUi(form) {

    addPasswordInput(form);

    addScriptInfos(form);

    addSubmitButton(form);

    if (!debug) {
        // Hide pad
        $('div.login-window__actions-mask').hide();
        // Hide read-only input
        $('div[data-name="fakePassword"]:not(#gm_password_div)').hide();
    }

    $form.find("input#login").focus();
}

function main() {
    var form = $("form.js-form-login");
    var gridElements = $("ul.password-input>li>span");

    if (!gridElements || (gridElements.length == 0)) {
        alert("Aucune grille d'identification trouvee")
        return;
    }

    if (debug) {
        console.log("Grid is");
        console.log(gridElements);
    }
    decodeGrid(gridElements);
    customizeUi(form);

};

main();
