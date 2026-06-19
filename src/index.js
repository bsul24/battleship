import "./styles.css";
import GameController from "./modules/gameController.js";
import { renderGame, initDOMEvents } from "./modules/domController.js";

const game = new GameController();
renderGame(game);
initDOMEvents(game);
