export default class Gameboard {
  constructor() {
    this.ships = [];
    this.shipLocations = new Map();
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
}
