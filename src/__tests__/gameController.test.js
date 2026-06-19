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

  describe("human attacks", () => {
    test("human attack targets the computer player's board", () => {
      const game = new GameController();

      game.startNewGame();

      const result = game.attackComputer([0, 0]);

      expect(result).toBe("hit");
      expect(game.computerPlayer.gameboard.getShipAt([0, 0]).hits).toBe(1);
    });

    test("human attack can miss the computer player's board", () => {
      const game = new GameController();

      game.startNewGame();

      const result = game.attackComputer([9, 9]);

      expect(result).toBe("miss");
      expect(
        game.computerPlayer.gameboard.missedAttacks.has(
          Gameboard.coordinateKey(9, 9),
        ),
      ).toBe(true);
    });

    test("human attack does not target the human player's own board", () => {
      const game = new GameController();

      game.startNewGame();

      game.attackComputer([0, 0]);

      expect(game.humanPlayer.gameboard.getShipAt([0, 0]).hits).toBe(0);
    });

    test("does not allow the human player to attack the same coordinate twice", () => {
      const game = new GameController();

      game.startNewGame();

      game.attackComputer([0, 0]);
      game.currentTurn = "human";
      const result = game.attackComputer([0, 0]);

      expect(result).toBe("already-attacked");
      expect(game.computerPlayer.gameboard.getShipAt([0, 0]).hits).toBe(1);
    });

    test("switches to the computer turn after a valid human attack", () => {
      const game = new GameController();

      game.startNewGame();

      game.attackComputer([0, 0]);

      expect(game.currentTurn).toBe("computer");
    });

    test("does not switch turns after a duplicate human attack", () => {
      const game = new GameController();

      game.startNewGame();

      game.attackComputer([0, 0]);
      game.currentTurn = "human";

      game.attackComputer([0, 0]);

      expect(game.currentTurn).toBe("human");
    });

    test("does not allow the human player to attack when it is not their turn", () => {
      const game = new GameController();

      game.startNewGame();
      game.currentTurn = "computer";

      const result = game.attackComputer([0, 0]);

      expect(result).toBe("not-your-turn");
      expect(game.computerPlayer.gameboard.getShipAt([0, 0]).hits).toBe(0);
    });
  });

  describe("computer attacks", () => {
    test("computer attack targets the human player's board", () => {
      const game = new GameController();

      game.currentTurn = "computer";

      game.attackHuman();

      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(1);
    });

    test("computer attack returns hit or miss", () => {
      const game = new GameController();

      game.currentTurn = "computer";

      const result = game.attackHuman();

      expect(["hit", "miss"]).toContain(result);
    });

    test("computer attack switches the turn back to human", () => {
      const game = new GameController();

      game.currentTurn = "computer";

      game.attackHuman();

      expect(game.currentTurn).toBe("human");
    });

    test("does not allow the computer to attack when it is not the computer's turn", () => {
      const game = new GameController();

      game.currentTurn = "human";

      const result = game.attackHuman();

      expect(result).toBe("not-your-turn");
      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(0);
    });

    test("computer attack does not target the computer player's own board", () => {
      const game = new GameController();

      game.currentTurn = "computer";

      game.attackHuman();

      expect(game.computerPlayer.gameboard.attackedCoordinates.size).toBe(0);
    });

    test("computer can make multiple attacks without repeating coordinates", () => {
      const game = new GameController();

      game.currentTurn = "computer";
      game.attackHuman();

      game.currentTurn = "computer";
      game.attackHuman();

      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(2);
    });
  });
});
