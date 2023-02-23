//#include "parts/LaBanquePostaleHeader.js"

var debug = false;

var hashToNumber = {};

// chrome
hashToNumber[1189449012] = -1;
hashToNumber[-1096434653] = 0;
hashToNumber[420018280] = 1;
hashToNumber[1268389410] = 2;
hashToNumber[-1987384758] = 3;
hashToNumber[1326933829] = 4;
hashToNumber[-2135049055] = 5;
hashToNumber[-364335363] = 6;
hashToNumber[1750311346] = 7;
hashToNumber[-120840448] = 8;
hashToNumber[977296571] = 9;


// firefox
hashToNumber[1717226140] = 0;
hashToNumber[1041759914] = 9;
hashToNumber[1071594616] = 4;
hashToNumber[-773803777] = 8;
hashToNumber[186768332] = 1;
hashToNumber[1850659647] = 6;
hashToNumber[2113506753] = 7;
hashToNumber[-393535903] = 5;
hashToNumber[-1224342117] = 2;
hashToNumber[515263165] = 3;

// firefox bis
hashToNumber[142344481] = 3;
hashToNumber[-1129298722] = 8;
hashToNumber[166536630] = 4;
hashToNumber[1261568409] =
hashToNumber[1903062125] = 2;
hashToNumber[-2118895200] = 1;
hashToNumber[-836376323] = 7;
hashToNumber[1394188468] = 6;
hashToNumber[30209061] = 9;
hashToNumber[1828363346] = 0;
hashToNumber[-1166098183] = 5;

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
  if (debug) {
    console.log(imageHash);
  }
  var number = hashToNumber[imageHash];
  return number;
};

function decodeGrid(grid) {
  let kGridSize = 4;
  let kCellToSeparatorProportion = 15;
  var separatorWidth = grid.width/((4*kCellToSeparatorProportion+3));
  if (debug) {
    console.log("grid width="+grid.width);
    console.log("separatorWidth="+separatorWidth);
  }
  // each cell has cellWidth px width without the border
  var cellWidth = separatorWidth*kCellToSeparatorProportion;

  var canvas, ctx, imageData;

  var n2p = {};

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
      // no need to convertColor(imageData) here.
      // See http://userscripts.org/scripts/show/126488 - FreeMobile TinyAuth
      ctx.putImageData(imageData, 0, 0);
      var imageDataBase64 = canvas.toDataURL("image/png")
        .replace(/^data:image\/(png|jpg);base64,/, "");
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
  image.src = gridSrc;
  image.onload = function() {
    var number2GridPositionMap = decodeGrid(this);
    attachSubmitHandler(number2GridPositionMap, customizedUI.newPasswordInput);
  };
}

main();
