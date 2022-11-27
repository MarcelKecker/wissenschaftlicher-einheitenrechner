var ausgangsEinheit;
var zielEinheit;
var ausgangsWert;
var ergebnis;
const c = 299792458;
const hq = 6.6260693 * Math.pow(10, -34);
const e = 1.602176634 * Math.pow(10, -19);
const elFeldkonstante = 8.854187817 * Math.pow(10, -12);

class Faktor {
  constructor(vorFaktor, listeExponenten) {
    this.listeExponenten = listeExponenten;
    this.vorFaktor = vorFaktor;
  }

  getWertOhneZehnerPotenz() {
    return this.vorFaktor * 
    Math.pow(c, this.listeExponenten[1]) * 
    Math.pow(hq, this.listeExponenten[2]) * 
    Math.pow(e, this.listeExponenten[3]) *
    Math.pow(elFeldkonstante, this.listeExponenten[4])
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
    for (;this.vorFaktor >= 10; this.listeExponenten[0]++) {
      this.vorFaktor = this.vorFaktor / 10;
    }
    for (;this.vorFaktor < 1 && this.vorFaktor > 0; this.listeExponenten[0]--) {
      this.vorFaktor = this.vorFaktor * 10;
    }
  }
}

class BasisEinheit {
  constructor(faktorIntraDimensional) {
    this.faktorIntraDimensional = faktorIntraDimensional;
  }
  geteVWert(wert) {
    return wert.multiplizieren(this.faktorIntraDimensional);
  }
  getWertVoneV(wert) {
    return wert.dividieren(this.faktorIntraDimensional);
  }
}

class UnterEinheit {
  constructor(basisEinheit, faktorInterDimensional) {
    this.basisEinheit = basisEinheit;
    this.faktorInterDimensional = faktorInterDimensional
  }
  geteVWert(wert) {
    return this.basisEinheit.geteVWert(wert).multiplizieren(this.faktorInterDimensional);
  }
  getWertVoneV(wert) {
    return this.basisEinheit.getWertVoneV(wert).dividieren(this.faktorInterDimensional);
  }
}

class abgeleiteteEinheit {
  constructor(listeEinheitenZaehler, listeEinheitenNenner) {
    this.faktorIntraDimensional = 1;
    for (let i = 0; i < listeEinheitenZaehler.length; i++) {
      this.faktorIntraDimensional = this.faktorIntraDimensional.multiplizieren(listeEinheitenZaehler[i])
    }
    for (let i = 0; i < listeEinheitenNenner.length; i++) {
      this.faktorIntraDimensional = this.faktorIntraDimensional.dividieren(listeEinheitenNenner[i])
    }
    //this = new BasisEinheit(this.faktorIntraDimensional);
  }
}

// neue Einheit hinzufügen: -> index.html buttons hinzufügen
//


//Länge
let m = new BasisEinheit(new Faktor(1, [0, -1, -1, 1, 0]))

//Masse
let kg = new BasisEinheit(new Faktor(1, [0, 2, 0, -1, 0]));
let g = new UnterEinheit(kg, new Faktor(1, [-3, 0, 0, 0, 0]));
let mg = new UnterEinheit(kg, new Faktor(1, [-6, 0, 0, 0, 0]));
let mug = new UnterEinheit(kg, new Faktor(1, [-9, 0, 0, 0, 0]));
let ng = new UnterEinheit(kg, new Faktor(1, [-12, 0, 0, 0, 0]));
let pg = new UnterEinheit(kg, new Faktor(1, [-15, 0, 0, 0, 0]));
let ag = new UnterEinheit(kg, new Faktor(1, [-18, 0, 0, 0, 0]));
let zg = new UnterEinheit(kg, new Faktor(1, [-21, 0, 0, 0, 0]));
let yg = new UnterEinheit(kg, new Faktor(1, [-24, 0, 0, 0, 0]));

//Zeit
let s = new BasisEinheit(new Faktor(1, [0, 0, -1, 1, 0]))
let ps = new UnterEinheit(s, new Faktor(1, [-12, 0, 0, 0, 0]))
let as = new UnterEinheit(s, new Faktor(1, [-15, 0, 0, 0, 0]));

//Frequenz
let f = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]).dividieren(s.faktorIntraDimensional))

//Geschwindigkeit
let mPros  = new BasisEinheit(m.faktorIntraDimensional.dividieren(s.faktorIntraDimensional));

//Beschleunigung
let mPros2  = new BasisEinheit();

//Impuls
let kgMalmPros = new BasisEinheit((kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional)).dividieren(s.faktorIntraDimensional));

//Kraft
let N = new BasisEinheit((kg.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional)).dividieren((s.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional))));

//Spannung
let V = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]));

//Stromstärke
//TODO richtiger Faktor
let A = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]));

//Leistung
let W = new BasisEinheit(V.faktorIntraDimensional.multiplizieren(A.faktorIntraDimensional));

//Energie
let J = new BasisEinheit();

//Ladung
let C = new BasisEinheit(A.faktorIntraDimensional.multiplizieren(s.faktorIntraDimensional));

//Ladungsdichte
let CProm3 = new BasisEinheit(C.faktorIntraDimensional.multiplizieren((m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional.multiplizieren(m.faktorIntraDimensional)))))

//Stromdichte

//Elektrische Feldstärke

//Potenzial

//Druck
let Pa  = new BasisEinheit();

//Dichte



//Fläche

//Volumen

//Temperatur
let K = new BasisEinheit(kg.faktorIntraDimensional.multiplizieren(new Faktor(1, [0, 0, 0, -1, 0])))

//Natürliche Einheiten
let eV = new BasisEinheit(new Faktor(1, [0, 0, 0, 0, 0]))
let keV = new UnterEinheit(eV, new Faktor(1, [3, 0, 0, 0, 0]))
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
  ['keV', keV],
  ['MeV', MeV],
  ['GeV', GeV],

  ['m', m],

  ['K', K],

  ['kgMalmPros', kgMalmPros],

  ['mPros', mPros],
  //['', ],
  //['neueEinheit', neueEinheit],
]);

function setAusgangseinheit(einheit) {
  ausgangsEinheit = einheit;
  if (ausgangsEinheit == "kgMalmPros") {
    einheit = "kg ⋅ m/s"
  }
  if (ausgangsEinheit == "mPros") {
    einheit = "m/s"
  }
  document.getElementById("buttonAusgangseinheit").textContent = einheit;
}

function setZieleinheit(einheit) {
  zielEinheit = einheit;
  if (zielEinheit == "kgMalmPros") {
    einheit = "kg ⋅ m/s"
  }
  if (zielEinheit == "mPros") {
    einheit = "m/s"
  }
  document.getElementById("buttonZieleinheit").textContent = einheit;
}
function verarbeiteSubmitClick() {
  if (ausgangsEinheit == undefined || zielEinheit == undefined || document.getElementById("ausgangsWert").value == '') {
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
  let ergebnisOhneZehnerPotenz = new Faktor(ergebnis.getWertOhneZehnerPotenz(), [0, 0, 0, 0, 0]);
  ergebnisOhneZehnerPotenz.bringeAufRichtigeZehnerPotenz();
  let ausgabeVorFaktor = ergebnisOhneZehnerPotenz.vorFaktor;
  let zehnerExponent = ergebnis.listeExponenten[0] + ergebnisOhneZehnerPotenz.listeExponenten[0];
  let ausgabe10Exponent = " * 10^" + zehnerExponent
  if (zehnerExponent== 0) {
    ausgabe10Exponent = ''
  } else if (zehnerExponent <= 3 && zehnerExponent >= 1) {
    ausgabe10Exponent = ''
    ausgabeVorFaktor = ausgabeVorFaktor * Math.pow(10, zehnerExponent);
  }
  if (ausgabeVorFaktor == 1) {
    if (ausgabe10Exponent == "") {
      ausgabeVorFaktor = 1;
    } else {
      ausgabeVorFaktor = "";
      ausgabe10Exponent = ausgabe10Exponent.replace(" * ", "")
    }
  }
  if (ausgabeVorFaktor == 0) {
    ausgabe10Exponent = ""

  }
  document.getElementById("endWertAusgabeWert").textContent = ausgabeVorFaktor + ausgabe10Exponent;
  ergebnis.bringeAufRichtigeZehnerPotenz();
  let konstAusgabe = "";
  if (ergebnis.listeExponenten[0] <= 3 && ergebnis.listeExponenten[0] >= 1) {
    ergebnis.vorFaktor = ergebnis.vorFaktor * Math.pow(10, ergebnis.listeExponenten[0])
  } else if (ergebnis.listeExponenten[0] !== 0) {
    konstAusgabe += " * 10^" + ergebnis.listeExponenten[0]
  } 
  if (ergebnis.listeExponenten[1] == 1) {
    konstAusgabe += " * c"
  } else if (ergebnis.listeExponenten[1] !== 0) {
    konstAusgabe += " * c^" + ergebnis.listeExponenten[1] 
  } 
  if (ergebnis.listeExponenten[2] == 1) {
    konstAusgabe += " * hq"
  } else if (ergebnis.listeExponenten[2] !== 0) {
    konstAusgabe +=  " * hq^" + ergebnis.listeExponenten[2] 
  } 
  if (ergebnis.listeExponenten[3] == 1) {
    konstAusgabe += " * e"
  } else if (ergebnis.listeExponenten[3] !== 0) {
    konstAusgabe += " * e^" + ergebnis.listeExponenten[3];
  } 
  if (ergebnis.vorFaktor == 1) {
    konstAusgabe = konstAusgabe.replace(" * ", "")
  } else {
    konstAusgabe = ergebnis.vorFaktor + "" + konstAusgabe
  }
  if (konstAusgabe == ausgabeVorFaktor + ausgabe10Exponent) {
    document.getElementById("endWertAusgabeKonstanten").textContent = ""
    return;
  }
  document.getElementById("endWertAusgabeKonstanten").textContent = konstAusgabe;
}

function berechneErgebnis() {
  let ausgangsEinheit1 = hashmap.get(ausgangsEinheit)
  let zielEinheit1 = hashmap.get(zielEinheit)
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