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

  test("starts with no missed attacks", () => {
    const gameboard = new Gameboard();

    expect(gameboard.missedAttacks).toEqual(new Set());
  });

  test("starts with no attacked coordinates", () => {
    const gameboard = new Gameboard();

    expect(gameboard.attackedCoordinates).toEqual(new Set());
  });

  test("records a missed attack", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([2, 4]);

    expect(gameboard.missedAttacks.has(Gameboard.coordinateKey(2, 4))).toBe(
      true,
    );
  });

  test("receiveAttack() returns miss when no ship is at the coordinates", () => {
    const gameboard = new Gameboard();

    const result = gameboard.receiveAttack([2, 4]);

    expect(result).toBe("miss");
  });

  test("records missed attacks in missedAttacks and attackedCoordinates", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([2, 4]);

    expect(gameboard.missedAttacks.has(Gameboard.coordinateKey(2, 4))).toBe(
      true,
    );
    expect(
      gameboard.attackedCoordinates.has(Gameboard.coordinateKey(2, 4)),
    ).toBe(true);
  });

  test("receiveAttack() hits a ship at the given coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");
    gameboard.receiveAttack([2, 5]);

    expect(ship.hits).toBe(1);
  });

  test("receiveAttack() returns hit when a ship is at the coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");

    const result = gameboard.receiveAttack([2, 5]);

    expect(result).toBe("hit");
  });

  test("records hit attacks in attackedCoordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");
    gameboard.receiveAttack([2, 5]);

    expect(
      gameboard.attackedCoordinates.has(Gameboard.coordinateKey(2, 5)),
    ).toBe(true);
  });

  test("does not record hit attacks as missed attacks", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");
    gameboard.receiveAttack([2, 5]);

    expect(gameboard.missedAttacks.has(Gameboard.coordinateKey(2, 5))).toBe(
      false,
    );
  });

  test("does not allow the same missed coordinate to be attacked twice", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([2, 4]);
    const result = gameboard.receiveAttack([2, 4]);

    expect(result).toBe("already-attacked");
    expect(gameboard.missedAttacks).toEqual(
      new Set([Gameboard.coordinateKey(2, 4)]),
    );
  });

  test("does not allow the same ship coordinate to be attacked twice", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [2, 4], "horizontal");

    gameboard.receiveAttack([2, 5]);
    const result = gameboard.receiveAttack([2, 5]);

    expect(result).toBe("already-attacked");
    expect(ship.hits).toBe(1);
  });

  test("does not add duplicate coordinates to attackedCoordinates", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([2, 4]);
    gameboard.receiveAttack([2, 4]);

    expect(gameboard.attackedCoordinates).toEqual(
      new Set([Gameboard.coordinateKey(2, 4)]),
    );
  });
});
