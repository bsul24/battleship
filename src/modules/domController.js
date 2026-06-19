const boardOne = document.querySelector(".board-one");
const boardTwo = document.querySelector(".board-two");

export default function renderGame(game) {
  renderBoard(game.humanPlayer.gameboard, boardOne, true);
  renderBoard(game.computerPlayer.gameboard, boardTwo, false);
}

function renderBoard(gameboard, container, revealShips) {
  clearElement(container);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      const status = gameboard.getCellStatus([row, col], revealShips);
      cell.classList.add(status);
      container.appendChild(cell);
    }
  }
}

function clearElement(element) {
  element.textContent = "";
}
