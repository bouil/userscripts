//#include "parts/LaBanquePostaleHeader.js"

var debug = false;

var hashToNumber = new Object();
// firefox img width = 189
hashToNumber[-1043926944] = -1;
hashToNumber[-2130428491] = 0;
hashToNumber[-1837280483] = 1;
hashToNumber[1026132830]  = 2;
hashToNumber[-1698608298] = 3;
hashToNumber[-1077831249] = 4;
hashToNumber[2068935818]  = 5;
hashToNumber[-1889082328] = 6;
hashToNumber[-1249366341] = 7;
hashToNumber[770344175]   = 8;
hashToNumber[-1797046635] = 9;

// firefox img width = 252
hashToNumber[1499838977]  = -1;
hashToNumber[-386854821]  = 0;
hashToNumber[-44352046]   = 1;
hashToNumber[-1844652104] = 2;
hashToNumber[2027333567]  = 3;
hashToNumber[-1613094677] = 4;
hashToNumber[-1071223325] = 5;
hashToNumber[-397500456]  = 6;
hashToNumber[66524547]    = 7;
hashToNumber[2021485583]  = 8;
hashToNumber[1667821383]  = 9;

// chrome img width = 189
hashToNumber[1261568409]  = -1;
hashToNumber[-737831289]  = 0;
hashToNumber[-1939970274] = 1;
hashToNumber[1633837072]  = 2;
hashToNumber[-1476820365] = 3;
hashToNumber[-1744932522] = 4;
hashToNumber[311929800]   = 5;
hashToNumber[-1780532980] = 6;
hashToNumber[1914433817]  = 7;
hashToNumber[-1580087094] = 8;
hashToNumber[-1726714153] = 9;

// chrome img width = 252
hashToNumber[1367079729]  = -1;
hashToNumber[1361177620]  = 0;
hashToNumber[104477207]   = 1;
hashToNumber[-721997744]  = 2;
hashToNumber[1409920244]  = 3;
hashToNumber[190752219]   = 4;
hashToNumber[-161292196]  = 5;
hashToNumber[1024300490]  = 6;
hashToNumber[113276182]   = 7;
hashToNumber[-1874617512] = 8;
hashToNumber[528407293]   = 9;

function hashCode(s){           // djb2
  return s.split("").reduce(function(a,b){
    a=((a<<5)-a)+b.charCodeAt(0);
    return a&a;                 // Convert to 32bit integer
  },0);
}

function metaData(str) {
  if ("undefined" !== typeof(GM_info)) {
    return GM_info.script[str];
  } else if ("undefined" !== typeof(GM_getMetadata)) {
    return GM_getMetadata(str);
  } else {
    console.log("GM_ API unsupported");
    return "unknown";
  }
}

function image2number(imageDataBase64) {
  var imageHash = hashCode(imageDataBase64);
  var number = hashToNumber[imageHash];
  return number;
};

function decodeGrid(grid) {
  const kGridSize = 4;
  var separatorWidth = grid.width/((4*15+3));   // cell/separator proportion is 15
  if (debug) {
    console.log("grid width="+grid.width);
    console.log("separatorWidth="+separatorWidth);
  }
  var cellWidth = separatorWidth*15; // chaque case chiffre fait cellWidth px de côté sans la bordure

  var canvas, ctx, imageData;

  var n2p = new Object();

  for (var y=0; y<kGridSize; y++) {
    for (var x=0; x<kGridSize; x++) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", cellWidth);
      canvas.setAttribute("height", cellWidth);
      canvas.setAttribute("style", "display: inline; border: 1px solid red;");
      ctx = canvas.getContext('2d');

      ctx.fillStyle = "rgb(255,255,100)";
      ctx.fillRect(0, 0, cellWidth, cellWidth);

      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(grid,
                    (cellWidth+separatorWidth)*x,
                    (cellWidth+separatorWidth)*y,
                    cellWidth,
                    cellWidth,
                    0, 0, cellWidth, cellWidth); // dst
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // no need to convertColor(imageData) here. see http://userscripts.org/scripts/show/126488 - FreeMobile TinyAuth
      ctx.putImageData(imageData, 0, 0);
      var imageDataBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
      var number = image2number(imageDataBase64);
      var gridPosition = (y * kGridSize + x);

      if (debug) {
        var br = document.createElement("br");
        document.body.appendChild(br);
        document.body.appendChild(canvas);
        numberElement = document.createElement("span");
        numberElement.setAttribute("style", "border-bottom: 1px solid red;");
        numberElement.innerHTML = " row=" + y + ";col=" + x +
          ";imgNumber=" + gridPosition +
          ";hash=" +
          hashCode(imageDataBase64) + " = " +
          number;
        document.body.appendChild(numberElement);
        document.body.appendChild(br);
      }

      if (number != -1) {
        n2p[number] = gridPosition;
      }

      if (number < -1 || number > 9) {
        alert("Décodage de la grille échoué " + number);
        throw new Error("Décodage échoué.");
      }

    }
  }

  if (debug) {
    console.log("Number -> Grille =");
    console.log(n2p);
  }

  for(n=0;n<10;n++){
    if (typeof n2p[n] == "undefined"){
      alert("Grille non decodee pour le chiffre " + n + ". Essayez de mettre a jour le script.");
      break;
    }
  }

  return n2p;
}

/**
 * replaces the img/map grid with a simple password input. The login input
 * remains unchanged.
 */
function customizeUI(grid) {
  var divBlocMdp = document.getElementById("cvs-bloc-mdp");

  var loginInput = document.getElementById("val_cel_identifiant");
  loginInput.setAttribute("autocomplete", "on");

  var newPasswordInput = document.getElementById("cvs-bloc-mdp-input").cloneNode(true);
  newPasswordInput.removeAttribute("disabled");
  newPasswordInput.setAttribute("type", "password");
  newPasswordInput.setAttribute("autocomplete", "on");
  newPasswordInput.setAttribute("maxlength","6");
  while (divBlocMdp.hasChildNodes()) {
    divBlocMdp.removeChild(divBlocMdp.lastChild);
  }
  divBlocMdp.appendChild(newPasswordInput);

  var oldSubmit = document.getElementById("valider");
  var newSubmit = oldSubmit.cloneNode(true); // listeners not copied!
    // onclick sendForm()
  newSubmit.setAttribute("type", "submit");
  newSubmit.setAttribute("id", "gm_submit");
  newSubmit.removeAttribute("disabled");
  newSubmit.removeAttribute("grey");
  newSubmit.style.backgroundColor = "#004B9B";
  oldSubmit.parentNode.replaceChild(newSubmit, oldSubmit);

  // add some info about this script
  var about = document.createElement("div");
  var ptmp = document.createElement("h3");
  ptmp.innerHTML = metaData("name");
  about.appendChild(ptmp);
  ptmp = document.createElement("p");
  ptmp.innerHTML = "Version " + metaData("version");
  about.appendChild(ptmp);
  newSubmit.parentNode.appendChild(about);

  document.getElementById("val_cel_identifiant").focus();

  return {newSubmit: newSubmit, newPasswordInput: newPasswordInput};
}

/**
 * attach the submit handler, that translates the password to a positional
 * string, and feeds the dedicated hidden field with it.
 */
function attachSubmitHandler(map, passwordElt) {

  function createSubmitHandler(form, map, password){ return function (event) {
    var password = passwordElt.value;
    var keyboardPass = "";
    for(i = 0 ; i < password.length ; i++){
      var k = map[password[i]];
      if (k < 10) k = "0" + k;
      keyboardPass = keyboardPass + k;
    }
    document.getElementById("cs").value = keyboardPass; // hidden password

    if (debug)
      alert("pass="+keyboardPass);
    else
      form.submit();
  };}

  var form = document.forms['formAccesCompte'];
  var submitHandler = createSubmitHandler(form, map, passwordElt.value);
  form.addEventListener('submit', submitHandler, false);
}

function imgSrc(str) {
  return (str.match(/url\([^\)]+\)/gi) || [""])[0].split(/[()'"]+/)[1];
}


function main() {
  var elt = document.getElementById('imageclavier'),
      style = elt.currentStyle || window.getComputedStyle(elt, false),
      bg = style.getPropertyValue('background-image'),
      gridSrc = imgSrc(bg);

  if (!gridSrc) {
    alert("Aucune grille d'identification trouvee");
    return;
  }

  if (debug) {
    console.log("Grid is");
    console.log(gridSrc);
  }

  var customizedUI = customizeUI(elt);

  var image = new Image();
  image.onload = function() {
    var number2GridPositionMap = decodeGrid(this);
    attachSubmitHandler(number2GridPositionMap, customizedUI.newPasswordInput);
  };
  image.src = gridSrc;
};

main();
