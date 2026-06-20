const humanBoard = document.querySelector(".human-board");
const computerBoard = document.querySelector(".computer-board");
const mainStatus = document.querySelector(".main-status");
const subStatus = document.querySelector(".sub-status");
const playerActionStatus = document.querySelector(".player-action-status");
const computerActionStatus = document.querySelector(".computer-action-status");
let prevComputerAttack = null;

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
      mainStatus.textContent = "You win!";
      subStatus.textContent = "You sank all of the computer's ships.";
      playerActionStatus.textContent = `Your last attack: ${capitalize(result)}!`;
      return;
    }

    if (result === "hit" || result === "miss") {
      mainStatus.textContent = "Computer is thinking...";
      subStatus.textContent = "Waiting for the computer's move.";
      playerActionStatus.textContent = `Your last attack: ${capitalize(result)}!`;
      computerActionStatus.textContent = `Computer's last attack: ${prevComputerAttack ? `${capitalize(prevComputerAttack)}!` : "—"}`;

      setTimeout(() => {
        const computerAttackResult = game.attackHuman();
        prevComputerAttack = computerAttackResult;
        renderGame(game);
        renderWinner(game);
        if (renderWinner(game)) {
          mainStatus.textContent = "Computer wins!";
          subStatus.textContent = "All of your ships have been sunk.";
          computerActionStatus.textContent = `Computer's last attack: ${capitalize(computerAttackResult)}!`;
          return;
        }
        mainStatus.textContent = "Your turn";
        subStatus.textContent = "Choose a coordinate on the computer board.";
        computerActionStatus.textContent = `Computer's last attack: ${capitalize(computerAttackResult)}!`;
      }, 750);
    } else if (result === "already-attacked") {
      mainStatus.textContent = "You already attacked that coordinate.";
      subStatus.textContent =
        "Choose a different coordinate on the computer board.";
    }
  }
}

function renderWinner(game) {
  return game.winner ? true : false;
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
