class Einheit {
    constructor(id, label) {
      this.id = id;
      if (label !== undefined) {
        this.label = label;
      } else {
        this.label = this.id;
      }
    }
  }