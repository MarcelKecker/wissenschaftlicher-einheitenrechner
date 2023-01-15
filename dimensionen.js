
let einheiten = new Map();
let dimensionen = new Map();

function erstelleDimensionUndEinheiten(optionen) {
  let alleEinheitenDieserDimension = [];
  let natuerlicheEinheit = new BasisEinheit(faktorVonVorFaktor(1), optionen.natuerlicheEinheit.id, "Natürliche Einheit (" + optionen.natuerlicheEinheit.label + ")");
  einheiten.set(natuerlicheEinheit.id, natuerlicheEinheit);
  alleEinheitenDieserDimension.push(natuerlicheEinheit);
  let basisEinheit = new BasisEinheit(optionen.basisEinheit.faktor, optionen.basisEinheit.id, optionen.basisEinheit.label);
  alleEinheitenDieserDimension.push(basisEinheit);
  einheiten.set(optionen.basisEinheit.id, basisEinheit);
  for (let unterEinheitOptionen of optionen.unterEinheiten) {
    let unterEinheit = new UnterEinheit(basisEinheit, unterEinheitOptionen.faktor, unterEinheitOptionen.id, unterEinheitOptionen.label);
    alleEinheitenDieserDimension.push(unterEinheit);
    einheiten.set(unterEinheitOptionen.id, unterEinheit);
  }
  let dimension = new Dimension(alleEinheitenDieserDimension, optionen.id, optionen.label, natuerlicheEinheit);
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

erstelleDimensionUndEinheiten({
  id: "laenge",
  label: "Länge",
  natuerlicheEinheit: {
    id: "einsProEV",
    label: "1/eV",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
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
  natuerlicheEinheit: {
    id: "einsProEV",
    label: "1/eV",
  },
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
  natuerlicheEinheit: {
    id: "eins",
    label: "1",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
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
  natuerlicheEinheit: {
    id: "eins",
    label: "1",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
  basisEinheit: {
    id: "mPros2",
    faktor: getAbgeleitetenFaktor([m, s], [1, -2]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "impuls",
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
  basisEinheit: {
    id: "kgMalmPros",
    label: "kg ⋅ m/s",
    faktor: getAbgeleitetenFaktor([kg, m, s], [1, 1, -1]),
  },
  unterEinheiten: [],
});

erstelleDimensionUndEinheiten({
  id: "kraft",
  natuerlicheEinheit: {
    id: "eV2",
    label: "eV²",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
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
  natuerlicheEinheit: {
    id: "eV2",
    label: "eV²",
  },
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
  natuerlicheEinheit: {
    id: "eV",
    label: "eV",
  },
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
    //TODO eV, GeV, ...
  ],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "ladungsdichte",
  natuerlicheEinheit: {
    id: "einsProEV",
    label: "1/eV",
  },
  basisEinheit: {
    id: "CProm3",
    faktor: getAbgeleitetenFaktor([C, m], [1, -3]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "elektrischeStromdichte",
  label: "Elektrische Stromdichte",
  natuerlicheEinheit: {
    id: "eV3",
    label: "eV³",
  },
  basisEinheit: {
    id: "AProm2",
    faktor: getAbgeleitetenFaktor([A, m], [1, -2]),
  },
  unterEinheiten: [],
});
//TODO
erstelleDimensionUndEinheiten({
  id: "elektrischeFeldstaerke",
  label: "Elektrische Feldstärke",
  natuerlicheEinheit: {
    id: "eV2",
    label: "eV²",
  },
  basisEinheit: {
    id: "VProm",
    faktor: getAbgeleitetenFaktor([V, m], [1, -1]),
  },
  unterEinheiten: [],
});
//TODO
/* erstelleDimensionUndEinheiten({
    id: "potential",
    natuerlicheEinheit: {
      id: "eV",
      label: "eV",
    },
    basisEinheit: {
      id: "VProm",
      faktor: getAbgeleitetenFaktor([V, m], [1, -1]), //TODO faktor
    },
    unterEinheiten: [],
  }); */

erstelleDimensionUndEinheiten({
  id: "druck",
  natuerlicheEinheit: {
    id: "eV3",
    label: "eV³",
  },
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
  natuerlicheEinheit: {
    id: "eV4",
    label: "eV⁴",
  },
  basisEinheit: {
    id: "kgProm3",
    faktor: getAbgeleitetenFaktor([kg, m], [1, -3]),
  },
  unterEinheiten: [],
});

erstelleDimensionUndEinheiten({
  id: "flaeche",
  label: "Fläche",
  natuerlicheEinheit: {
    id: "einsProEV2",
    label: "1/eV²",
  },
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
  natuerlicheEinheit: {
    id: "einsProEV3",
    label: "1/eV³",
  },
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
let K = new BasisEinheit(new Faktor(1, [0, 0, 0, -1, 0, 1]), "K");
einheiten.set(K.id, K);
let gradC = new VersetzteUnterEinheit(K, 1, "gradC", "°C", 273.15);
einheiten.set(gradC.id, gradC);
let gradF = new VersetzteUnterEinheit(K, 0.5555555555, "gradF", "°F", 459.67, 255, 372);
einheiten.set(gradF.id, gradF);
let natuerlicheEinheitTemperatur = new BasisEinheit(faktorVonVorFaktor(1), "eV");
einheiten.set(natuerlicheEinheitTemperatur.id, natuerlicheEinheitTemperatur);
let temperatur = new Dimension([K, gradC, gradF, natuerlicheEinheitTemperatur], "temperatur");
dimensionen.set(temperatur.id, temperatur);

erstelleDimensionUndEinheiten({
  id: "elektrischer widerstand",
  label: "Elektrischer Widerstand",
  natuerlicheEinheit: {
    id: "eins",
    label: "1",
  },
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
