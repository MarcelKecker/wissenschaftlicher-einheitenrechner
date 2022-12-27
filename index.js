function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
  return new Faktor(document.getElementById("ausgangsWert").value, [0, 0, 0, 0, 0]).bringeAufRichtigeZehnerPotenz();
}

function setDropdownOptionSichtbarkeit(einheiten, sichbarkeit) {
  for (let einheit of einheiten) {
    let id = einheit.getId();
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
  return new Konstante(neuerVorFaktor, neuerZehnerExponent);
}

class Konstante {
  constructor(vorFaktor, zehnerExponent) {
    this.vorFaktor = vorFaktor;
    this.zehnerExponent = zehnerExponent;
  }
  hoch(exponent) {
    return new Konstante(Math.pow(this.vorFaktor, exponent), this.zehnerExponent * exponent);
  }
  multiplizieren(pKonstante) {
    return new Konstante(this.vorFaktor * pKonstante.vorFaktor, this.zehnerExponent + pKonstante.zehnerExponent);
  }
  alsZahl() {
    return this.vorFaktor * Math.pow(10, this.zehnerExponent);
  }
  bringeAufRichtigeZehnerPotenz() {
    return bringeAufRichtigeZehnerPotenz(this.vorFaktor, this.zehnerExponent);
  }
}

const c = new Konstante(2.99792458, 8);
const hq = new Konstante(1.054571817, -34);
const e = new Konstante(1.602176634, -19);
const elFeldkonstante = new Konstante(8.854187817, -12);

class Faktor {
  constructor(vorFaktor, listeExponenten) {
    this.listeExponenten = listeExponenten;
    this.vorFaktor = vorFaktor;
  }

  alsWert() {
    return new Konstante(this.vorFaktor, this.listeExponenten[0])
      .multiplizieren(c.hoch(this.listeExponenten[1]))
      .multiplizieren(hq.hoch(this.listeExponenten[2]))
      .multiplizieren(e.hoch(this.listeExponenten[3]))
      .multiplizieren(elFeldkonstante.hoch(this.listeExponenten[4]));
  }

  multiplizieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor * pFaktor.vorFaktor;
    let neueListeExponenten = new Array();
    if (this.listeExponenten.length !== pFaktor.listeExponenten.length) {
      return;
    }
    for (let i = 0; i < this.listeExponenten.length; i++) {
      neueListeExponenten[i] = this.listeExponenten[i] + pFaktor.listeExponenten[i];
    }
    return new Faktor(neuerVorFaktor, neueListeExponenten);
  }

  dividieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor / pFaktor.vorFaktor;
    let neueListeExponenten = new Array();
    if (this.listeExponenten.length !== pFaktor.listeExponenten.length) {
      return;
    }
    for (let i = 0; i < this.listeExponenten.length; i++) {
      neueListeExponenten[i] = this.listeExponenten[i] - pFaktor.listeExponenten[i];
    }
    return new Faktor(neuerVorFaktor, neueListeExponenten);
  }

  bringeAufRichtigeZehnerPotenz() {
    let konstante = bringeAufRichtigeZehnerPotenz(this.vorFaktor, this.listeExponenten[0]);
    let neueListeExponenten = [...this.listeExponenten];
    neueListeExponenten[0] = konstante.zehnerExponent;
    return new Faktor(konstante.vorFaktor, neueListeExponenten);
  }
}

class BasisEinheit {
  constructor(faktorIntraDimensional, id, label) {
    this.faktorIntraDimensional = faktorIntraDimensional;
    this.id = id;
    if (label !== undefined) {
      this.label = label;
    } else {
      this.label = this.id;
    }
  }
  geteVWert(wert) {
    return wert.multiplizieren(this.faktorIntraDimensional);
  }
  getWertVoneV(wert) {
    return wert.dividieren(this.faktorIntraDimensional);
  }
  getId() {
    return this.id;
  }
}

class UnterEinheit {
  constructor(basisEinheit, faktorInterDimensional, id, label) {
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional;
    this.id = id;
    if (label !== undefined) {
      this.label = label;
    } else {
      this.label = this.id;
    }
  }
  geteVWert(wert) {
    return this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional);
  }
  getWertVoneV(wert) {
    return this.basisEinheit.getWertVoneV(wert).dividieren(this.faktorInterDimensional);
  }
  getId() {
    return this.id;
  }
}

class Dimension {
  constructor(listeEinheiten, id, label) {
    this.listeEinheiten = listeEinheiten;
    this.id = id;
    if (label !== undefined) {
      this.label = label;
    } else {
      this.label = capitalizeFirstLetter(this.id);
    }
  }
}

let einheiten = new Map();
let dimensionen = new Map();

function erstellenDimensionUndEinheiten(optionen) {
  let alleEinheitenDieserDimension = [];
  let basisEinheit = new BasisEinheit(optionen.basisEinheit.faktor, optionen.basisEinheit.id, optionen.basisEinheit.label);

  alleEinheitenDieserDimension.push(basisEinheit);
  einheiten.set(optionen.basisEinheit.id, basisEinheit);
  for (let unterEinheitOptionen of optionen.unterEinheiten) {
    let unterEinheit = new UnterEinheit(basisEinheit, unterEinheitOptionen.faktor, unterEinheitOptionen.id, unterEinheitOptionen.label);
    alleEinheitenDieserDimension.push(unterEinheit);
    einheiten.set(unterEinheitOptionen.id, unterEinheit);
  }

  let dimension = new Dimension(alleEinheitenDieserDimension, optionen.id, optionen.label);
  dimensionen.set(optionen.id, dimension);
}

function faktorVonZehnerExponent(zehnerExponent) {
  return new Faktor(1, [zehnerExponent, 0, 0, 0, 0]);
}

function faktorVonVorFaktor(vorFaktor) {
  return new Faktor(vorFaktor, [0, 0, 0, 0, 0]);
}

// neue Einheit hinzufügen: -> index.html buttons hinzufügen
//

//Natürliche Einheiten
let eV = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]), "eV");
let keV = new UnterEinheit(eV, new Faktor(1, [3, 0, 0, 0, 0]), "keV");
let MeV = new UnterEinheit(eV, new Faktor(1, [6, 0, 0, 0, 0]), "MeV");
let GeV = new UnterEinheit(eV, new Faktor(1, [9, 0, 0, 0, 0]), "GeV");

let natuerlicheEinheiten = [eV, keV, MeV, GeV];
for (let natuerlicheEinheit of natuerlicheEinheiten) {
  einheiten.set(natuerlicheEinheit.id, natuerlicheEinheit);
}

erstellenDimensionUndEinheiten({
  id: "laenge",
  label: "Länge",
  basisEinheit: {
    id: "m",
    faktor: new Faktor(1, [0, -1, -1, 1, 0]),
  },
  unterEinheiten: [],
});
let m = einheiten.get("m");

erstellenDimensionUndEinheiten({
  id: "masse",
  basisEinheit: {
    id: "kg",
    faktor: new Faktor(1, [0, 2, 0, -1, 0]),
  },
  unterEinheiten: [
    { id: "g", faktor: faktorVonZehnerExponent(-3) },
    { id: "mg", faktor: faktorVonZehnerExponent(-6) },
    { id: "mug", faktor: faktorVonZehnerExponent(-9), label: "µg" },
    { id: "ng", faktor: faktorVonZehnerExponent(-12) },
    { id: "pg", faktor: faktorVonZehnerExponent(-15) },
    { id: "ag", faktor: faktorVonZehnerExponent(-18) },
    { id: "zg", faktor: faktorVonZehnerExponent(-21) },
    { id: "yg", faktor: faktorVonZehnerExponent(-24) },
  ],
});

let kg = einheiten.get("kg");

erstellenDimensionUndEinheiten({
  id: "zeit",
  basisEinheit: {
    id: "s",
    faktor: new Faktor(1, [0, 0, -1, 1, 0]),
  },
  unterEinheiten: [
    { id: "ps", faktor: faktorVonZehnerExponent(-12) },
    { id: "as", faktor: faktorVonZehnerExponent(-15) },
  ],
});

let s = einheiten.get("s");

erstellenDimensionUndEinheiten({
  id: "ladung",
  basisEinheit: {
    id: "C",
    faktor: new Faktor(1, [0, -0.5, -0.5, 0, -0.5]),
  },
  unterEinheiten: [],
});
let C = einheiten.get("C");

/* erstellenDimensionUndEinheiten({
  id: "frequenz",
  basisEinheit: {
    id: "f",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]).dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: [],
});
 */
erstellenDimensionUndEinheiten({
  id: "geschwindigkeit",
  basisEinheit: {
    id: "mPros",
    faktor: m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional),
    label: "m/s",
  },
  unterEinheiten: [],
});
/*
erstellenDimensionUndEinheiten({
  id: "beschleunigung",
  basisEinheit: {
    id: "mPros2",
    faktor: m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional)),
  },
  unterEinheiten: [],
});

*/
erstellenDimensionUndEinheiten({
  id: "impuls",
  basisEinheit: {
    id: "kgMalmPros",
    label: "kg ⋅ m/s",
    faktor: kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: [],
});

/*
erstellenDimensionUndEinheiten({
  id: "kraft",
  basisEinheit: {
    id: "N",
    faktor: kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional)),
  },
  unterEinheiten: [],
});

erstellenDimensionUndEinheiten({
  id: "spannung",
  basisEinheit: {
    id: "V",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: [],
});

erstellenDimensionUndEinheiten({
  id: "stromstaerke",
  basisEinheit: {
    id: "A",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: [],
});

erstellenDimensionUndEinheiten({
  id: "leistung",
  basisEinheit: {
    id: "W",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch, evtl. V.faktorIntraDimensional.multiplizieren(A.faktorIntraDimensional)
  },
  unterEinheiten: [],
});


erstellenDimensionUndEinheiten({
  id: "energie",
  basisEinheit: {
    id: "J",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: [],
});

erstellenDimensionUndEinheiten({
  id: "ladungsdichte",
  basisEinheit: {
    id: "CProm3",
    faktor: C.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional))),
  },
  unterEinheiten: [],
});

//Stromdichte

//Elektrische Feldstärke

//Potenzial

erstellenDimensionUndEinheiten({
  id: "druck",
  basisEinheit: {
    id: "Pa",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: [],
});
//Dichte

//Fläche

//Volumen
*/
erstellenDimensionUndEinheiten({
  id: "temperatur",
  basisEinheit: {
    id: "K",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch, evt. kg.faktorIntraDimensional.multiplizieren(new Faktor(1, [0, 0, 0, -1, 0])) ?
  },
  unterEinheiten: [],
});

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

function dimensionVeraendert() {
  document.getElementById("dropdownZiel").value = "";
  document.getElementById("dropdownStart").value = "";

  zuruecksetzenDroppdownOptionen();
  let dimension = getDimension();
  if (dimension == "") {
    document.getElementById("dropdownZiel").disabled = true;
    document.getElementById("dropdownStart").disabled = true;

    return;
  }
  let rechenDimension = dimension.toLowerCase().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue");
  setDropdownOptionSichtbarkeit(dimensionen.get(rechenDimension).listeEinheiten, true);

  document.getElementById("dropdownZiel").disabled = false;
  document.getElementById("dropdownStart").disabled = false;
}

function zuruecksetzenDroppdownOptionen() {
  setDropdownOptionSichtbarkeit(einheiten.values(), false);
  setDropdownOptionSichtbarkeit(natuerlicheEinheiten, true);
}

function verarbeiteSubmitClick() {
  if (!getAusgangseinheit() || !getZieleinheit() || document.getElementById("ausgangsWert").value == "") {
    return;
  }

  let ergebnis = berechneErgebnis();
  zeigeErgebnisAn(ergebnis);
}

function zeigeErgebnisAn(ergebnis) {
  //Wert gerundet

  let ausgabe = toGerundetesErgebnisString(ergebnis);
  document.getElementById("endWertAusgabeWert").textContent = ausgabe;
  //Variablen

  let konstAusgabe = toKonstantenErgebnisString(ergebnis, ausgabe);
  document.getElementById("endWertAusgabeKonstanten").textContent = konstAusgabe;
}

function toKonstantenErgebnisString(ergebnis, ausgabe) {
  ergebnis = ergebnis.bringeAufRichtigeZehnerPotenz();
  let konstAusgabe = "";
  if (ergebnis.listeExponenten[0] <= 3 && ergebnis.listeExponenten[0] >= 1) {
    ergebnis.vorFaktor = ergebnis.vorFaktor * Math.pow(10, ergebnis.listeExponenten[0]);
  } else if (ergebnis.listeExponenten[0] !== 0) {
    konstAusgabe += " * 10^" + ergebnis.listeExponenten[0];
  }
  const konstanten = ["c", "ℏ", "e", "ε₀"];
  for (let i = 0; i < konstanten.length; i++) {
    if (ergebnis.listeExponenten[i + 1] == 1) {
      konstAusgabe += " * " + konstanten[i];
    } else if (ergebnis.listeExponenten[i + 1] !== 0) {
      konstAusgabe += " * " + konstanten[i] + "^" + ergebnis.listeExponenten[i + 1];
    }
  }
  if (ergebnis.vorFaktor == 1) {
    konstAusgabe = konstAusgabe.replace(" * ", "");
  } else {
    konstAusgabe = ergebnis.vorFaktor + "" + konstAusgabe;
  }
  if (konstAusgabe == ausgabe) {
    return "";
  }
  return konstAusgabe;
}

function toGerundetesErgebnisString(ergebnis) {
  let gerundetesErgebnis = ergebnis.alsWert().bringeAufRichtigeZehnerPotenz();
  if (gerundetesErgebnis.vorFaktor == 1 && gerundetesErgebnis.zehnerExponent == 0) {
    return "1";
  }
  if (gerundetesErgebnis.zehnerExponent == 0) {
    return gerundetesErgebnis.vorFaktor;
  }
  if (gerundetesErgebnis.zehnerExponent <= 3 && gerundetesErgebnis.zehnerExponent >= 1) {
    return gerundetesErgebnis.vorFaktor * Math.pow(10, gerundetesErgebnis.zehnerExponent);
  }
  if (gerundetesErgebnis.vorFaktor == 1) {
    return "10^" + gerundetesErgebnis.zehnerExponent;
  }
  if (gerundetesErgebnis.vorFaktor == 0) {
    return 0;
  }
  return gerundetesErgebnis.vorFaktor + " * 10^" + gerundetesErgebnis.zehnerExponent;
}

function berechneErgebnis() {
  let ausgangsEinheit1 = einheiten.get(getAusgangseinheit());
  let zielEinheit1 = einheiten.get(getZieleinheit());
  let ausgangsWert = getAusgangsWert();
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert));
  return ergebnis;
}

window.addEventListener("load", function () {
  erstelleOptionenFuerEinheiten();
  erstelleOptionenFuerDimensionen();
});
