//= require parts/LaBanquePostaleHeader.js

var debug = false;

var hashToNumber = new Object();
// firefox
hashToNumber[-1508513256] = -1;
hashToNumber[-1532988814] = 0;
hashToNumber[-1295019928] = 1;
hashToNumber[1259005054]  = 2;
hashToNumber[839745428]   = 3;
hashToNumber[1608492086]  = 4;
hashToNumber[-597409198]  = 5;
hashToNumber[1682182155]  = 6;
hashToNumber[1682894231]  = 7;
hashToNumber[1530826838]  = 8;
hashToNumber[-1257675265] = 9;

function hashCode(s){           // djb2
  return s.split("").reduce(function(a,b){
    a=((a<<5)-a)+b.charCodeAt(0);
    return a&a;                 // Convert to 32bit integer
  },0);
}

function metaData(str) {
  if ("undefined" !== typeof(GM_info))
    return GM_info.script[str];
  else
    return GM_getMetadata(str);
}

function image2number(imageDataBase64) {
  var imageHash = hashCode(imageDataBase64);
  var number = hashToNumber[imageHash];
  return number;
};

function decodeGrid(grid) {

  const kGridSize = 4;
  const kCellHeight = 35; // chaque case chiffre fait kCellHeight px de côté sans la bordure de 1px
  const kBorderSize = 2;

  var canvas, ctx, imageData;

  let n2p = new Object();

  for (let y=0; y<kGridSize; y++) {
    for (let x=0; x<kGridSize; x++) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", kCellHeight);
      canvas.setAttribute("height", kCellHeight);
      canvas.setAttribute("style", "display: inline; border: 1px solid red;");
      ctx = canvas.getContext('2d');

      ctx.fillStyle = "rgb(255,255,100)";
      ctx.fillRect(0, 0, kCellHeight, kCellHeight);

      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(grid,
                    (kCellHeight+kBorderSize)*x,
                    (kCellHeight+kBorderSize)*y,
                    kCellHeight,
                    kCellHeight,
                    0, 0, kCellHeight, kCellHeight); // dst
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
function customizeUi(grid) {
  var loginInput = document.getElementById("val_cel_identifiant");

  var divContenuBloc = loginInput.parentNode;
  var newPasswordLabel = document.createElement("label");
  newPasswordLabel.setAttribute("for", "gm_password");
  newPasswordLabel.setAttribute("id", "gm_labelpassword");
  newPasswordLabel.innerHTML = "Saisir le mot de passe";
  divContenuBloc.appendChild(newPasswordLabel);

  var newPasswordInput = document.createElement("input");
  newPasswordInput.setAttribute("type", "password");
  newPasswordInput.setAttribute("id", "gm_password");
  newPasswordInput.setAttribute("name", "gm_password");
  newPasswordInput.setAttribute("autocomplete", "On");
  newPasswordInput.setAttribute("maxlength","6");
  newPasswordInput.setAttribute("placeholder", "mot de passe");
  divContenuBloc.appendChild(newPasswordInput);

  var newSubmit = document.createElement("input");
  newSubmit.setAttribute("type", "submit");
  newSubmit.setAttribute("value", "VALIDER");
  newSubmit.style.height = "2em";
  divContenuBloc.appendChild(newSubmit);

  // add some info about this script
  var about = document.createElement("div");
  var ptmp = document.createElement("h3");
  ptmp.innerHTML = metaData("name");
  about.appendChild(ptmp);
  ptmp = document.createElement("p");
  ptmp.innerHTML = "Version " + metaData("version");
  about.appendChild(ptmp);
  divContenuBloc.appendChild(about);

  document.getElementById("motDePasseBloc").style.display = "none";
  loginInput.focus();

  return [newSubmit, newPasswordInput];
}

/**
 * attach the submit handler, that translates the password to a positional
 * string, and feeds the dedicated hidden field with it.
 */
function attachSubmitHandler(map, submitElt, passwordElt) {

  function createSubmitHandler(form, map, password) function(event) {
    var password = passwordElt.value;
    var keyboardPass = "";
    for(i = 0 ; i < password.length ; i++){
      var k = map[password[i]];
      if (k < 10) k = "0" + k;
      keyboardPass = keyboardPass + k;
    }
    document.getElementById("cs").value = keyboardPass;

    if (debug)
      alert("pass="+keyboardPass);
    else
      form.submit();
  }

  var form = document.forms['formAccesCompte'];
  var submitHandler = createSubmitHandler(form, map, passwordElt.value);
  form.addEventListener('submit', submitHandler, false);
}


function main() {
  var grid = document.getElementById("clavierImg");

  if (!grid) {
    alert("Aucune grille d'identification trouvee");
    return;
  }

  if (debug) {
    console.log("Grid is");
    console.log(grid);
  }

  var [newSubmit, newPasswordInput] = customizeUi(grid);

  var image = new Image();
  image.onload = function() {
    var number2GridPositionMap = decodeGrid(grid);
    attachSubmitHandler(number2GridPositionMap, newSubmit, newPasswordInput);
  };
  image.src = grid.src;
};

main();
