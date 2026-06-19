const humanBoard = document.querySelector(".human-board");
const computerBoard = document.querySelector(".computer-board");

export function renderGame(game) {
  renderBoard(game.humanPlayer.gameboard, humanBoard, true);
  renderBoard(game.computerPlayer.gameboard, computerBoard, false);
}

export function initDOMEvents(game) {
  computerBoard.addEventListener("click", (e) => {
    handleBoardClick(e, game);
  });
}

function renderBoard(gameboard, container, revealShips) {
  clearElement(container);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.type = container === humanBoard ? "human" : "computer";
      const status = gameboard.getCellStatus([row, col], revealShips);
      cell.classList.add(status);
      container.appendChild(cell);
    }
  }
}

function clearElement(element) {
  element.textContent = "";
}

function handleBoardClick(e, game) {
  if (!e.target.classList.contains("cell")) {
    return;
  }

  const cell = e.target;

  if (e.target.dataset.type === "computer") {
    game.attackComputer([+cell.dataset.row, +cell.dataset.col]);
    renderGame(game);
  }
}
