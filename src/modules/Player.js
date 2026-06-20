import Gameboard from "./Gameboard.js";

export default class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
    this.generatedAttacks = new Set();
  }

  getRandomAttack() {
    if (this.generatedAttacks.size >= 100) {
      return null;
    }

    while (true) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const key = Gameboard.coordinateKey(row, col);

      if (!this.generatedAttacks.has(key)) {
        this.generatedAttacks.add(key);
        return [row, col];
      }
    }
  }

  generateRandomShips() {
    this.gameboard.placeShipsRandomly();
  }
}
