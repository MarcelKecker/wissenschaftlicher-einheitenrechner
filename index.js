var ausgangsEinheit;
var zielEinheit;
var ausgangsWert;
var ergebnis;
const c = 3000000000;
const h = 6.6260693 * Math.pow(10, -34);
const hq = 1.054571817 * Math.pow(10, -34);

class Faktor {
  constructor(vorFaktor, listeExponenten) {
    this.listeExponenten = listeExponenten;
    this.vorFaktor = vorFaktor;
  }

  getWert() {
    return this.vorFaktor * Math.pow(c, this.listeExponenten[0]) * Math.pow(h, this.listeExponenten[1]) * Math.pow(hq, this.listeExponenten[2])
  }

  multiplizieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor * pFaktor.vorFaktor
    let neueListeExponenten = [
      this.listeExponenten[0] + pFaktor.listeExponenten[0],
      this.listeExponenten[1] + pFaktor.listeExponenten[1],
      this.listeExponenten[2] + pFaktor.listeExponenten[2]
    ];
    // teilweise kein this.vorFaktor vorhanden (warum?)
    return new Faktor(neuerVorFaktor, neueListeExponenten);
  }

  dividieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor / pFaktor.vorFaktor
    let neueListeExponenten = [
      this.listeExponenten[0] - pFaktor.listeExponenten[0],
      this.listeExponenten[1] - pFaktor.listeExponenten[1],
      this.listeExponenten[2] - pFaktor.listeExponenten[2]
    ];
    return new Faktor(neuerVorFaktor, neueListeExponenten);
  }
}

class BasisEinheit {
  constructor(faktorIntraDimensional) {
    this.faktorIntraDimensional = faktorIntraDimensional;
  }
  geteVWert(wert) {
    console.log("geteVWert basis");
    console.log(wert.multiplizieren(this.faktorIntraDimensional));
    console.log("geteVWert basis ende");
    return wert.multiplizieren(this.faktorIntraDimensional);
  }
  getWertVoneV(wert) {
    console.log("getWertVoneV basis");
    console.log(wert.dividieren(this.faktorIntraDimensional));
    console.log("getWertVoneV basis ende");
    return wert.dividieren(this.faktorIntraDimensional);
  }
}

class UnterEinheit {
  constructor(basisEinheit, faktorInterDimensional) {
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional
  }
  geteVWert(wert) {
    console.log("geteVWert unter");
    console.log(this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional));
    console.log("geteVWert unter ende");
    return this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional);
  }
  getWertVoneV(wert) {
    console.log("getWertVoneV unter");
    console.log(this.basisEinheit.getWertVoneV(wert).dividieren(this.faktorInterDimensional));
    console.log("getWertVoneV unter ende");
    return this.basisEinheit.getWertVoneV(wert).dividieren(this.faktorInterDimensional);
  }
}
// neue Einheit hinzufügen: -> index.html buttons hinzufügen
//let neueEinheit = new unterEinheit(kg, 100);
let kg = new BasisEinheit(new Faktor(1, [-2, 0, 0]));
let g = new UnterEinheit(kg, new Faktor(Math.pow(10, -3), [0, 0, 0]));
let mg = new UnterEinheit(kg, new Faktor(Math.pow(10, -6), [0, 0, 0]));
let mug = new UnterEinheit(kg, new Faktor(Math.pow(10, -9), [0, 0, 0]));
let ng = new UnterEinheit(kg, new Faktor(Math.pow(10, -12), [0, 0, 0]));
let pg = new UnterEinheit(kg, new Faktor(Math.pow(10, -15), [0, 0, 0]));
let ag = new UnterEinheit(kg, new Faktor(Math.pow(10, -18), [0, 0, 0]));
let zg = new UnterEinheit(kg, new Faktor(Math.pow(10, -21), [0, 0, 0]));
let yg = new UnterEinheit(kg, new Faktor(Math.pow(10, -24), [0, 0, 0]));

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

  ausgangsWert = new Faktor(parseInt(document.getElementById("ausgangsWert").value), [0, 0, 0]);
  let ergebnis = berechneErgebnis();
  document.getElementById("endWertAusgabe").textContent = ergebnis;
  console.log(ergebnis);
}
function berechneErgebnis() {
  let ausgangsEinheit1 = hashmap.get(ausgangsEinheit)
  let zielEinheit1 = hashmap.get(zielEinheit)
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert)).getWert(); // getWertvoneV gibt immer 450000000  zurück
  return ergebnis;
}