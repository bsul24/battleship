import Gameboard from "./Gameboard.js";

export default class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }
}
