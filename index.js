function getZieleinheit() {
  return document.getElementById("dropdownZiel").value;
}

function getAusgangseinheit() {
  return document.getElementById("dropdownStart").value;
}

function getDimension() {
  return document.getElementById("dropdownDimension").value;
}

function getAusgangsWert() {
  return new Wert(document.getElementById("ausgangsWert").value, 0).bringeAufRichtigeZehnerPotenz();
}

function runden(zahl, anzahlStellen) {
  return parseFloat((Math.round(zahl * Math.pow(10, anzahlStellen)) / Math.pow(10, anzahlStellen)).toFixed(anzahlStellen));
}

function setDropdownOptionSichtbarkeit(einheiten, sichbarkeit) {
  for (let einheit of einheiten) {
    let id = einheit.id;
    const option = document.querySelector("#dropdownZiel option[value=" + id + "]");
    option.hidden = !sichbarkeit;
    const option1 = document.querySelector("#dropdownStart option[value=" + id + "]");
    option1.hidden = !sichbarkeit;
  }
}

function bringeAufRichtigeZehnerPotenz(vorFaktor, zehnerExponent) {
  let neuerVorFaktor = vorFaktor;
  let neuerZehnerExponent = zehnerExponent;
  while (Math.abs(neuerVorFaktor) >= 10) {
    neuerVorFaktor /= 10;
    neuerZehnerExponent++;
  }
  while (Math.abs(neuerVorFaktor) < 1 && neuerVorFaktor !== 0) {
    neuerVorFaktor *= 10;
    neuerZehnerExponent--;
  }
  return new Wert(neuerVorFaktor, neuerZehnerExponent);
}

function erstelleOptionFuerEinheit(einheit) {
  let element = document.createElement("option");
  element.value = einheit.id;
  element.text = einheit.label;
  return element;
}

function erstelleOptionenFuerEinheiten() {
  for (let einheit of einheiten.values()) {
    let element1 = erstelleOptionFuerEinheit(einheit);
    document.getElementById("dropdownZiel").appendChild(element1);

    let element2 = erstelleOptionFuerEinheit(einheit);
    document.getElementById("dropdownStart").appendChild(element2);
  }
}

function erstelleOptionenFuerDimensionen() {
  for (let dimension of dimensionen.values()) {
    let element = document.createElement("option");
    element.value = dimension.id;
    element.text = dimension.label;
    document.getElementById("dropdownDimension").appendChild(element);
  }
}
function schreibeErstenBuchstabenKlein(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function dimensionVeraendert() {
  document.getElementById("dropdownZiel").value = "";
  document.getElementById("dropdownStart").value = "";
  document.getElementById("ausgangsWert").value = "";
  document.getElementById("endWertAusgabeWert").textContent = "";
  document.getElementById("endWertAusgabeKonstanten").hidden = true;

  zuruecksetzenDroppdownOptionen();
  let dimension = getDimension();
  if (dimension == "") {
    document.getElementById("dropdownZiel").disabled = true;
    document.getElementById("dropdownStart").disabled = true;
    return;
  }
  
  let rechenDimension = schreibeErstenBuchstabenKlein(dimension).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue");
  setDropdownOptionSichtbarkeit(dimensionen.get(rechenDimension).listeEinheiten, true);

  document.getElementById("dropdownZiel").disabled = false;
  document.getElementById("dropdownStart").disabled = false;
}

function zuruecksetzenDroppdownOptionen() {
  setDropdownOptionSichtbarkeit(einheiten.values(), false);
}

function verarbeiteSubmitClick() {
  if (!getAusgangseinheit() || !getZieleinheit() || document.getElementById("ausgangsWert").value == "") {
    return;
  }

  let ergebnis = berechneErgebnis();
  zeigeErgebnisAn(ergebnis);
}

function zeigeErgebnisAn(ergebnis) {
  let ausgabe = toGerundetesErgebnisString(ergebnis);
  document.getElementById("endWertAusgabeWert").textContent = ausgabe;
  let konstAusgabe = toKonstantenErgebnisString(ergebnis);
  if (konstAusgabe === null || konstAusgabe === ausgabe) {
    konstAusgabe = "";
  }
  document.getElementById("endWertAusgabeKonstanten").hidden = konstAusgabe === "";
  document.getElementById("endWertAusgabeKonstanten").textContent = konstAusgabe;
}

function toKonstantenErgebnisString(ergebnis) {
  ergebnis = ergebnis.bringeAufRichtigeZehnerPotenz();
  let faktor = ergebnis.faktor;
  let summand = ergebnis.summand;
  let konstAusgabe = "";
  if (faktor.listeExponenten[0] <= 3 && faktor.listeExponenten[0] >= 1) {
    faktor.vorFaktor = faktor.vorFaktor * Math.pow(10, faktor.listeExponenten[0]);
  } else if (faktor.listeExponenten[0] !== 0) {
    konstAusgabe += " * 10^" + faktor.listeExponenten[0];
  }

  faktor.vorFaktor = runden(faktor.vorFaktor, 6);
  let keineKonstanten = true;
  const konstanten = ["c", "ℏ", "e", "ε₀", "k"];
  for (let i = 0; i < konstanten.length; i++) {
    if (faktor.listeExponenten[i + 1] == 1) {
      konstAusgabe += " * " + konstanten[i];
      keineKonstanten = false;
    } else if (faktor.listeExponenten[i + 1] !== 0) {
      konstAusgabe += " * " + konstanten[i] + "^" + faktor.listeExponenten[i + 1];
      keineKonstanten = false;
    }
  }
  if (keineKonstanten) {
    return null;
  }
  if (faktor.vorFaktor == 1) {
    konstAusgabe = konstAusgabe.replace(" * ", "");
  } else {
    konstAusgabe = faktor.vorFaktor + "" + konstAusgabe;
  }
  if (summand === 0) {
    return konstAusgabe;
  }
  if (summand < 0) {
    return konstAusgabe + " - " + -summand;
  }
  return konstAusgabe + " + " + summand;
}

function toGerundetesErgebnisString(ergebnis) {
  let gerundetesErgebnis = ergebnis.alsWert().bringeAufRichtigeZehnerPotenz();
  let vorFaktor = runden(gerundetesErgebnis.vorFaktor, 6);
  if (vorFaktor == 1 && gerundetesErgebnis.zehnerExponent == 0) {
    return "1";
  }
  if (gerundetesErgebnis.zehnerExponent == 0) {
    return vorFaktor;
  }
  if (gerundetesErgebnis.zehnerExponent <= 3 && gerundetesErgebnis.zehnerExponent >= 1) {
    return runden(vorFaktor * Math.pow(10, gerundetesErgebnis.zehnerExponent), 6);
  }
  if (vorFaktor == 1) {
    return "10^" + gerundetesErgebnis.zehnerExponent;
  }
  if (vorFaktor == 0) {
    return 0;
  }
  return vorFaktor + " * 10^" + gerundetesErgebnis.zehnerExponent;
}

function berechneErgebnis() {
  let ausgangsEinheit = einheiten.get(getAusgangseinheit());
  let zielEinheit = einheiten.get(getZieleinheit());
  let ausgangsWert = getAusgangsWert();
  //programm kann alles machen (mg -> nm), ist aber nicht sinnvoll
  let ergebnis = zielEinheit.getErgebnisVonNatuerlicheEinheit(ausgangsEinheit.getWertInNatuerlicheEinheit(ausgangsWert));
  return ergebnis;
}

window.addEventListener("load", function () {
  erstelleOptionenFuerEinheiten();
  erstelleOptionenFuerDimensionen();
});
