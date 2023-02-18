import Game from "./components/Game";
import Network from "./components/Network";
import UI from "./components/UI";

import "./scss/main.scss";

const ui = new UI();
ui.createUI();
const game = new Game(ui.getContainer());
// game.addPlayer("white");
// game.addPlayer("black");

document.querySelector<HTMLDivElement>("#app")?.append(ui.createUI());
const network = new Network(ui.getMenu(), game.addPlayer);
