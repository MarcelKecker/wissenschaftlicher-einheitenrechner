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

class Wert {
  constructor(vorFaktor, zehnerExponent) {
    this.vorFaktor = vorFaktor;
    this.zehnerExponent = zehnerExponent;
  }
  hoch(exponent) {
    return new Wert(Math.pow(this.vorFaktor, exponent), this.zehnerExponent * exponent);
  }
  multiplizieren(pKonstante) {
    return new Wert(this.vorFaktor * pKonstante.vorFaktor, this.zehnerExponent + pKonstante.zehnerExponent);
  }
  alsZahl() {
    return this.vorFaktor * Math.pow(10, this.zehnerExponent);
  }
  alsFaktor() {
    return new Faktor(this.vorFaktor, [this.zehnerExponent, 0, 0, 0, 0, 0]);
  }
  bringeAufRichtigeZehnerPotenz() {
    return bringeAufRichtigeZehnerPotenz(this.vorFaktor, this.zehnerExponent);
  }
}

const c = new Wert(2.99792458, 8);
const hq = new Wert(1.054571817, -34);
const e = new Wert(1.602176634, -19);
const elFeldkonstante = new Wert(8.854187817, -12);
const kb = new Wert(1.380649, -23);

class Faktor {
  constructor(vorFaktor, listeExponenten) {
    this.listeExponenten = listeExponenten;
    this.vorFaktor = vorFaktor;
  }

  alsWert() {
    return new Wert(this.vorFaktor, this.listeExponenten[0])
      .multiplizieren(c.hoch(this.listeExponenten[1]))
      .multiplizieren(hq.hoch(this.listeExponenten[2]))
      .multiplizieren(e.hoch(this.listeExponenten[3]))
      .multiplizieren(elFeldkonstante.hoch(this.listeExponenten[4]))
      .multiplizieren(kb.hoch(this.listeExponenten[5]));
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

class Ergebnis {
  constructor(faktor, summand) {
    this.faktor = faktor;
    this.summand = summand;
    if (
      this.faktor.listeExponenten[0] === 0 &&
      this.faktor.listeExponenten[1] === 0 &&
      this.faktor.listeExponenten[2] === 0 &&
      this.faktor.listeExponenten[3] === 0 &&
      this.faktor.listeExponenten[4] === 0 &&
      this.faktor.listeExponenten[5] === 0
    ) {
      this.faktor = new Faktor(this.faktor.vorFaktor + summand, faktor.listeExponenten);
      this.summand = 0;
    }
  }
  bringeAufRichtigeZehnerPotenz() {
    return new Ergebnis(this.faktor.bringeAufRichtigeZehnerPotenz(), this.summand);
  }
  alsWert() {
    return new Wert (this.faktor.alsWert().alsZahl() + this.summand, 0);
  }
}

class Einheit {
  constructor(id, label) {
    this.id = id;
    if (label !== undefined) {
      this.label = label;
    } else {
      this.label = this.id;
    }
  }
}

class BasisEinheit extends Einheit {
  constructor(faktorIntraDimensional, id, label) {
    super(id, label);
    this.faktorIntraDimensional = faktorIntraDimensional;
  }
  geteVWert(wert) {
    let faktor = wert.alsFaktor();
    return faktor.multiplizieren(this.faktorIntraDimensional);
  }
  getWertVoneV(faktor) {
    return faktor.dividieren(this.faktorIntraDimensional);
  }
  getErgebnisVoneV(faktor) {
    return new Ergebnis(this.getWertVoneV(faktor), 0);
  }
}

class UnterEinheit extends Einheit {
  constructor(basisEinheit, faktorInterDimensional, id, label) {
    super(id, label);
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional;
  }
  geteVWert(wert) {
    return this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional);
  }
  getErgebnisVoneV(faktor) {
    return new Ergebnis(this.basisEinheit.getWertVoneV(faktor).dividieren(this.faktorInterDimensional), 0);
  }
}
class SpecialUnterEinheit extends Einheit {
  constructor(basisEinheit, faktor, id, label, summandAufUnterEinheit, summandAufBasisEinheit) {
    super(id, label);
    this.basisEinheit = basisEinheit;
    this.faktor = faktor;
    this.summandAufUnterEinheit = summandAufUnterEinheit;
    if (summandAufBasisEinheit === undefined) {
      this.summandAufBasisEinheit = summandAufUnterEinheit
    } else {
      this.summandAufBasisEinheit = summandAufBasisEinheit;
    }
  }
  geteVWert(wert) {
    let zahlInBasisEinheit = wert.alsZahl() * this.faktor + this.summandAufBasisEinheit;
    let wertInBasisEinheit = new Wert(zahlInBasisEinheit, 0).bringeAufRichtigeZehnerPotenz();
    return this.basisEinheit.geteVWert(wertInBasisEinheit);
  }
  getErgebnisVoneV(wert) {
    return new Ergebnis(this.basisEinheit.getWertVoneV(wert).dividieren(faktorVonVorFaktor(this.faktor)), -this.summandAufUnterEinheit);
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

function erstelleDimensionUndEinheiten(optionen) {
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
  return new Faktor(1, [zehnerExponent, 0, 0, 0, 0, 0]);
}

function faktorVonVorFaktor(vorFaktor) {
  return new Faktor(vorFaktor, [0, 0, 0, 0, 0, 0]);
}

function getAbgeleitetenFaktor(basisEinheiten, pExponenten) {
  let faktor = new Faktor(1, [0, 0, 0, 0, 0, 0]);
  if (basisEinheiten.length != pExponenten.length) {
    throw new RuntimeException("mitgegebene Basiseinheiten und Exponenten müssen gleich lang sein");
  }
  for (let i = 0; i < basisEinheiten.length; i++) {
    let exponent = pExponenten[i];
    while (exponent < 0) {
      faktor = faktor.dividieren(basisEinheiten[i].faktorIntraDimensional);
      exponent++;
    }
    while (exponent > 0) {
      faktor = faktor.multiplizieren(basisEinheiten[i].faktorIntraDimensional);
      exponent--;
    }
  }
  return faktor;
}

//Natürliche Einheiten
let eV = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0, 0]), "eV");
let keV = new UnterEinheit(eV, new Faktor(1, [3, 0, 0, 0, 0, 0]), "keV");
let MeV = new UnterEinheit(eV, new Faktor(1, [6, 0, 0, 0, 0, 0]), "MeV");
let GeV = new UnterEinheit(eV, new Faktor(1, [9, 0, 0, 0, 0, 0]), "GeV");

let natuerlicheEinheiten = [eV, keV, MeV, GeV];
for (let natuerlicheEinheit of natuerlicheEinheiten) {
  einheiten.set(natuerlicheEinheit.id, natuerlicheEinheit);
}

erstelleDimensionUndEinheiten({
  id: "laenge",
  label: "Länge",
  basisEinheit: {
    id: "m",
    faktor: new Faktor(1, [0, -1, -1, 1, 0, 0]),
  },
  unterEinheiten: [
    { id: "Qm", faktor: faktorVonZehnerExponent(30) },
    { id: "Rm", faktor: faktorVonZehnerExponent(27) },
    { id: "Ym", faktor: faktorVonZehnerExponent(24) },
    { id: "Zm", faktor: faktorVonZehnerExponent(21) },
    { id: "Em", faktor: faktorVonZehnerExponent(18) },
    { id: "Pm", faktor: faktorVonZehnerExponent(15) },
    { id: "Tm", faktor: faktorVonZehnerExponent(12) },
    { id: "Gm", faktor: faktorVonZehnerExponent(9) },
    { id: "Mm", faktor: faktorVonZehnerExponent(6) },
    { id: "km", faktor: faktorVonZehnerExponent(3) },
    { id: "dm", faktor: faktorVonZehnerExponent(-1) },
    { id: "cm", faktor: faktorVonZehnerExponent(-2) },
    { id: "mm", faktor: faktorVonZehnerExponent(-3) },
    { id: "mum", faktor: faktorVonZehnerExponent(-6), label: "µm" },
    { id: "nm", faktor: faktorVonZehnerExponent(-9) },
    { id: "pm", faktor: faktorVonZehnerExponent(-12) },
    { id: "fm", faktor: faktorVonZehnerExponent(-15) },
    { id: "am", faktor: faktorVonZehnerExponent(-18) },
    { id: "zm", faktor: faktorVonZehnerExponent(-21) },
    { id: "ym", faktor: faktorVonZehnerExponent(-24) },
    { id: "rm", faktor: faktorVonZehnerExponent(-27) },
    { id: "qm", faktor: faktorVonZehnerExponent(-30) },
  ],
});
let m = einheiten.get("m");

erstelleDimensionUndEinheiten({
  id: "masse",
  basisEinheit: {
    id: "kg",
    faktor: new Faktor(1, [0, 2, 0, -1, 0, 0]),
  },
  unterEinheiten: [
    { id: "Qg", faktor: faktorVonZehnerExponent(27) },
    { id: "Rg", faktor: faktorVonZehnerExponent(24) },
    { id: "Yg", faktor: faktorVonZehnerExponent(21) },
    { id: "Zg", faktor: faktorVonZehnerExponent(18) },
    { id: "Eg", faktor: faktorVonZehnerExponent(15) },
    { id: "Pg", faktor: faktorVonZehnerExponent(12) },
    { id: "Tg", faktor: faktorVonZehnerExponent(9) },
    { id: "Gg", faktor: faktorVonZehnerExponent(6) },
    { id: "Mg", faktor: faktorVonZehnerExponent(3) },
    { id: "g", faktor: faktorVonZehnerExponent(-3) },
    { id: "dg", faktor: faktorVonZehnerExponent(-4) },
    { id: "cg", faktor: faktorVonZehnerExponent(-5) },
    { id: "mg", faktor: faktorVonZehnerExponent(-6) },
    { id: "mug", faktor: faktorVonZehnerExponent(-9), label: "µg" },
    { id: "ng", faktor: faktorVonZehnerExponent(-12) },
    { id: "pg", faktor: faktorVonZehnerExponent(-15) },
    { id: "fg", faktor: faktorVonZehnerExponent(-18) },
    { id: "ag", faktor: faktorVonZehnerExponent(-21) },
    { id: "zg", faktor: faktorVonZehnerExponent(-24) },
    { id: "yg", faktor: faktorVonZehnerExponent(-27) },
    { id: "rg", faktor: faktorVonZehnerExponent(-30) },
    { id: "qg", faktor: faktorVonZehnerExponent(-33) },
  ],
});

let kg = einheiten.get("kg");

erstelleDimensionUndEinheiten({
  id: "zeit",
  basisEinheit: {
    id: "s",
    faktor: new Faktor(1, [0, 0, -1, 1, 0, 0]),
  },
  unterEinheiten: [
    { id: "a", faktor: faktorVonVorFaktor(31557600) },
    { id: "d", faktor: faktorVonVorFaktor(86400) },
    { id: "h", faktor: faktorVonVorFaktor(3600) },
    { id: "min", faktor: faktorVonVorFaktor(60) },
    { id: "ds", faktor: faktorVonZehnerExponent(-1) },
    { id: "cs", faktor: faktorVonZehnerExponent(-2) },
    { id: "ms", faktor: faktorVonZehnerExponent(-3) },
    { id: "mus", faktor: faktorVonZehnerExponent(-6), label: "µs" },
    { id: "ns", faktor: faktorVonZehnerExponent(-9) },
    { id: "ps", faktor: faktorVonZehnerExponent(-12) },
    { id: "fs", faktor: faktorVonZehnerExponent(-15) },
    { id: "as", faktor: faktorVonZehnerExponent(-18) },
    { id: "zs", faktor: faktorVonZehnerExponent(-21) },
    { id: "ys", faktor: faktorVonZehnerExponent(-24) },
    { id: "rs", faktor: faktorVonZehnerExponent(-27) },
    { id: "qs", faktor: faktorVonZehnerExponent(-30) },
  ],
});
let s = einheiten.get("s");

erstelleDimensionUndEinheiten({
  id: "ladung",
  basisEinheit: {
    id: "C",
    faktor: new Faktor(1, [0, -0.5, -0.5, 0, -0.5, 0]),
  },
  unterEinheiten: [
    { id: "QC", faktor: faktorVonZehnerExponent(30) },
    { id: "RC", faktor: faktorVonZehnerExponent(27) },
    { id: "YC", faktor: faktorVonZehnerExponent(24) },
    { id: "ZC", faktor: faktorVonZehnerExponent(21) },
    { id: "EC", faktor: faktorVonZehnerExponent(18) },
    { id: "PC", faktor: faktorVonZehnerExponent(15) },
    { id: "TC", faktor: faktorVonZehnerExponent(12) },
    { id: "GC", faktor: faktorVonZehnerExponent(9) },
    { id: "MC", faktor: faktorVonZehnerExponent(6) },
    { id: "kC", faktor: faktorVonZehnerExponent(3) },
    { id: "dC", faktor: faktorVonZehnerExponent(-1) },
    { id: "cC", faktor: faktorVonZehnerExponent(-2) },
    { id: "mC", faktor: faktorVonZehnerExponent(-3) },
    { id: "muC", faktor: faktorVonZehnerExponent(-6), label: "µC" },
    { id: "nC", faktor: faktorVonZehnerExponent(-9) },
    { id: "pC", faktor: faktorVonZehnerExponent(-12) },
    { id: "fC", faktor: faktorVonZehnerExponent(-15) },
    { id: "aC", faktor: faktorVonZehnerExponent(-18) },
    { id: "zC", faktor: faktorVonZehnerExponent(-21) },
    { id: "yC", faktor: faktorVonZehnerExponent(-24) },
    { id: "rC", faktor: faktorVonZehnerExponent(-27) },
    { id: "qC", faktor: faktorVonZehnerExponent(-30) },
  ],
});
let C = einheiten.get("C");

erstelleDimensionUndEinheiten({
  id: "spannung",
  basisEinheit: {
    id: "V",
    faktor: new Faktor(1, [0, 0, 0, 0, 0, 0]),
  },
  unterEinheiten: [
    { id: "QV", faktor: faktorVonZehnerExponent(30) },
    { id: "RV", faktor: faktorVonZehnerExponent(27) },
    { id: "YV", faktor: faktorVonZehnerExponent(24) },
    { id: "ZV", faktor: faktorVonZehnerExponent(21) },
    { id: "EV", faktor: faktorVonZehnerExponent(18) },
    { id: "PV", faktor: faktorVonZehnerExponent(15) },
    { id: "TV", faktor: faktorVonZehnerExponent(12) },
    { id: "GV", faktor: faktorVonZehnerExponent(9) },
    { id: "MV", faktor: faktorVonZehnerExponent(6) },
    { id: "kV", faktor: faktorVonZehnerExponent(3) },
    { id: "dV", faktor: faktorVonZehnerExponent(-1) },
    { id: "cV", faktor: faktorVonZehnerExponent(-2) },
    { id: "mV", faktor: faktorVonZehnerExponent(-3) },
    { id: "muV", faktor: faktorVonZehnerExponent(-6), label: "µV" },
    { id: "nV", faktor: faktorVonZehnerExponent(-9) },
    { id: "pV", faktor: faktorVonZehnerExponent(-12) },
    { id: "fV", faktor: faktorVonZehnerExponent(-15) },
    { id: "aV", faktor: faktorVonZehnerExponent(-18) },
    { id: "zV", faktor: faktorVonZehnerExponent(-21) },
    { id: "yV", faktor: faktorVonZehnerExponent(-24) },
    { id: "rV", faktor: faktorVonZehnerExponent(-27) },
    { id: "qV", faktor: faktorVonZehnerExponent(-30) },
  ],
});
let V = einheiten.get("V");
erstelleDimensionUndEinheiten({
  id: "frequenz",
  basisEinheit: {
    id: "Hz",
    faktor: faktorVonVorFaktor(1).dividieren(s.faktorIntraDimensional),
  },
  unterEinheiten: [
    { id: "QHz", faktor: faktorVonZehnerExponent(30) },
    { id: "RHz", faktor: faktorVonZehnerExponent(27) },
    { id: "YHz", faktor: faktorVonZehnerExponent(24) },
    { id: "ZHz", faktor: faktorVonZehnerExponent(21) },
    { id: "EHz", faktor: faktorVonZehnerExponent(18) },
    { id: "PHz", faktor: faktorVonZehnerExponent(15) },
    { id: "THz", faktor: faktorVonZehnerExponent(12) },
    { id: "GHz", faktor: faktorVonZehnerExponent(9) },
    { id: "MHz", faktor: faktorVonZehnerExponent(6) },
    { id: "kHz", faktor: faktorVonZehnerExponent(3) },
    { id: "dHz", faktor: faktorVonZehnerExponent(-1) },
    { id: "cHz", faktor: faktorVonZehnerExponent(-2) },
    { id: "mHz", faktor: faktorVonZehnerExponent(-3) },
    { id: "muHz", faktor: faktorVonZehnerExponent(-6), label: "µHz" },
    { id: "nHz", faktor: faktorVonZehnerExponent(-9) },
    { id: "pHz", faktor: faktorVonZehnerExponent(-12) },
    { id: "fHz", faktor: faktorVonZehnerExponent(-15) },
    { id: "aHz", faktor: faktorVonZehnerExponent(-18) },
    { id: "zHz", faktor: faktorVonZehnerExponent(-21) },
    { id: "yHz", faktor: faktorVonZehnerExponent(-24) },
    { id: "rHz", faktor: faktorVonZehnerExponent(-27) },
    { id: "qHz", faktor: faktorVonZehnerExponent(-30) },
  ],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "geschwindigkeit",
  basisEinheit: {
    id: "mPros",
    faktor: getAbgeleitetenFaktor([m, s], [1, -1]),
    label: "m/s",
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "beschleunigung",
  basisEinheit: {
    id: "mPros2",
    faktor: getAbgeleitetenFaktor([m, s], [1, -2]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "impuls",
  basisEinheit: {
    id: "kgMalmPros",
    label: "kg ⋅ m/s",
    faktor: getAbgeleitetenFaktor([kg, m, s], [1, 1, -1]),
  },
  unterEinheiten: [],
});

erstelleDimensionUndEinheiten({
  id: "kraft",
  basisEinheit: {
    id: "N",
    faktor: getAbgeleitetenFaktor([kg, m, s], [1, 1, -2]),
  },
  unterEinheiten: [
    { id: "QN", faktor: faktorVonZehnerExponent(30) },
    { id: "RN", faktor: faktorVonZehnerExponent(27) },
    { id: "YN", faktor: faktorVonZehnerExponent(24) },
    { id: "ZN", faktor: faktorVonZehnerExponent(21) },
    { id: "EN", faktor: faktorVonZehnerExponent(18) },
    { id: "PN", faktor: faktorVonZehnerExponent(15) },
    { id: "TN", faktor: faktorVonZehnerExponent(12) },
    { id: "GN", faktor: faktorVonZehnerExponent(9) },
    { id: "MN", faktor: faktorVonZehnerExponent(6) },
    { id: "kN", faktor: faktorVonZehnerExponent(3) },
    { id: "dN", faktor: faktorVonZehnerExponent(-1) },
    { id: "cN", faktor: faktorVonZehnerExponent(-2) },
    { id: "mN", faktor: faktorVonZehnerExponent(-3) },
    { id: "muN", faktor: faktorVonZehnerExponent(-6), label: "µN" },
    { id: "nN", faktor: faktorVonZehnerExponent(-9) },
    { id: "pN", faktor: faktorVonZehnerExponent(-12) },
    { id: "fN", faktor: faktorVonZehnerExponent(-15) },
    { id: "aN", faktor: faktorVonZehnerExponent(-18) },
    { id: "zN", faktor: faktorVonZehnerExponent(-21) },
    { id: "yN", faktor: faktorVonZehnerExponent(-24) },
    { id: "rN", faktor: faktorVonZehnerExponent(-27) },
    { id: "qN", faktor: faktorVonZehnerExponent(-30) },
  ],
});

erstelleDimensionUndEinheiten({
  id: "stromstaerke",
  basisEinheit: {
    id: "A",
    faktor: getAbgeleitetenFaktor([C, s], [1, -1]),
  },
  unterEinheiten: [
    { id: "QA", faktor: faktorVonZehnerExponent(30) },
    { id: "RA", faktor: faktorVonZehnerExponent(27) },
    { id: "YA", faktor: faktorVonZehnerExponent(24) },
    { id: "ZA", faktor: faktorVonZehnerExponent(21) },
    { id: "EA", faktor: faktorVonZehnerExponent(18) },
    { id: "PA", faktor: faktorVonZehnerExponent(15) },
    { id: "TA", faktor: faktorVonZehnerExponent(12) },
    { id: "GA", faktor: faktorVonZehnerExponent(9) },
    { id: "MA", faktor: faktorVonZehnerExponent(6) },
    { id: "kA", faktor: faktorVonZehnerExponent(3) },
    { id: "dA", faktor: faktorVonZehnerExponent(-1) },
    { id: "cA", faktor: faktorVonZehnerExponent(-2) },
    { id: "mA", faktor: faktorVonZehnerExponent(-3) },
    { id: "muA", faktor: faktorVonZehnerExponent(-6), label: "µA" },
    { id: "nA", faktor: faktorVonZehnerExponent(-9) },
    { id: "pA", faktor: faktorVonZehnerExponent(-12) },
    { id: "fA", faktor: faktorVonZehnerExponent(-15) },
    { id: "aA", faktor: faktorVonZehnerExponent(-18) },
    { id: "zA", faktor: faktorVonZehnerExponent(-21) },
    { id: "yA", faktor: faktorVonZehnerExponent(-24) },
    { id: "rA", faktor: faktorVonZehnerExponent(-27) },
    { id: "qA", faktor: faktorVonZehnerExponent(-30) },
  ],
});
let A = einheiten.get("A");

erstelleDimensionUndEinheiten({
  id: "leistung",
  basisEinheit: {
    id: "W",
    faktor: getAbgeleitetenFaktor([V, A], [1, 1]),
  },
  unterEinheiten: [
    { id: "QW", faktor: faktorVonZehnerExponent(30) },
    { id: "RW", faktor: faktorVonZehnerExponent(27) },
    { id: "YW", faktor: faktorVonZehnerExponent(24) },
    { id: "ZW", faktor: faktorVonZehnerExponent(21) },
    { id: "EW", faktor: faktorVonZehnerExponent(18) },
    { id: "PW", faktor: faktorVonZehnerExponent(15) },
    { id: "TW", faktor: faktorVonZehnerExponent(12) },
    { id: "GW", faktor: faktorVonZehnerExponent(9) },
    { id: "MW", faktor: faktorVonZehnerExponent(6) },
    { id: "kW", faktor: faktorVonZehnerExponent(3) },
    { id: "dW", faktor: faktorVonZehnerExponent(-1) },
    { id: "cW", faktor: faktorVonZehnerExponent(-2) },
    { id: "mW", faktor: faktorVonZehnerExponent(-3) },
    { id: "muW", faktor: faktorVonZehnerExponent(-6), label: "µW" },
    { id: "nW", faktor: faktorVonZehnerExponent(-9) },
    { id: "pW", faktor: faktorVonZehnerExponent(-12) },
    { id: "fW", faktor: faktorVonZehnerExponent(-15) },
    { id: "aW", faktor: faktorVonZehnerExponent(-18) },
    { id: "zW", faktor: faktorVonZehnerExponent(-21) },
    { id: "yW", faktor: faktorVonZehnerExponent(-24) },
    { id: "rW", faktor: faktorVonZehnerExponent(-27) },
    { id: "qW", faktor: faktorVonZehnerExponent(-30) },
  ],
});

erstelleDimensionUndEinheiten({
  id: "energie",
  basisEinheit: {
    id: "J",
    faktor: getAbgeleitetenFaktor([kg, m, s], [1, 2, -2]),
  },
  unterEinheiten: [
    { id: "QJ", faktor: faktorVonZehnerExponent(30) },
    { id: "RJ", faktor: faktorVonZehnerExponent(27) },
    { id: "YJ", faktor: faktorVonZehnerExponent(24) },
    { id: "ZJ", faktor: faktorVonZehnerExponent(21) },
    { id: "EJ", faktor: faktorVonZehnerExponent(18) },
    { id: "PJ", faktor: faktorVonZehnerExponent(15) },
    { id: "TJ", faktor: faktorVonZehnerExponent(12) },
    { id: "GJ", faktor: faktorVonZehnerExponent(9) },
    { id: "MJ", faktor: faktorVonZehnerExponent(6) },
    { id: "kJ", faktor: faktorVonZehnerExponent(3) },
    { id: "dJ", faktor: faktorVonZehnerExponent(-1) },
    { id: "cJ", faktor: faktorVonZehnerExponent(-2) },
    { id: "mJ", faktor: faktorVonZehnerExponent(-3) },
    { id: "muJ", faktor: faktorVonZehnerExponent(-6), label: "µJ" },
    { id: "nJ", faktor: faktorVonZehnerExponent(-9) },
    { id: "pJ", faktor: faktorVonZehnerExponent(-12) },
    { id: "fJ", faktor: faktorVonZehnerExponent(-15) },
    { id: "aJ", faktor: faktorVonZehnerExponent(-18) },
    { id: "zJ", faktor: faktorVonZehnerExponent(-21) },
    { id: "yJ", faktor: faktorVonZehnerExponent(-24) },
    { id: "rJ", faktor: faktorVonZehnerExponent(-27) },
    { id: "qJ", faktor: faktorVonZehnerExponent(-30) },
  ],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "ladungsdichte",
  basisEinheit: {
    id: "CProm3",
    faktor: getAbgeleitetenFaktor([C, m], [1, -3]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "elektrische stromdichte",
  label: "Elektrische Stromdichte",
  basisEinheit: {
    id: "AProm2",
    faktor: getAbgeleitetenFaktor([A, m], [1, -2]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "elektrische feldstaerke",
  label: "Elektrische Feldstärke",
  basisEinheit: {
    id: "VProm",
    faktor: getAbgeleitetenFaktor([V, m], [1, -1]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "potential",
  basisEinheit: {
    id: "VProm",
    faktor: getAbgeleitetenFaktor([V, m], [1, -1]), //TODO faktor
  },
  unterEinheiten: [],
});

erstelleDimensionUndEinheiten({
  id: "druck",
  basisEinheit: {
    id: "Pa",
    faktor: getAbgeleitetenFaktor([kg, m, s], [1, -1, -1]),
  },
  unterEinheiten: [
    { id: "QPa", faktor: faktorVonZehnerExponent(30) },
    { id: "RPa", faktor: faktorVonZehnerExponent(27) },
    { id: "YPa", faktor: faktorVonZehnerExponent(24) },
    { id: "ZPa", faktor: faktorVonZehnerExponent(21) },
    { id: "EPa", faktor: faktorVonZehnerExponent(18) },
    { id: "PPa", faktor: faktorVonZehnerExponent(15) },
    { id: "TPa", faktor: faktorVonZehnerExponent(12) },
    { id: "GPa", faktor: faktorVonZehnerExponent(9) },
    { id: "MPa", faktor: faktorVonZehnerExponent(6) },
    { id: "kPa", faktor: faktorVonZehnerExponent(3) },
    { id: "dPa", faktor: faktorVonZehnerExponent(-1) },
    { id: "cPa", faktor: faktorVonZehnerExponent(-2) },
    { id: "mPa", faktor: faktorVonZehnerExponent(-3) },
    { id: "muPa", faktor: faktorVonZehnerExponent(-6), label: "µPa" },
    { id: "nPa", faktor: faktorVonZehnerExponent(-9) },
    { id: "pPa", faktor: faktorVonZehnerExponent(-12) },
    { id: "fPa", faktor: faktorVonZehnerExponent(-15) },
    { id: "aPa", faktor: faktorVonZehnerExponent(-18) },
    { id: "zPa", faktor: faktorVonZehnerExponent(-21) },
    { id: "yPa", faktor: faktorVonZehnerExponent(-24) },
    { id: "rPa", faktor: faktorVonZehnerExponent(-27) },
    { id: "qPa", faktor: faktorVonZehnerExponent(-30) },
  ],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "dichte",
  basisEinheit: {
    id: "kgProm3",
    faktor: getAbgeleitetenFaktor([kg, m], [1, -3]),
  },
  unterEinheiten: [],
});

erstelleDimensionUndEinheiten({
  id: "flaeche",
  label: "Fläche",
  basisEinheit: {
    id: "m2",
    faktor: getAbgeleitetenFaktor([m], [2]),
  },
  unterEinheiten: [
    { id: "Qm2", faktor: faktorVonZehnerExponent(30), label: "Qm²" },
    { id: "Rm2", faktor: faktorVonZehnerExponent(27), label: "Rm²" },
    { id: "Ym2", faktor: faktorVonZehnerExponent(24), label: "Ym²" },
    { id: "Zm2", faktor: faktorVonZehnerExponent(21), label: "Zm²" },
    { id: "Em2", faktor: faktorVonZehnerExponent(18), label: "Em²" },
    { id: "Pm2", faktor: faktorVonZehnerExponent(15), label: "Pm²" },
    { id: "Tm2", faktor: faktorVonZehnerExponent(12), label: "Tm²" },
    { id: "Gm2", faktor: faktorVonZehnerExponent(9), label: "Gm²" },
    { id: "Mm2", faktor: faktorVonZehnerExponent(6), label: "Mm²" },
    { id: "km2", faktor: faktorVonZehnerExponent(3), label: "km²" },
    { id: "dm2", faktor: faktorVonZehnerExponent(-1), label: "dm²" },
    { id: "cm2", faktor: faktorVonZehnerExponent(-2), label: "cm²" },
    { id: "mm2", faktor: faktorVonZehnerExponent(-3), label: "mm²" },
    { id: "mum2", faktor: faktorVonZehnerExponent(-6), label: "µm²" },
    { id: "nm2", faktor: faktorVonZehnerExponent(-9), label: "nm²" },
    { id: "pm2", faktor: faktorVonZehnerExponent(-12), label: "pm²" },
    { id: "fm2", faktor: faktorVonZehnerExponent(-15), label: "fm²" },
    { id: "am2", faktor: faktorVonZehnerExponent(-18), label: "am²" },
    { id: "zm2", faktor: faktorVonZehnerExponent(-21), label: "zm²" },
    { id: "ym2", faktor: faktorVonZehnerExponent(-24), label: "ym²" },
    { id: "rm2", faktor: faktorVonZehnerExponent(-27), label: "rm²" },
    { id: "qm2", faktor: faktorVonZehnerExponent(-30), label: "qm²" },
  ],
});

erstelleDimensionUndEinheiten({
  id: "volumen",
  basisEinheit: {
    id: "m3",
    faktor: getAbgeleitetenFaktor([m], [3]),
  },
  unterEinheiten: [
    { id: "Qm3", faktor: faktorVonZehnerExponent(30), label: "Qm³" },
    { id: "Rm3", faktor: faktorVonZehnerExponent(27), label: "Rm³" },
    { id: "Ym3", faktor: faktorVonZehnerExponent(24), label: "Ym³" },
    { id: "Zm3", faktor: faktorVonZehnerExponent(21), label: "Zm³" },
    { id: "Em3", faktor: faktorVonZehnerExponent(18), label: "Em³" },
    { id: "Pm3", faktor: faktorVonZehnerExponent(15), label: "Pm³" },
    { id: "Tm3", faktor: faktorVonZehnerExponent(12), label: "Tm³" },
    { id: "Gm3", faktor: faktorVonZehnerExponent(9), label: "Gm³" },
    { id: "Mm3", faktor: faktorVonZehnerExponent(6), label: "Mm³" },
    { id: "km3", faktor: faktorVonZehnerExponent(3), label: "km³" },
    { id: "dm3", faktor: faktorVonZehnerExponent(-1), label: "dm³" },
    { id: "cm3", faktor: faktorVonZehnerExponent(-2), label: "cm³" },
    { id: "mm3", faktor: faktorVonZehnerExponent(-3), label: "mm³" },
    { id: "mum3", faktor: faktorVonZehnerExponent(-6), label: "µm³" },
    { id: "nm3", faktor: faktorVonZehnerExponent(-9), label: "nm³" },
    { id: "pm3", faktor: faktorVonZehnerExponent(-12), label: "pm³" },
    { id: "fm3", faktor: faktorVonZehnerExponent(-15), label: "fm³" },
    { id: "am3", faktor: faktorVonZehnerExponent(-18), label: "am³" },
    { id: "zm3", faktor: faktorVonZehnerExponent(-21), label: "zm³" },
    { id: "ym3", faktor: faktorVonZehnerExponent(-24), label: "ym³" },
    { id: "rm3", faktor: faktorVonZehnerExponent(-27), label: "rm³" },
    { id: "qm3", faktor: faktorVonZehnerExponent(-30), label: "qm³" },
  ],
});
//TODO
/*erstellenDimensionUndEinheiten({
  id: "temperatur",
  basisEinheit: {
    id: "K",
    faktor: new Faktor(1, [0, 0, 0, -1, 0, 1]),
  },
  unterEinheiten: [

  ],
});
*/
let K = new BasisEinheit(new Faktor(1, [0, 0, 0, -1, 0, 1]), "K")
einheiten.set(K.id, K);
let gradC = new SpecialUnterEinheit(K, 1, "gradC", "°C", 273.15)
einheiten.set( gradC.id, gradC);
let gradF = new SpecialUnterEinheit(K, 0.5555555555, "gradF", "°F", 459.67, 255,372)
einheiten.set( gradF.id, gradF);
let temperatur = new Dimension([K, gradC, gradF], "temperatur");
dimensionen.set(temperatur.id, temperatur);

erstelleDimensionUndEinheiten({
  id: "elektrischer widerstand",
  label: "Elektrischer Widerstand",
  basisEinheit: {
    id: "omega",
    label: "Ω",
    faktor: getAbgeleitetenFaktor([V, A], [1, -1]),
  },
  unterEinheiten: [
    { id: "Qohm", faktor: faktorVonZehnerExponent(30), label: "QΩ" },
    { id: "Rohm", faktor: faktorVonZehnerExponent(27), label: "RΩ" },
    { id: "Yohm", faktor: faktorVonZehnerExponent(24), label: "YΩ" },
    { id: "Zohm", faktor: faktorVonZehnerExponent(21), label: "ZΩ" },
    { id: "Eohm", faktor: faktorVonZehnerExponent(18), label: "EΩ" },
    { id: "Pohm", faktor: faktorVonZehnerExponent(15), label: "PΩ" },
    { id: "Tohm", faktor: faktorVonZehnerExponent(12), label: "TΩ" },
    { id: "Gohm", faktor: faktorVonZehnerExponent(9), label: "GΩ" },
    { id: "Mohm", faktor: faktorVonZehnerExponent(6), label: "MΩ" },
    { id: "kohm", faktor: faktorVonZehnerExponent(3), label: "kΩ" },
    { id: "dohm", faktor: faktorVonZehnerExponent(-1), label: "dΩ" },
    { id: "cohm", faktor: faktorVonZehnerExponent(-2), label: "cΩ" },
    { id: "mohm", faktor: faktorVonZehnerExponent(-3), label: "mΩ" },
    { id: "muohm", faktor: faktorVonZehnerExponent(-6), label: "µΩ" },
    { id: "nohm", faktor: faktorVonZehnerExponent(-9), label: "nΩ" },
    { id: "pohm", faktor: faktorVonZehnerExponent(-12), label: "pΩ" },
    { id: "fohm", faktor: faktorVonZehnerExponent(-15), label: "fΩ" },
    { id: "aohm", faktor: faktorVonZehnerExponent(-18), label: "aΩ" },
    { id: "zohm", faktor: faktorVonZehnerExponent(-21), label: "zΩ" },
    { id: "yohm", faktor: faktorVonZehnerExponent(-24), label: "yΩ" },
    { id: "rohm", faktor: faktorVonZehnerExponent(-27), label: "rΩ" },
    { id: "qohm", faktor: faktorVonZehnerExponent(-30), label: "qΩ" },
  ],
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
  
  faktor.vorFaktor = runden(faktor.vorFaktor, 6)
  let keineKonstanten = true;
  const konstanten = ["c", "ℏ", "e", "ε₀"];
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
  let vorFaktor = runden(gerundetesErgebnis.vorFaktor, 6)
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
  let ergebnis = zielEinheit.getErgebnisVoneV(ausgangsEinheit.geteVWert(ausgangsWert));
  return ergebnis;
}

window.addEventListener("load", function () {
  erstelleOptionenFuerEinheiten();
  erstelleOptionenFuerDimensionen();
});
