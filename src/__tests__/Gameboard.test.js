import Gameboard from "../modules/Gameboard.js";
import Ship from "../modules/Ship.js";

describe("Gameboard", () => {
  test("creates an empty gameboard", () => {
    const gameboard = new Gameboard();

    expect(gameboard.ships).toEqual([]);
  });

  test("places a horizontal ship at the given coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");

    expect(gameboard.getShipAt([2, 4])).toBe(ship);
    expect(gameboard.getShipAt([2, 5])).toBe(ship);
    expect(gameboard.getShipAt([2, 6])).toBe(ship);
  });

  test("places a vertical ship at the given coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "vertical");

    expect(gameboard.getShipAt([2, 4])).toBe(ship);
    expect(gameboard.getShipAt([3, 4])).toBe(ship);
    expect(gameboard.getShipAt([4, 4])).toBe(ship);
  });

  test("tracks placed ships", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");

    expect(gameboard.ships).toContain(ship);
  });

  test("returns undefined when there is no ship at the given coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");

    expect(gameboard.getShipAt([0, 0])).toBeUndefined();
  });

  test("returns true when a ship is placed successfully", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    const result = gameboard.placeShip(ship, [2, 4], "horizontal");

    expect(result).toBe(true);
  });

  test("does not place a horizontal ship out of bounds", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    const result = gameboard.placeShip(ship, [2, 8], "horizontal");

    expect(result).toBe(false);
    expect(gameboard.getShipAt([2, 8])).toBeUndefined();
    expect(gameboard.getShipAt([2, 9])).toBeUndefined();
    expect(gameboard.getShipAt([2, 10])).toBeUndefined();
    expect(gameboard.ships).not.toContain(ship);
  });

  test("does not place a vertical ship out of bounds", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    const result = gameboard.placeShip(ship, [8, 2], "vertical");

    expect(result).toBe(false);
    expect(gameboard.getShipAt([8, 2])).toBeUndefined();
    expect(gameboard.getShipAt([9, 2])).toBeUndefined();
    expect(gameboard.getShipAt([10, 2])).toBeUndefined();
    expect(gameboard.ships).not.toContain(ship);
  });

  test("does not place a ship that overlaps another ship horizontally", () => {
    const gameboard = new Gameboard();
    const firstShip = new Ship(3);
    const secondShip = new Ship(3);

    gameboard.placeShip(firstShip, [2, 4], "horizontal");

    const result = gameboard.placeShip(secondShip, [2, 5], "horizontal");

    expect(result).toBe(false);
    expect(gameboard.getShipAt([2, 4])).toBe(firstShip);
    expect(gameboard.getShipAt([2, 5])).toBe(firstShip);
    expect(gameboard.getShipAt([2, 6])).toBe(firstShip);
    expect(gameboard.getShipAt([2, 7])).toBeUndefined();
    expect(gameboard.ships).not.toContain(secondShip);
  });

  test("does not place a ship that overlaps another ship vertically", () => {
    const gameboard = new Gameboard();
    const firstShip = new Ship(3);
    const secondShip = new Ship(3);

    gameboard.placeShip(firstShip, [2, 4], "vertical");

    const result = gameboard.placeShip(secondShip, [3, 4], "vertical");

    expect(result).toBe(false);
    expect(gameboard.getShipAt([2, 4])).toBe(firstShip);
    expect(gameboard.getShipAt([3, 4])).toBe(firstShip);
    expect(gameboard.getShipAt([4, 4])).toBe(firstShip);
    expect(gameboard.getShipAt([5, 4])).toBeUndefined();
    expect(gameboard.ships).not.toContain(secondShip);
  });

  test("does not place a ship that crosses an existing ship", () => {
    const gameboard = new Gameboard();
    const horizontalShip = new Ship(3);
    const verticalShip = new Ship(3);

    gameboard.placeShip(horizontalShip, [2, 4], "horizontal");

    const result = gameboard.placeShip(verticalShip, [1, 5], "vertical");

    expect(result).toBe(false);
    expect(gameboard.getShipAt([2, 4])).toBe(horizontalShip);
    expect(gameboard.getShipAt([2, 5])).toBe(horizontalShip);
    expect(gameboard.getShipAt([2, 6])).toBe(horizontalShip);
    expect(gameboard.getShipAt([1, 5])).toBeUndefined();
    expect(gameboard.getShipAt([3, 5])).toBeUndefined();
    expect(gameboard.ships).not.toContain(verticalShip);
  });
});
