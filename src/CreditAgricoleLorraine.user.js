//#include "parts/CreditAgricoleLorraineHeader.js"


function main() {
    var $form = $("form[name=form_ident]");

    $passwordField = $(document.createElement("input")).attr("type", "password");
    $passwordField.attr("maxlength", "6").attr("style", "margin-left: 2px;").attr("placeholder", "mot de passe");

    $form.append($passwordField);

    $button = $(document.createElement("a")).attr("href", "#").text("login");
    $button.attr("style", "padding: 3px; margin-left: 6px; border: 2px solid white; background-color: #30B3AD; color: white;");
    $form.append($button);

    $("#zoneSaisieClavier table").hide();

    $button.on("click", function () {
        password = $passwordField.val();
        for (s = 0; s < password.length; s++) {
            $form.find("#chiffre_" + password[s]).click();
        }
        var $validate = $form.find("input[type=Image]");
        $validate.click();
    });

};

main();
