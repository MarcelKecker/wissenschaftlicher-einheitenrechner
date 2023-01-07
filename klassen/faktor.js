class Faktor {
    constructor(vorFaktor, listeExponenten) {
      this.listeExponenten = listeExponenten;
      this.vorFaktor = vorFaktor;
    }
  
    alsWert() {
      return new Wert(this.vorFaktor, this.listeExponenten[0])
        .multiplizieren(c.hoch(this.listeExponenten[1]))
        .multiplizieren(hq.hoch(this.listeExponenten[2]))
        .multiplizieren(e.hoch(this.listeExponenten[3]))
        .multiplizieren(elFeldkonstante.hoch(this.listeExponenten[4]))
        .multiplizieren(kb.hoch(this.listeExponenten[5]));
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
      let wert = bringeAufRichtigeZehnerPotenz(this.vorFaktor, this.listeExponenten[0]);
      let neueListeExponenten = [...this.listeExponenten];
      neueListeExponenten[0] = wert.zehnerExponent;
      return new Faktor(wert.vorFaktor, neueListeExponenten);
    }
  }