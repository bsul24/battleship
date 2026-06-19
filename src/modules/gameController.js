import Player from "./Player.js";
import Ship from "./Ship.js";

export default class GameController {
  constructor() {
    this.startNewGame();
  }

  startNewGame() {
    this.currentTurn = "human";
    this.winner = null;
    this.humanPlayer = new Player("human");
    this.computerPlayer = new Player("computer");
    this.placeShips(this.humanPlayer);
    this.placeShips(this.computerPlayer);
  }

  placeShips(player) {
    player.gameboard.placeShip(new Ship(2), [0, 0], "horizontal");
    player.gameboard.placeShip(new Ship(3), [1, 0], "horizontal");
    player.gameboard.placeShip(new Ship(3), [2, 0], "horizontal");
    player.gameboard.placeShip(new Ship(4), [3, 0], "horizontal");
    player.gameboard.placeShip(new Ship(5), [4, 0], "horizontal");
  }

  attackComputer([row, col]) {
    if (this.currentTurn !== "human") {
      return "not-your-turn";
    }
    const attackResult = this.computerPlayer.gameboard.receiveAttack([
      row,
      col,
    ]);
    if (attackResult !== "already-attacked") {
      this.currentTurn = "computer";
    }
    return attackResult;
  }

  attackHuman() {
    if (this.currentTurn !== "computer") {
      return "not-your-turn";
    }

    const attackResult = this.humanPlayer.gameboard.receiveAttack(
      this.computerPlayer.getRandomAttack(),
    );
    this.currentTurn = "human";
    return attackResult;
  }
}
