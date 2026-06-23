import Gameboard from "./Gameboard.js";

export default class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
    this.generatedAttacks = new Set();
    this.targetQueue = [];
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

  getComputerAttack() {
    if (this.generatedAttacks.size >= 100) {
      return null;
    }

    while (this.targetQueue.length > 0) {
      const [row, col] = this.targetQueue.shift();
      const key = Gameboard.coordinateKey(row, col);

      if (!this.generatedAttacks.has(key)) {
        this.generatedAttacks.add(key);
        return [row, col];
      }
    }

    return this.getRandomAttack();
  }

  processAttackResult(coordinate, result) {
    if (result !== "hit") {
      return;
    }

    const [row, col] = coordinate;

    const possibleAdjacentAttacks = [
      [row - 1, col],
      [row, col + 1],
      [row + 1, col],
      [row, col - 1],
    ];

    for (const [attackRow, attackCol] of possibleAdjacentAttacks) {
      if (
        attackRow >= 0 &&
        attackRow <= 9 &&
        attackCol >= 0 &&
        attackCol <= 9 &&
        !this.generatedAttacks.has(
          Gameboard.coordinateKey(attackRow, attackCol),
        )
      ) {
        this.targetQueue.push([attackRow, attackCol]);
      }
    }
  }
}
