var ausgangsEinheit;
var zielEinheit;
var ausgangsWert;
var ergebnis;
const c = 299792458;
const h = 6.6260693 * Math.pow(10, -34);
const hq = 1.054571817 * Math.pow(10, -34);
const e = 1.602176634 * Math.pow(10, -19);

class Faktor {
  constructor(vorFaktor, listeExponenten) {
    this.listeExponenten = listeExponenten;
    this.vorFaktor = vorFaktor;
  }

  getWertOhneZehnerPotenz() {
    return this.vorFaktor * 
    Math.pow(c, this.listeExponenten[1]) * 
    Math.pow(h, this.listeExponenten[2]) * 
    Math.pow(hq, this.listeExponenten[3]) * 
    Math.pow(e, this.listeExponenten[4])
  }

  multiplizieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor * pFaktor.vorFaktor;
    //console.log("multi: vor1 ", this.vorFaktor, " vor2 ", pFaktor.vorFaktor, " neu ", neuerVorFaktor);
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
    //console.log("divi: vor1 ", this.vorFaktor, " vor2 ", pFaktor.vorFaktor, " neu ", neuerVorFaktor);
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
    for (;this.vorFaktor >= 10; this.listeExponenten[0]++) {
      this.vorFaktor = this.vorFaktor / 10;
    }
    for (;this.vorFaktor < 1; this.listeExponenten[0]--) {
      this.vorFaktor = this.vorFaktor * 10;
    }
  }
}

class BasisEinheit {
  constructor(faktorIntraDimensional) {
    this.faktorIntraDimensional = faktorIntraDimensional;
  }
  geteVWert(wert) {
    //console.log("basis eV Wert")
    return wert.multiplizieren(this.faktorIntraDimensional);
  }
  getWertVoneV(wert) {
    //console.log("basis von eV Wert")
    return wert.dividieren(this.faktorIntraDimensional);
  }
}

class UnterEinheit {
  constructor(basisEinheit, faktorInterDimensional) {
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional
    //console.log("faktorInterDimensional vorfaktor: ", this.faktorInterDimensional.vorFaktor)
  }
  geteVWert(wert) {
    //console.log("unter eV Wert")
    //console.log("faktorInterDimensional vorfaktor: ", this.faktorInterDimensional.vorFaktor)
    return this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional);
  }
  getWertVoneV(wert) {
    //console.log("unter von eV Wert")
    //console.log("faktorInterDimensional vorfaktor: ", this.faktorInterDimensional.vorFaktor)
    return this.basisEinheit.getWertVoneV(wert).dividieren(this.faktorInterDimensional);
  }
}

// neue Einheit hinzufügen: -> index.html buttons hinzufügen
//let neueEinheit = new unterEinheit(kg, 100);
let kg = new BasisEinheit(new Faktor(1, [0, 2, 0, 0, -1]));
let g = new UnterEinheit(kg, new Faktor(1, [-3, 0, 0, 0, 0]));
let mg = new UnterEinheit(kg, new Faktor(1, [-6, 0, 0, 0, 0]));
let mug = new UnterEinheit(kg, new Faktor(1, [-9, 0, 0, 0, 0]));
let ng = new UnterEinheit(kg, new Faktor(1, [-12, 0, 0, 0, 0]));
let pg = new UnterEinheit(kg, new Faktor(1, [-15, 0, 0, 0, 0]));
let ag = new UnterEinheit(kg, new Faktor(1, [-18, 0, 0, 0, 0]));
let zg = new UnterEinheit(kg, new Faktor(1, [-21, 0, 0, 0, 0]));
let yg = new UnterEinheit(kg, new Faktor(1, [-24, 0, 0, 0, 0]));

let s = new BasisEinheit(new Faktor(1, [0, 0, 0, -1, 1]))
let ps = new UnterEinheit(s, new Faktor(1, [-12, 0, 0, 0, 0]))
let as = new UnterEinheit(s, new Faktor(1, [-15, 0, 0, 0, 0]));

let eV = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]))
let KeV = new UnterEinheit(eV, new Faktor(1, [3, 0, 0, 0, 0]))
let MeV = new UnterEinheit(eV, new Faktor(1, [6, 0, 0, 0, 0]))
let GeV = new UnterEinheit(eV, new Faktor(1, [9, 0, 0, 0, 0]))

let hashmap = new Map([
  ['kg', kg],
  ['g', g],
  ['mg', mg],
  ['mug', mug],
  ['ng', ng],
  ['pg', pg],
  ['ag', ag],
  ['zg', zg],
  ['yg', yg],
  ['s', s],
  ['ps', ps],
  ['as', as],
  ['eV', eV],
  ['KeV', KeV],
  ['MeV', MeV],
  ['GeV', GeV],
  //['', ],
  //['neueEinheit', neueEinheit],
]);

function setAusgangseinheit(einheit) {
  ausgangsEinheit = einheit;
  document.getElementById("buttonAusgangseinheit").textContent = einheit;
  console.log("Ausgangseinheit: ", ausgangsEinheit);
}

function setZieleinheit(einheit) {
  zielEinheit = einheit;
  document.getElementById("buttonZieleinheit").textContent = einheit;
  console.log("Zieleinheit: ", zielEinheit);
}
function verarbeiteSubmitClick() {
  if (ausgangsEinheit == undefined || zielEinheit == undefined || document.getElementById("ausgangsWert").value == '') {
    return;
  }

  ausgangsWert = new Faktor(parseInt(document.getElementById("ausgangsWert").value), [0, 0, 0, 0, 0]);
  while (ausgangsWert.vorFaktor >= 10) {
    ausgangsWert.vorFaktor = ausgangsWert.vorFaktor / 10;
    ausgangsWert.listeExponenten[0] += 1;
  }
  let ergebnis = berechneErgebnis();
  console.log("was ist ergebnis " + ergebnis)
  let ergebnisOhneZehnerPotenz = new Faktor(ergebnis.getWertOhneZehnerPotenz(), [0, 0, 0, 0, 0]);
  ergebnisOhneZehnerPotenz.bringeAufRichtigeZehnerPotenz();
  let ausgabeVorFaktor = ergebnisOhneZehnerPotenz.vorFaktor;
  let ausgabe10Exponent = ergebnis.listeExponenten[0] + ergebnisOhneZehnerPotenz.listeExponenten[0];
  if (ergebnis.listeExponenten[0] + ergebnisOhneZehnerPotenz.listeExponenten[0]== 0) {
    ausgabe10Exponent = ''
  }
  document.getElementById("endWertAusgabe").textContent = ausgabeVorFaktor + " * 10^" + ausgabe10Exponent;
}
function berechneErgebnis() {
  let ausgangsEinheit1 = hashmap.get(ausgangsEinheit)
  let zielEinheit1 = hashmap.get(zielEinheit)
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert));
  //console.log("listeExponenten ergebnis", zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert)).listeExponenten);
  return ergebnis;
}