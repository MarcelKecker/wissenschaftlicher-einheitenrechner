var ausgangsEinheit;
var zielEinheit;
var ausgangsWert;
var ergebnis;
const c = 3000000000; 
const h = 6.6260693 * Math.pow(10, -34);
const hq = 1.054571817 * Math.pow(10, -34);

class faktor {
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
    return new faktor(neuerVorFaktor, neueListeExponenten);
  }

  dividieren(pFaktor) {
    let neuerVorFaktor = this.vorFaktor / pFaktor.vorFaktor
    let neueListeExponenten = [
      this.listeExponenten[0] - pFaktor.listeExponenten[0],
      this.listeExponenten[1] - pFaktor.listeExponenten[1],
      this.listeExponenten[2] - pFaktor.listeExponenten[2]
    ];
    return new faktor(neuerVorFaktor, neueListeExponenten);
  }
}

class basisEinheit {
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

class unterEinheit {
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
let kg = new basisEinheit(new faktor (1, [-2, 0, 0]));
let g = new unterEinheit(kg, new faktor(Math.pow(10, -3), [0, 0, 0])); 
let mg = new unterEinheit(kg, new faktor(Math.pow(10, -6), [0, 0, 0]));
let mug = new unterEinheit(kg, new faktor(Math.pow(10, -9), [0, 0, 0]));
let ng = new unterEinheit(kg, new faktor(Math.pow(10, -12), [0, 0, 0]));
let pg = new unterEinheit(kg, new faktor(Math.pow(10, -15), [0, 0, 0]));
let ag = new unterEinheit(kg, new faktor(Math.pow(10, -18), [0, 0, 0]));

let hashmap = new Map([
  ['kg', kg],
  ['g', g],
  ['mg', mg],
  ['mug', mug],
  ['ng', ng],
  ['pg', pg],
  ['ag', ag],
  //['neueEinheit', neueEinheit],
]);

function myFunction(typ, button) {
  if (button == "Ausgangseinheit") {
    ausgangsEinheit = typ;
  } else if (button == "Zieleinheit") {
    zielEinheit = typ;
  }
  console.log(ausgangsEinheit + " " + zielEinheit);
}
function verarbeiteSubmitClick() {
  if (ausgangsEinheit == undefined || zielEinheit == undefined || document.getElementById("ausgangsWert").value == '') {
    return;
  }

  ausgangsWert = new faktor(parseInt(document.getElementById("ausgangsWert").value), [0, 0, 0]);
  let ergebnis = berechneErgebnis();
  console.log(ergebnis);
}
function berechneErgebnis() {
  let ausgangsEinheit1 = hashmap.get(ausgangsEinheit)
  let zielEinheit1 = hashmap.get(zielEinheit)
  let ergebnis = zielEinheit1.getWertVoneV(ausgangsEinheit1.geteVWert(ausgangsWert)).getWert(); // getWertvoneV gibt immer 450000000  zurück

  return ergebnis;
}