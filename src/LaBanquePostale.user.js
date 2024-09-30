//#include "parts/LaBanquePostaleHeader.js"

var debug = false;

function metaData(str) {
    if ("undefined" !== typeof (GM_info)) {
        return GM_info.script[str];
    } else if ("undefined" !== typeof (GM_getMetadata)) {
        return GM_getMetadata(str);
    } else {
        console.log("GM_ API unsupported");
        return "unknown";
    }
}

/**
 * replaces the img/map grid with a simple password input. The login input
 * remains unchanged.
 */
function customizeUI(gridButtons) {

    JQ.$('main *').removeClass('tb-volet-hidden');
    JQ.$('#btnContinuer').addClass('tb-volet-hidden');

    // display the password input and allow to type in it
    const passwordInput = document.getElementById("password");
    // passwordInput.removeAttribute("hidden");
    // passwordInput.setAttribute("type", "password");
    // passwordInput.setAttribute("style", "display: inline-block");
    // remove the span that display the dots
    if (!debug) {
        passwordInput.nextSibling.remove();
        document.getElementsByClassName("puces")[0].setAttribute("style", "display: none");
    }

    // add a new passwordInput
    const newPasswordInput = document.createElement("input");
    passwordInput.parentElement.appendChild(newPasswordInput);
    newPasswordInput.setAttribute("style", "display: inline-block; background-color: lightgreen;");
    newPasswordInput.setAttribute("type", "password");

    // remove the grid
    if (!debug) {
        document.getElementById("label-password").nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("style", "display: none");
    }

    // replace the submit password
    const btnConnexionParent = document.getElementById("btnConfirmer").parentElement;
    document.getElementById("btnConfirmer").setAttribute("style", "display: none");
    const newButton = document.createElement("button");
    newButton.setAttribute("class", "tb-btn-p w100");
    newButton.setAttribute("type", "submit");
    newButton.setAttribute("data-lien-user", "actif");
    newButton.innerText = "Se connecter (!)";
    btnConnexionParent.appendChild(newButton)

    if (debug) {
        console.log(passwordInput);
    }

    // attach the submit handler, that translates the password to a positional string, and replace the dedicated password field with it.

    function createSubmitHandler(form, gridButtons, newPasswordInput) {
        return function (event) {
            // map the input to the scrabbled value
            let newPasswordValue = "";
            for (let i = 0; i < newPasswordInput.value.length; i++) {
                let gridElement = gridButtons[newPasswordInput.value[i]];
                newPasswordValue += gridElement.getAttribute("data-tb-index");
            }
            if (debug) {
                console.log(newPasswordValue);
            }
            passwordInput.value = newPasswordValue;
            submitFormulaire();
        }
    }

    const form = document.forms['formAccesCompte'];
    const submitHandler = createSubmitHandler(form, gridButtons, newPasswordInput);
    form.addEventListener('submit', submitHandler, false);
}


function main() {

    var allButtons = document.getElementsByTagName("button");
    var gridButtons = {};
    for (let button of allButtons) {
        if (button.hasAttribute("data-tb-index")) {
            let buttonRealValue = button.getAttribute("data-tb-index");
            gridButtons[button.innerText] = button;
        }
    }

    if (debug) {
        console.log("Grid is");
        console.log(gridButtons);
    }

    customizeUI(gridButtons);
}

main();
