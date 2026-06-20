import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.ships = [];
    this.shipLocations = new Map();
    this.missedAttacks = new Set();
    this.attackedCoordinates = new Set();
  }

  placeShip(ship, coordinates, orientation) {
    if (
      Gameboard.isOutOfBounds(coordinates, orientation, ship.length) ||
      this.isOverlapping(coordinates, orientation, ship.length)
    ) {
      return false;
    }

    this.ships.push(ship);
    const [row, col] = coordinates;

    if (orientation === "horizontal") {
      for (let i = col; i < col + ship.length; i++) {
        this.shipLocations.set(Gameboard.coordinateKey(row, i), ship);
      }
    } else {
      for (let i = row; i < row + ship.length; i++) {
        this.shipLocations.set(Gameboard.coordinateKey(i, col), ship);
      }
    }

    return true;
  }

  clearShips() {
    this.ships = [];
    this.shipLocations.clear();
    this.missedAttacks.clear();
    this.attackedCoordinates.clear();
  }

  placeShipsRandomly() {
    this.clearShips();

    const shipLengths = [2, 3, 3, 4, 5];

    for (const val of shipLengths) {
      while (true) {
        const ship = new Ship(val);
        const coordinates = this.generateRandomCoordinates();
        const orientation =
          Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";
        if (this.placeShip(ship, coordinates, orientation)) {
          break;
        }
      }
    }
  }

  generateRandomCoordinates() {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return [row, col];
  }

  getShipAt([row, col]) {
    return this.shipLocations.get(Gameboard.coordinateKey(row, col));
  }

  static coordinateKey(row, col) {
    return `${row},${col}`;
  }

  static isOutOfBounds([row, col], orientation, length) {
    if (!(row >= 0 && row <= 9 && col >= 0 && col <= 9)) {
      return true;
    }

    if (orientation === "horizontal") {
      if (col + length - 1 > 9) {
        return true;
      }
    } else {
      if (row + length - 1 > 9) {
        return true;
      }
    }

    return false;
  }

  isOverlapping([row, col], orientation, length) {
    if (orientation === "horizontal") {
      for (let i = col; i < col + length; i++) {
        if (this.shipLocations.has(Gameboard.coordinateKey(row, i))) {
          return true;
        }
      }
    } else {
      for (let i = row; i < row + length; i++) {
        if (this.shipLocations.has(Gameboard.coordinateKey(i, col))) {
          return true;
        }
      }
    }

    return false;
  }

  receiveAttack([row, col]) {
    const key = Gameboard.coordinateKey(row, col);

    if (this.attackedCoordinates.has(key)) {
      return "already-attacked";
    }

    this.attackedCoordinates.add(key);

    if (this.shipLocations.has(key)) {
      this.getShipAt([row, col]).hit();
      return "hit";
    } else {
      this.missedAttacks.add(key);
      return "miss";
    }
  }

  allShipsSunk() {
    if (this.ships.length === 0) {
      return false;
    }

    return this.ships.every((ship) => ship.isSunk());
  }

  getCellStatus([row, col], revealShips) {
    const key = Gameboard.coordinateKey(row, col);
    if (this.attackedCoordinates.has(key)) {
      if (this.missedAttacks.has(key)) {
        return "miss";
      } else {
        return "hit";
      }
    }

    if (this.shipLocations.has(key)) {
      return revealShips ? "ship" : "hidden";
    }

    return "empty";
  }
}
