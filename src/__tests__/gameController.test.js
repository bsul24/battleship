import GameController from "../modules/gameController.js";
import Player from "../modules/Player.js";
import Gameboard from "../modules/Gameboard.js";

describe("GameController", () => {
  test("starts a new game with a human player", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.humanPlayer).toBeInstanceOf(Player);
    expect(game.humanPlayer.type).toBe("human");
  });

  test("starts a new game with a computer player", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.computerPlayer).toBeInstanceOf(Player);
    expect(game.computerPlayer.type).toBe("computer");
  });

  test("both players have gameboards", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.humanPlayer.gameboard).toBeInstanceOf(Gameboard);
    expect(game.computerPlayer.gameboard).toBeInstanceOf(Gameboard);
  });

  test("human and computer players have separate gameboards", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.humanPlayer.gameboard).not.toBe(game.computerPlayer.gameboard);
  });

  test("places predetermined ships on the human player's board", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.humanPlayer.gameboard.ships).toHaveLength(5);
  });

  test("places predetermined ships on the computer player's board", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.computerPlayer.gameboard.ships).toHaveLength(5);
  });

  test("places the standard ship lengths on the human player's board", () => {
    const game = new GameController();

    game.startNewGame();

    const shipLengths = game.humanPlayer.gameboard.ships
      .map((ship) => ship.length)
      .sort((a, b) => a - b);

    expect(shipLengths).toEqual([2, 3, 3, 4, 5]);
  });

  test("places the standard ship lengths on the computer player's board", () => {
    const game = new GameController();

    game.startNewGame();

    const shipLengths = game.computerPlayer.gameboard.ships
      .map((ship) => ship.length)
      .sort((a, b) => a - b);

    expect(shipLengths).toEqual([2, 3, 3, 4, 5]);
  });

  test("starts with the human player's turn", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.currentTurn).toBe("human");
  });

  test("starts with no winner", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.winner).toBeNull();
  });
});
