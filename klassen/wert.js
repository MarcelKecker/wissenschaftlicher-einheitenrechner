class Wert {
    constructor(vorFaktor, zehnerExponent) {
      this.vorFaktor = vorFaktor;
      this.zehnerExponent = zehnerExponent;
    }
    hoch(exponent) {
      return new Wert(Math.pow(this.vorFaktor, exponent), this.zehnerExponent * exponent);
    }
    multiplizieren(pWert) {
      return new Wert(this.vorFaktor * pWert.vorFaktor, this.zehnerExponent + pWert.zehnerExponent);
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