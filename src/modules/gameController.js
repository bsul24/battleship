import Player from "./Player.js";

export default class GameController {
  constructor() {
    this.startNewGame();
  }

  startNewGame() {
    this.currentTurn = "human";
    this.winner = null;
    this.gameStarted = false;
    this.humanPlayer = new Player("human");
    this.computerPlayer = new Player("computer");
    this.placeShipsRandomly(this.humanPlayer);
    this.placeShipsRandomly(this.computerPlayer);
  }

  placeShipsRandomly(player) {
    player.generateRandomShips();
  }

  attackComputer([row, col]) {
    if (this.winner) {
      return "game-over";
    }

    if (this.currentTurn !== "human") {
      return "not-your-turn";
    }

    this.gameStarted = true;

    const attackResult = this.computerPlayer.gameboard.receiveAttack([
      row,
      col,
    ]);
    if (this.computerPlayer.gameboard.allShipsSunk()) {
      this.winner = "human";
    } else {
      if (attackResult !== "already-attacked") {
        this.currentTurn = "computer";
      }
    }
    return attackResult;
  }

  attackHuman() {
    if (this.winner) {
      return "game-over";
    }

    if (this.currentTurn !== "computer") {
      return "not-your-turn";
    }

    const attackResult = this.humanPlayer.gameboard.receiveAttack(
      this.computerPlayer.getRandomAttack(),
    );
    if (this.humanPlayer.gameboard.allShipsSunk()) {
      this.winner = "computer";
    } else {
      this.currentTurn = "human";
    }
    return attackResult;
  }

  randomizeHumanFleet() {
    if (this.gameStarted) {
      return false;
    }
    this.placeShipsRandomly(this.humanPlayer);
    return true;
  }
}
