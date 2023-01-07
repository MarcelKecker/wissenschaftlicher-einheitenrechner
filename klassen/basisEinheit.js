class BasisEinheit extends Einheit {
    constructor(faktorIntraDimensional, id, label) {
      super(id, label);
      this.faktorIntraDimensional = faktorIntraDimensional;
    }
    getWertInNatuerlicheEinheit(wert) {
      let faktor = wert.alsFaktor();
      return faktor.multiplizieren(this.faktorIntraDimensional);
    }
    getWertVonNatuerlicheEinheit(faktor) {
      return faktor.dividieren(this.faktorIntraDimensional);
    }
    getErgebnisVonNatuerlicheEinheit(faktor) {
      return new Ergebnis(this.getWertVonNatuerlicheEinheit(faktor), 0);
    }
  }