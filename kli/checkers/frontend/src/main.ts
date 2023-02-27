import Game from "./components/Game";
import Network from "./components/Network";
import UI from "./components/UI";

import { Socket } from "socket.io-client";

import "./scss/main.scss";

const ui = new UI();
ui.createUI();
const game = new Game(ui.getContainer());
// game.addPlayer("white");
// game.addPlayer("black");

document.querySelector<HTMLDivElement>("#app")?.append(ui.createUI());
new Network(ui.getMenu(), addPlayer);
// game.addPlayer("white");

function addPlayer(color: "white" | "black", socket: Socket) {
  game.addPlayer(color, socket);
}
