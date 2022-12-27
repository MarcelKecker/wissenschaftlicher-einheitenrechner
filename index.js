function getZieleinheit() {
  return document.getElementById("dropdownZiel").value;
}
function getAusgangseinheit() {
  return document.getElementById("dropdownStart").value;
}
function getDimension() {
  return document.getElementById("dropdownDimension").value;
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
}

let einheiten = new Map();
let dimensionen = new Map();

function erstellenDimensionUndEinheiten(optionen) {
  let alleEinheitenDieserDimension = [];
  let basisEinheit = new BasisEinheit(optionen.basisEinheit.faktor, optionen.basisEinheit.id);

  alleEinheitenDieserDimension.push(basisEinheit);
  einheiten.set(optionen.basisEinheit.id, basisEinheit);
  for (let unterEinheitId in optionen.unterEinheiten) {
    let faktor = optionen.unterEinheiten[unterEinheitId];
    let unterEinheit = new UnterEinheit(basisEinheit, faktor, unterEinheitId);
    alleEinheitenDieserDimension.push(unterEinheit);
    einheiten.set(unterEinheitId, unterEinheit);
  }

  let dimension = new Dimension(alleEinheitenDieserDimension);
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
  basisEinheit: {
    id: "m",
    faktor: new Faktor(1, [0, -1, -1, 1, 0]),
  },
  unterEinheiten: {},
});
let m = einheiten.get("m");

erstellenDimensionUndEinheiten({
  id: "masse",
  basisEinheit: {
    id: "kg",
    faktor: new Faktor(1, [0, 2, 0, -1, 0]),
  },
  unterEinheiten: {
    g: faktorVonZehnerExponent(-3),
    mg: faktorVonZehnerExponent(-6),
    mug: faktorVonZehnerExponent(-9),
    ng: faktorVonZehnerExponent(-12),
    pg: faktorVonZehnerExponent(-15),
    ag: faktorVonZehnerExponent(-18),
    zg: faktorVonZehnerExponent(-21),
    yg: faktorVonZehnerExponent(-24),
  },
});

let kg = einheiten.get("kg");

erstellenDimensionUndEinheiten({
  id: "zeit",
  basisEinheit: {
    id: "s",
    faktor: new Faktor(1, [0, 0, -1, 1, 0]),
  },
  unterEinheiten: {
    ps: faktorVonZehnerExponent(-12),
    as: faktorVonZehnerExponent(-15),
  },
});

let s = einheiten.get("s");

erstellenDimensionUndEinheiten({
  id: "ladung",
  basisEinheit: {
    id: "C",
    faktor: new Faktor(1, [0, -0.5, -0.5, 0, -0.5]),
  },
  unterEinheiten: {},
});
let C = einheiten.get("C");

/* erstellenDimensionUndEinheiten({
  id: "frequenz",
  basisEinheit: {
    id: "f",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]).dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: {},
});
 */
erstellenDimensionUndEinheiten({
  id: "geschwindigkeit",
  basisEinheit: {
    id: "mPros",
    faktor: m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: {},
});
/*
erstellenDimensionUndEinheiten({
  id: "beschleunigung",
  basisEinheit: {
    id: "mPros2",
    faktor: m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional)),
  },
  unterEinheiten: {},
});

*/
erstellenDimensionUndEinheiten({
  id: "impuls",
  basisEinheit: {
    id: "kgMalmPros",
    faktor: kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: {},
});

/*
erstellenDimensionUndEinheiten({
  id: "kraft",
  basisEinheit: {
    id: "N",
    faktor: kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional).dividieren(s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional)),
  },
  unterEinheiten: {},
});

erstellenDimensionUndEinheiten({
  id: "spannung",
  basisEinheit: {
    id: "V",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: {},
});

erstellenDimensionUndEinheiten({
  id: "stromstaerke",
  basisEinheit: {
    id: "A",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: {},
});

erstellenDimensionUndEinheiten({
  id: "leistung",
  basisEinheit: {
    id: "W",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch, evtl. V.faktorIntraDimensional.multiplizieren(A.faktorIntraDimensional)
  },
  unterEinheiten: {},
});


erstellenDimensionUndEinheiten({
  id: "energie",
  basisEinheit: {
    id: "J",
    faktor: new Faktor(1, [0, 0, 0, 0, 0]), // TODO fehlt noch
  },
  unterEinheiten: {},
});

erstellenDimensionUndEinheiten({
  id: "ladungsdichte",
  basisEinheit: {
    id: "CProm3",
    faktor: C.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional))),
  },
  unterEinheiten: {},
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
  unterEinheiten: {},
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
  unterEinheiten: {},
});

function dimensionVeraendert() {
  let dimension = getDimension();
  let rechenDimension = dimension.toLowerCase().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue");
  zuruecksetzenDroppdownOptionen();
  setDropdownOptionSichtbarkeit(dimensionen.get(rechenDimension).listeEinheiten, true);

  document.getElementById("dropdownZiel").disabled = false;
  document.getElementById("dropdownStart").disabled = false;

  //let newButton = createElement(button);
  //document.body.insertBefore(newButton, null)
}

function zuruecksetzenDroppdownOptionen() {
  setDropdownOptionSichtbarkeit(einheiten.values(), false);
  setDropdownOptionSichtbarkeit(natuerlicheEinheiten, true);
}

function verarbeiteSubmitClick() {
  if (!getAusgangseinheit() || !getZieleinheit() || document.getElementById("ausgangsWert").value == "") {
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
  let ausgangsEinheit1 = einheiten.get(getAusgangseinheit());
  let zielEinheit1 = einheiten.get(getZieleinheit());
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert));
  return ergebnis;
}
