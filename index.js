function getZieleinheit() {
  return document.getElementById("dropdownZiel").value;
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
    let neuerVorFaktor = this.vorFaktor;
    let neuerZehnerExponent = this.zehnerExponent;
    while (Math.abs(neuerVorFaktor) >= 10) {
      neuerVorFaktor = this.vorFaktor / 10;
      neuerZehnerExponent++;
    }
    while (Math.abs(neuerVorFaktor) < 1 && neuerVorFaktor !== 0) {
      neuerVorFaktor = this.vorFaktor * 10;
      neuerZehnerExponent--;
    }
    return new Konstante(neuerVorFaktor, neuerZehnerExponent);
  }
}

var ausgangsEinheit;
var ausgangsWert;
var ergebnis;
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
    for (; this.vorFaktor >= 10; this.listeExponenten[0]++) {
      this.vorFaktor = this.vorFaktor / 10;
    }
    for (; this.vorFaktor < 1 && this.vorFaktor > 0; this.listeExponenten[0]--) {
      this.vorFaktor = this.vorFaktor * 10;
    }
  }
}

class BasisEinheit {
  constructor(faktorIntraDimensional, id) {
    this.faktorIntraDimensional = faktorIntraDimensional;
    this.id = id;
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
  constructor(basisEinheit, faktorInterDimensional, id) {
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional;
    this.id = id;
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
  constructor(listeEinheiten) {
    this.listeEinheiten = listeEinheiten;
  }
  setSichbarkeit(sichbarkeit) {
    for (let i = 0; i < this.listeEinheiten.length; i++) {
      let id = this.listeEinheiten[i].getId();
      // TODO nicht nur dropdownZiel, sondern beides!!!
      const option = document.querySelector("#dropdownZiel option[value=" + id + "]");
      option.hidden = !sichbarkeit;
    }
  }
}

// neue Einheit hinzufügen: -> index.html buttons hinzufügen
//

//Länge
let m = new BasisEinheit(new Faktor(1, [0, -1, -1, 1, 0]), "m");

//Masse
let kg = new BasisEinheit(new Faktor(1, [0, 2, 0, -1, 0]), "kg");
let g = new UnterEinheit(kg, new Faktor(1, [-3, 0, 0, 0, 0]), "g");
let mg = new UnterEinheit(kg, new Faktor(1, [-6, 0, 0, 0, 0]), "mg");
let mug = new UnterEinheit(kg, new Faktor(1, [-9, 0, 0, 0, 0]), "mug");
let ng = new UnterEinheit(kg, new Faktor(1, [-12, 0, 0, 0, 0]), "ng");
let pg = new UnterEinheit(kg, new Faktor(1, [-15, 0, 0, 0, 0]), "pg");
let ag = new UnterEinheit(kg, new Faktor(1, [-18, 0, 0, 0, 0]), "ag");
let zg = new UnterEinheit(kg, new Faktor(1, [-21, 0, 0, 0, 0]), "zg");
let yg = new UnterEinheit(kg, new Faktor(1, [-24, 0, 0, 0, 0]), "yg");

//Zeit
let s = new BasisEinheit(new Faktor(1, [0, 0, -1, 1, 0]), "s");
let ps = new UnterEinheit(s, new Faktor(1, [-12, 0, 0, 0, 0]), "ps");
let as = new UnterEinheit(s, new Faktor(1, [-15, 0, 0, 0, 0]), "as");

//Frequenz
let f = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]).dividieren(s.faktorIntraDimensional), "f");

//Geschwindigkeit
let mPros = new BasisEinheit(m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional), "mPros");

//Beschleunigung
let mPros2 = new BasisEinheit(undefined, "mPros2");

//Impuls
let kgMalmPros = new BasisEinheit(kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional), "kgMalmPros");

//Kraft
let N = new BasisEinheit(kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional)), "N");

//Spannung
let V = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]), "V");

//Stromstärke
//TODO richtiger Faktor
let A = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]), "A");

//Leistung
let W = new BasisEinheit(V.faktorIntraDimensional.multiplizieren(A.faktorIntraDimensional), "W");

//Energie
let J = new BasisEinheit(undefined, "J");

//Ladung
let C = new BasisEinheit(new Faktor(1, [0, -0.5, -0.5, 0, -0.5]), "C");

//Ladungsdichte
let CProm3 = new BasisEinheit(
  C.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional))),
  "CProm3"
);

//Stromdichte

//Elektrische Feldstärke

//Potenzial

//Druck
let Pa = new BasisEinheit(undefined, "Pa");

//Dichte

//Fläche

//Volumen

//Temperatur
let K = new BasisEinheit(kg.faktorIntraDimensional.multiplizieren(new Faktor(1, [0, 0, 0, -1, 0])), "K");

//Natürliche Einheiten
let eV = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]), "eV");
let keV = new UnterEinheit(eV, new Faktor(1, [3, 0, 0, 0, 0]), "keV");
let MeV = new UnterEinheit(eV, new Faktor(1, [6, 0, 0, 0, 0]), "MeV");
let GeV = new UnterEinheit(eV, new Faktor(1, [9, 0, 0, 0, 0]), "GeV");

let natuerlicheEinheiten = [eV, keV, MeV, GeV];

let einheiten = new Map([
  ["kg", kg],
  ["g", g],
  ["mg", mg],
  ["mug", mug],
  ["ng", ng],
  ["pg", pg],
  ["ag", ag],
  ["zg", zg],
  ["yg", yg],

  ["s", s],
  ["ps", ps],
  ["as", as],

  ["eV", eV],
  ["keV", keV],
  ["MeV", MeV],
  ["GeV", GeV],

  ["m", m],

  ["K", K],

  ["kgMalmPros", kgMalmPros],

  ["mPros", mPros],

  ["C", C],
  //['', ],
  //['neueEinheit', neueEinheit],
]);

let masse = new Dimension([kg, g, mg, mug, ng, pg, ag, zg, yg]);
let zeit = new Dimension([s, ps, as]);
let laenge = new Dimension([m]);
let energie = new Dimension([eV, keV, MeV, GeV]);
let kraft = new Dimension([]);
let geschwindigkeit = new Dimension([mPros]);

let dimensionen = new Map([
  ["masse", masse],
  ["zeit", zeit],
  ["laenge", laenge],
  ["energie", energie],
  ["kraft", kraft],
  ["geschwindigkeit", geschwindigkeit],
  //['', ],
  //['neueEinheit', neueEinheit],
]);

function setDimension(dimension) {
  document.getElementById("buttonDimension").textContent = dimension;

  let rechenDimension = dimension.toLowerCase().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue");
  alleDimensionenVerstecken();
  dimensionen.get(rechenDimension).setSichbarkeit(true);
  // TODO hier auch das andere nicht-disablen!
  document.getElementById("dropdownZiel").disabled = false;

  //let newButton = createElement(button);
  //document.body.insertBefore(newButton, null)
}

function alleDimensionenVerstecken() {
  masse.setSichbarkeit(false);
  zeit.setSichbarkeit(false);
  laenge.setSichbarkeit(false);
  energie.setSichbarkeit(false);
  kraft.setSichbarkeit(false);
  geschwindigkeit.setSichbarkeit(false);
  for (let i = 0; i < natuerlicheEinheiten.length; i++) {
    let id = natuerlicheEinheiten[i].getId();
    // TODO eine Methode, die auch in setSichtbarkeit aufgerufen wird!
    const option = document.querySelector("#dropdownZiel option[value=" + id + "]");
    option.hidden = false;
  }
}

function setAusgangseinheit(einheit) {
  ausgangsEinheit = einheit;
  if (ausgangsEinheit == "kgMalmPros") {
    einheit = "kg ⋅ m/s";
  }
  if (ausgangsEinheit == "mPros") {
    einheit = "m/s";
  }
  document.getElementById("buttonAusgangseinheit").textContent = einheit;
}

function verarbeiteSubmitClick() {
  if (ausgangsEinheit == undefined || !getZieleinheit() || document.getElementById("ausgangsWert").value == "") {
    return;
  }
  ausgangsWert = new Faktor(document.getElementById("ausgangsWert").value, [0, 0, 0, 0, 0]);
  while (ausgangsWert.vorFaktor >= 10) {
    ausgangsWert.vorFaktor = ausgangsWert.vorFaktor / 10;
    ausgangsWert.listeExponenten[0] += 1;
  }
  let ergebnis = berechneErgebnis();
  zeigeErgebnisAn(ergebnis);
}

function zeigeErgebnisAn(ergebnis) {
  //Wert gerundet

  let gerundetesErgebnis = ergebnis.alsWert().bringeAufRichtigeZehnerPotenz();
  let ausgabe = toGerundetesErgebnisString(gerundetesErgebnis);
  document.getElementById("endWertAusgabeWert").textContent = ausgabe;
  //Variablen

  ergebnis.bringeAufRichtigeZehnerPotenz();
  let konstAusgabe = "";
  if (ergebnis.listeExponenten[0] <= 3 && ergebnis.listeExponenten[0] >= 1) {
    ergebnis.vorFaktor = ergebnis.vorFaktor * Math.pow(10, ergebnis.listeExponenten[0]);
  } else if (ergebnis.listeExponenten[0] !== 0) {
    konstAusgabe += " * 10^" + ergebnis.listeExponenten[0];
  }
  if (ergebnis.listeExponenten[1] == 1) {
    konstAusgabe += " * c";
  } else if (ergebnis.listeExponenten[1] !== 0) {
    konstAusgabe += " * c^" + ergebnis.listeExponenten[1];
  }
  if (ergebnis.listeExponenten[2] == 1) {
    konstAusgabe += " * ℏ";
  } else if (ergebnis.listeExponenten[2] !== 0) {
    konstAusgabe += " * ℏ^" + ergebnis.listeExponenten[2];
  }
  if (ergebnis.listeExponenten[3] == 1) {
    konstAusgabe += " * e";
  } else if (ergebnis.listeExponenten[3] !== 0) {
    konstAusgabe += " * e^" + ergebnis.listeExponenten[3];
  }
  if (ergebnis.listeExponenten[4] == 1) {
    konstAusgabe += " * ε₀";
  } else if (ergebnis.listeExponenten[4] !== 0) {
    konstAusgabe += " * ε₀^" + ergebnis.listeExponenten[4];
  }
  if (ergebnis.vorFaktor == 1) {
    konstAusgabe = konstAusgabe.replace(" * ", "");
  } else {
    konstAusgabe = ergebnis.vorFaktor + "" + konstAusgabe;
  }
  if (konstAusgabe == ausgabe) {
    document.getElementById("endWertAusgabeKonstanten").textContent = "";
    return;
  }
  document.getElementById("endWertAusgabeKonstanten").textContent = konstAusgabe;
}

function toGerundetesErgebnisString(gerundetesErgebnis) {
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
  let ausgangsEinheit1 = einheiten.get(ausgangsEinheit);
  let zielEinheit1 = einheiten.get(getZieleinheit());
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert));
  return ergebnis;
}
//temp

// .dropbtn {
//   box-sizing: border-box;
//   height: 10%;
//   width: 10%;
//   position: fixed;
//   top: 50%;
//   margin-top: -100px;
//   margin-left: -200px;
//   background-color: #f1f1f1;
//   color: black;
//   padding: 0px;
//   font-size: 16px;
//   border: black;
// }
