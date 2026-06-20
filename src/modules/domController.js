const humanBoard = document.querySelector(".human-board");
const computerBoard = document.querySelector(".computer-board");
const humanBoardAttackStatus = document.querySelector(
  ".human-board-attack-status",
);
const computerBoardAttackStatus = document.querySelector(
  ".computer-board-attack-status",
);
const winnerStatus = document.querySelector(".winner");

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

  if (renderWinner(game)) {
    return;
  }

  const cell = e.target;

  if (e.target.dataset.type === "computer") {
    const result = game.attackComputer([+cell.dataset.row, +cell.dataset.col]);
    renderGame(game);
    if (renderWinner(game)) {
      return;
    }

    if (result === "hit" || result === "miss") {
      computerBoardAttackStatus.textContent = `${result}!`;
      humanBoardAttackStatus.textContent = "Computer is thinking...";
      setTimeout(() => {
        const computerAttackResult = game.attackHuman();
        renderGame(game);
        renderWinner(game);
        humanBoardAttackStatus.textContent = `${computerAttackResult}!`;
      }, 0);
    }
  }
}

function renderWinner(game) {
  if (game.winner) {
    winnerStatus.textContent = `${game.winner} wins!!`;
    return true;
  }

  return false;
}
