const humanBoard = document.querySelector(".human-board");
const computerBoard = document.querySelector(".computer-board");
const mainStatus = document.querySelector(".main-status");
const subStatus = document.querySelector(".sub-status");
const playerActionStatus = document.querySelector(".player-action-status");
const computerActionStatus = document.querySelector(".computer-action-status");
const newGameBtn = document.querySelector(".new-game-btn");
let prevComputerAttack = null;
let isComputerThinking = false;

export function renderGame(game) {
  renderBoard(game.humanPlayer.gameboard, humanBoard, true);
  renderBoard(game.computerPlayer.gameboard, computerBoard, false);
}

export function initDOMEvents(game) {
  computerBoard.addEventListener("click", (e) => {
    handleBoardClick(e, game);
  });

  newGameBtn.addEventListener("click", () => {
    handleNewGameBtnClick(game);
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

  if (isGameOver(game)) {
    return;
  }

  if (isComputerThinking) {
    return;
  }

  const cell = e.target;

  const result = game.attackComputer([+cell.dataset.row, +cell.dataset.col]);

  renderGame(game);

  if (isGameOver(game)) {
    mainStatus.textContent = "You win!";
    subStatus.textContent = "You sank all of the computer's ships.";
    playerActionStatus.textContent = `Your last attack: ${capitalize(result)}!`;
    return;
  }

  if (result === "hit" || result === "miss") {
    isComputerThinking = true;
    mainStatus.textContent = "Computer is thinking...";
    subStatus.textContent = "Waiting for the computer's move.";
    playerActionStatus.textContent = `Your last attack: ${capitalize(result)}!`;
    computerActionStatus.textContent = `Computer's last attack: ${prevComputerAttack ? `${capitalize(prevComputerAttack)}!` : "—"}`;

    setTimeout(() => {
      if (!isComputerThinking) {
        return;
      }
      const computerAttackResult = game.attackHuman();
      prevComputerAttack = computerAttackResult;
      renderGame(game);
      if (isGameOver(game)) {
        isComputerThinking = false;
        mainStatus.textContent = "Computer wins!";
        subStatus.textContent = "All of your ships have been sunk.";
        computerActionStatus.textContent = `Computer's last attack: ${capitalize(computerAttackResult)}!`;
        return;
      }
      mainStatus.textContent = "Your turn";
      subStatus.textContent = "Choose a coordinate on the computer board.";
      computerActionStatus.textContent = `Computer's last attack: ${capitalize(computerAttackResult)}!`;
      isComputerThinking = false;
    }, 750);
  } else if (result === "already-attacked") {
    mainStatus.textContent = "You already attacked that coordinate.";
    subStatus.textContent =
      "Choose a different coordinate on the computer board.";
  }
}

function handleNewGameBtnClick(game) {
  game.startNewGame();
  renderGame(game);
  mainStatus.textContent = "Your turn";
  subStatus.textContent = "Choose a coordinate on the computer board.";
  playerActionStatus.textContent = "Your last attack: —";
  computerActionStatus.textContent = "Computer's last attack: —";
  prevComputerAttack = null;
  isComputerThinking = false;
}

function isGameOver(game) {
  return game.winner ? true : false;
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
