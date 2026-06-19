import Player from "../modules/Player.js";
import Gameboard from "../modules/Gameboard.js";

describe("Player", () => {
  test("creates a human player", () => {
    const player = new Player("human");

    expect(player.type).toBe("human");
  });

  test("creates a computer player", () => {
    const player = new Player("computer");

    expect(player.type).toBe("computer");
  });

  test("creates a player with a gameboard", () => {
    const player = new Player("human");

    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test("each player has their own gameboard", () => {
    const playerOne = new Player("human");
    const playerTwo = new Player("computer");

    expect(playerOne.gameboard).not.toBe(playerTwo.gameboard);
  });

  test("a player's gameboard starts empty", () => {
    const player = new Player("human");

    expect(player.gameboard.ships).toEqual([]);
  });

  describe("computer attacks", () => {
    test("computer player can generate a random attack coordinate", () => {
      const computer = new Player("computer");

      const coordinate = computer.getRandomAttack();

      expect(Array.isArray(coordinate)).toBe(true);
      expect(coordinate).toHaveLength(2);
    });

    test("generated attack coordinate contains a row and column", () => {
      const computer = new Player("computer");

      const [row, col] = computer.getRandomAttack();

      expect(Number.isInteger(row)).toBe(true);
      expect(Number.isInteger(col)).toBe(true);
    });

    test("generated attack coordinate is within the board", () => {
      const computer = new Player("computer");

      const [row, col] = computer.getRandomAttack();

      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThanOrEqual(9);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThanOrEqual(9);
    });

    test("computer player does not generate the same attack coordinate twice", () => {
      const computer = new Player("computer");
      const attacks = new Set();

      for (let i = 0; i < 100; i++) {
        const [row, col] = computer.getRandomAttack();
        const key = `${row},${col}`;

        expect(attacks.has(key)).toBe(false);

        attacks.add(key);
      }

      expect(attacks.size).toBe(100);
    });

    test("returns null when the computer has no legal attacks remaining", () => {
      const computer = new Player("computer");

      for (let i = 0; i < 100; i++) {
        computer.getRandomAttack();
      }
      expect(computer.getRandomAttack()).toBeNull();
    });
  });
});
