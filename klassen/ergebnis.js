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
      return new Wert(this.faktor.alsWert().alsZahl() + this.summand, 0);
    }
  }