import GameController from "../modules/gameController.js";
import Player from "../modules/Player.js";
import Gameboard from "../modules/Gameboard.js";

function getOccupiedCoordinate(gameboard) {
  const key = gameboard.shipLocations.keys().next().value;
  return key.split(",").map(Number);
}

function getEmptyCoordinate(gameboard) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const key = Gameboard.coordinateKey(row, col);

      if (!gameboard.shipLocations.has(key)) {
        return [row, col];
      }
    }
  }

  return null;
}

function getUnattackedCoordinate(gameboard) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const key = Gameboard.coordinateKey(row, col);

      if (!gameboard.attackedCoordinates.has(key)) {
        return [row, col];
      }
    }
  }

  return null;
}

function getShipCoordinates(gameboard, targetShip) {
  return [...gameboard.shipLocations.entries()]
    .filter(([, ship]) => ship === targetShip)
    .map(([key]) => key.split(",").map(Number));
}

function getAllShipCoordinates(gameboard) {
  return [...gameboard.shipLocations.keys()].map((key) =>
    key.split(",").map(Number),
  );
}

function getTotalHits(gameboard) {
  return gameboard.ships.reduce((total, ship) => total + ship.hits, 0);
}

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

  test("places ships on the human player's board", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.humanPlayer.gameboard.ships).toHaveLength(5);
    expect(game.humanPlayer.gameboard.shipLocations.size).toBe(17);
  });

  test("places ships on the computer player's board", () => {
    const game = new GameController();

    game.startNewGame();

    expect(game.computerPlayer.gameboard.ships).toHaveLength(5);
    expect(game.computerPlayer.gameboard.shipLocations.size).toBe(17);
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
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);
      const ship = game.computerPlayer.gameboard.getShipAt(coordinate);

      const result = game.attackComputer(coordinate);

      expect(result).toBe("hit");
      expect(ship.hits).toBe(1);
    });

    test("human attack can miss the computer player's board", () => {
      const game = new GameController();
      const coordinate = getEmptyCoordinate(game.computerPlayer.gameboard);
      const key = Gameboard.coordinateKey(...coordinate);

      const result = game.attackComputer(coordinate);

      expect(result).toBe("miss");
      expect(game.computerPlayer.gameboard.missedAttacks.has(key)).toBe(true);
    });

    test("human attack does not target the human player's own board", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);
      const humanHitsBefore = getTotalHits(game.humanPlayer.gameboard);

      game.attackComputer(coordinate);

      expect(getTotalHits(game.humanPlayer.gameboard)).toBe(humanHitsBefore);
    });

    test("does not allow the human player to attack the same coordinate twice", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);
      const ship = game.computerPlayer.gameboard.getShipAt(coordinate);

      game.attackComputer(coordinate);
      game.currentTurn = "human";

      const result = game.attackComputer(coordinate);

      expect(result).toBe("already-attacked");
      expect(ship.hits).toBe(1);
    });

    test("switches to the computer turn after a valid human attack", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);

      game.attackComputer(coordinate);

      expect(game.currentTurn).toBe("computer");
    });

    test("does not switch turns after a duplicate human attack", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);

      game.attackComputer(coordinate);
      game.currentTurn = "human";

      game.attackComputer(coordinate);

      expect(game.currentTurn).toBe("human");
    });

    test("does not allow the human player to attack when it is not their turn", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);
      const attackedCountBefore =
        game.computerPlayer.gameboard.attackedCoordinates.size;
      const computerHitsBefore = getTotalHits(game.computerPlayer.gameboard);

      game.currentTurn = "computer";

      const result = game.attackComputer(coordinate);

      expect(result).toBe("not-your-turn");
      expect(game.computerPlayer.gameboard.attackedCoordinates.size).toBe(
        attackedCountBefore,
      );
      expect(getTotalHits(game.computerPlayer.gameboard)).toBe(
        computerHitsBefore,
      );
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

  describe("game over", () => {
    test("winner starts as null", () => {
      const game = new GameController();

      expect(game.winner).toBeNull();
    });

    test("winner stays null when only one computer ship is sunk", () => {
      const game = new GameController();
      const ship = game.computerPlayer.gameboard.ships[0];
      const coordinates = getShipCoordinates(
        game.computerPlayer.gameboard,
        ship,
      );

      coordinates.forEach((coordinate) => {
        game.currentTurn = "human";
        game.attackComputer(coordinate);
      });

      expect(ship.isSunk()).toBe(true);
      expect(game.winner).toBeNull();
    });

    test("sets winner to human when all computer ships are sunk", () => {
      const game = new GameController();
      const coordinates = getAllShipCoordinates(game.computerPlayer.gameboard);

      coordinates.forEach((coordinate) => {
        game.currentTurn = "human";
        game.attackComputer(coordinate);
      });

      expect(game.computerPlayer.gameboard.allShipsSunk()).toBe(true);
      expect(game.winner).toBe("human");
    });

    test("sets winner to computer when all human ships are sunk", () => {
      const game = new GameController();
      const coordinates = getAllShipCoordinates(game.humanPlayer.gameboard);

      jest
        .spyOn(game.computerPlayer, "getComputerAttack")
        .mockImplementation(() => coordinates.shift());

      for (let i = 0; i < 17; i++) {
        game.currentTurn = "computer";
        game.attackHuman();
      }

      expect(game.humanPlayer.gameboard.allShipsSunk()).toBe(true);
      expect(game.winner).toBe("computer");
    });

    test("does not allow the human player to attack after the game is over", () => {
      const game = new GameController();
      const coordinates = getAllShipCoordinates(game.computerPlayer.gameboard);

      coordinates.forEach((coordinate) => {
        game.currentTurn = "human";
        game.attackComputer(coordinate);
      });

      const attackedCountBefore =
        game.computerPlayer.gameboard.attackedCoordinates.size;
      const missedCountBefore =
        game.computerPlayer.gameboard.missedAttacks.size;
      const coordinate = getUnattackedCoordinate(game.computerPlayer.gameboard);

      game.currentTurn = "human";

      const result = game.attackComputer(coordinate);

      expect(result).toBe("game-over");
      expect(game.computerPlayer.gameboard.attackedCoordinates.size).toBe(
        attackedCountBefore,
      );
      expect(game.computerPlayer.gameboard.missedAttacks.size).toBe(
        missedCountBefore,
      );
    });

    test("does not allow the computer player to attack after the game is over", () => {
      const game = new GameController();
      const coordinates = getAllShipCoordinates(game.computerPlayer.gameboard);

      coordinates.forEach((coordinate) => {
        game.currentTurn = "human";
        game.attackComputer(coordinate);
      });

      const attackedCountBefore =
        game.humanPlayer.gameboard.attackedCoordinates.size;

      game.currentTurn = "computer";

      const result = game.attackHuman();

      expect(result).toBe("game-over");
      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(
        attackedCountBefore,
      );
    });
  });

  describe("starting a new game after progress has been made", () => {
    test("startNewGame() resets winner to null", () => {
      const game = new GameController();

      game.winner = "human";

      game.startNewGame();

      expect(game.winner).toBeNull();
    });

    test("startNewGame() resets currentTurn to human", () => {
      const game = new GameController();

      game.currentTurn = "computer";

      game.startNewGame();

      expect(game.currentTurn).toBe("human");
    });

    test("startNewGame() creates fresh players", () => {
      const game = new GameController();

      const originalHumanPlayer = game.humanPlayer;
      const originalComputerPlayer = game.computerPlayer;

      game.startNewGame();

      expect(game.humanPlayer).not.toBe(originalHumanPlayer);
      expect(game.computerPlayer).not.toBe(originalComputerPlayer);
    });

    test("startNewGame() creates fresh gameboards", () => {
      const game = new GameController();

      const originalHumanBoard = game.humanPlayer.gameboard;
      const originalComputerBoard = game.computerPlayer.gameboard;

      game.startNewGame();

      expect(game.humanPlayer.gameboard).not.toBe(originalHumanBoard);
      expect(game.computerPlayer.gameboard).not.toBe(originalComputerBoard);
    });

    test("startNewGame() clears previous attacks", () => {
      const game = new GameController();
      const coordinate = getEmptyCoordinate(game.computerPlayer.gameboard);

      game.attackComputer(coordinate);
      game.currentTurn = "computer";
      game.attackHuman();

      game.startNewGame();

      expect(game.computerPlayer.gameboard.attackedCoordinates.size).toBe(0);
      expect(game.computerPlayer.gameboard.missedAttacks.size).toBe(0);
      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(0);
      expect(game.humanPlayer.gameboard.missedAttacks.size).toBe(0);
    });

    test("startNewGame() restores unsunk ships", () => {
      const game = new GameController();
      const coordinate = getOccupiedCoordinate(game.computerPlayer.gameboard);

      game.attackComputer(coordinate);

      game.startNewGame();

      expect(
        game.computerPlayer.gameboard.ships.every((ship) => !ship.isSunk()),
      ).toBe(true);
    });

    test("startNewGame() places ships on both boards", () => {
      const game = new GameController();

      game.startNewGame();

      expect(game.humanPlayer.gameboard.ships).toHaveLength(5);
      expect(game.humanPlayer.gameboard.shipLocations.size).toBe(17);
      expect(game.computerPlayer.gameboard.ships).toHaveLength(5);
      expect(game.computerPlayer.gameboard.shipLocations.size).toBe(17);
    });
  });

  describe("randomizing the human fleet", () => {
    test("randomizeHumanFleet() places ships on the human board", () => {
      const game = new GameController();

      game.randomizeHumanFleet();

      expect(game.humanPlayer.gameboard.ships).toHaveLength(5);
      expect(game.humanPlayer.gameboard.shipLocations.size).toBe(17);
    });

    test("randomizeHumanFleet() places the standard ship lengths", () => {
      const game = new GameController();

      game.randomizeHumanFleet();

      const shipLengths = game.humanPlayer.gameboard.ships
        .map((ship) => ship.length)
        .sort((a, b) => a - b);

      expect(shipLengths).toEqual([2, 3, 3, 4, 5]);
    });

    test("randomizeHumanFleet() does not change the computer board", () => {
      const game = new GameController();

      const originalComputerCoordinates = [
        ...game.computerPlayer.gameboard.shipLocations.keys(),
      ];

      game.randomizeHumanFleet();

      expect([...game.computerPlayer.gameboard.shipLocations.keys()]).toEqual(
        originalComputerCoordinates,
      );
    });

    test("randomizeHumanFleet() clears attacks on the human board", () => {
      const game = new GameController();

      game.currentTurn = "computer";
      game.attackHuman();

      game.randomizeHumanFleet();

      expect(game.humanPlayer.gameboard.attackedCoordinates.size).toBe(0);
      expect(game.humanPlayer.gameboard.missedAttacks.size).toBe(0);
    });

    test("game starts with gameStarted set to false", () => {
      const game = new GameController();

      expect(game.gameStarted).toBe(false);
    });

    test("gameStarted becomes true after a valid human attack", () => {
      const game = new GameController();
      const coordinate = [
        ...game.computerPlayer.gameboard.shipLocations.keys(),
      ][0]
        .split(",")
        .map(Number);

      game.attackComputer(coordinate);

      expect(game.gameStarted).toBe(true);
    });

    test("randomizeHumanFleet() returns true before the game has started", () => {
      const game = new GameController();

      const result = game.randomizeHumanFleet();

      expect(result).toBe(true);
    });

    test("randomizeHumanFleet() returns false after the game has started", () => {
      const game = new GameController();
      const coordinate = [
        ...game.computerPlayer.gameboard.shipLocations.keys(),
      ][0]
        .split(",")
        .map(Number);

      game.attackComputer(coordinate);

      const result = game.randomizeHumanFleet();

      expect(result).toBe(false);
    });

    test("randomizeHumanFleet() does not change the human board after the game has started", () => {
      const game = new GameController();
      const coordinate = [
        ...game.computerPlayer.gameboard.shipLocations.keys(),
      ][0]
        .split(",")
        .map(Number);

      game.attackComputer(coordinate);

      const originalHumanCoordinates = [
        ...game.humanPlayer.gameboard.shipLocations.keys(),
      ];

      game.randomizeHumanFleet();

      expect([...game.humanPlayer.gameboard.shipLocations.keys()]).toEqual(
        originalHumanCoordinates,
      );
    });

    test("startNewGame() resets gameStarted to false", () => {
      const game = new GameController();
      const coordinate = [
        ...game.computerPlayer.gameboard.shipLocations.keys(),
      ][0]
        .split(",")
        .map(Number);

      game.attackComputer(coordinate);

      game.startNewGame();

      expect(game.gameStarted).toBe(false);
    });
  });
});
