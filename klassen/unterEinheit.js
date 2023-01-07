class UnterEinheit extends Einheit {
    constructor(basisEinheit, faktorInterDimensional, id, label) {
      super(id, label);
      this.basisEinheit = basisEinheit;
      this.faktorInterDimensional = faktorInterDimensional;
    }
    getWertInNatuerlicheEinheit(wert) {
      return this.basisEinheit.getWertInNatuerlicheEinheit(wert).multiplizieren(this.faktorInterDimensional);
    }
    getErgebnisVonNatuerlicheEinheit(faktor) {
      return new Ergebnis(this.basisEinheit.getWertVonNatuerlicheEinheit(faktor).dividieren(this.faktorInterDimensional), 0);
    }
  }