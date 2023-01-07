class Dimension {
    constructor(listeEinheiten, id, label, natuerlicheEinheit) {
      this.listeEinheiten = listeEinheiten;
      this.id = id;
      this.natuerlicheEinheit = natuerlicheEinheit;
      if (label !== undefined) {
        this.label = label;
      } else {
        this.label = capitalizeFirstLetter(this.id);
      }
    }
  }