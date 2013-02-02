function addCustomCss(cssText) {
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = "<!-- ";
    style.innerHTML += cssText;
    style.innerHTML += " -->";
    document.head.appendChild(style);

};
