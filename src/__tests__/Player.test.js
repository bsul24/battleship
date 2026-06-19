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
});
