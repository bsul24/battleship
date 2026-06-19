import "./styles.css";
import GameController from "./modules/gameController.js";
import renderGame from "./modules/domController.js";

const game = new GameController();
renderGame(game);
