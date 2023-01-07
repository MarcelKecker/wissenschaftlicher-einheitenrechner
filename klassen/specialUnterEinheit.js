class SpecialUnterEinheit extends Einheit {
    constructor(basisEinheit, faktor, id, label, summandAufUnterEinheit, summandAufBasisEinheit) {
      super(id, label);
      this.basisEinheit = basisEinheit;
      this.faktor = faktor;
      this.summandAufUnterEinheit = summandAufUnterEinheit;
      if (summandAufBasisEinheit === undefined) {
        this.summandAufBasisEinheit = summandAufUnterEinheit;
      } else {
        this.summandAufBasisEinheit = summandAufBasisEinheit;
      }
    }
    getWertInNatuerlicheEinheit(wert) {
      let zahlInBasisEinheit = wert.alsZahl() * this.faktor + this.summandAufBasisEinheit;
      let wertInBasisEinheit = new Wert(zahlInBasisEinheit, 0).bringeAufRichtigeZehnerPotenz();
      return this.basisEinheit.getWertInNatuerlicheEinheit(wertInBasisEinheit);
    }
    getErgebnisVonNatuerlicheEinheit(wert) {
      return new Ergebnis(this.basisEinheit.getWertVonNatuerlicheEinheit(wert).dividieren(faktorVonVorFaktor(this.faktor)), -this.summandAufUnterEinheit);
    }
  }