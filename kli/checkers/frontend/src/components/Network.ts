import { io, Socket } from "socket.io-client";

export default class Network {
  menu: HTMLElement;
  color: "black" | "white" | null = null;
  loading: HTMLElement | null = null;
  callback: (color: "black" | "white", socket: Socket) => void;

  constructor(
    menu: HTMLElement,
    addPlayer: (color: "black" | "white", socket: Socket) => void
  ) {
    this.menu = menu;
    this.callback = addPlayer;
    this.handleLogin();
  }

  handleLogin() {
    const input = this.menu.querySelector("input") as HTMLInputElement;
    const button = this.menu.querySelector("button")!;
    button.onclick = () => {
      if (input.value == "") return;
      this.addPlayer(input.value);
      this.menu.style.display = "none";
    };
  }

  addPlayer(name: string) {
    const socket = io("/", {
      path: "/socket.io",
      query: {
        name,
      },
    });
    socket.on("opponent", (data) => {
      this.createOpponentLabel(data);
    });
    socket.on("color", (data) => {
      this.color = data;
    });
    socket.on("start", () => {
      console.log("No chuj no");
      this.loading?.remove();
      this.callback(this.color!, socket);
    });
    this.createLoadingScreen();
  }

  createLoadingScreen() {
    console.log("waiting for other player");
    const loading = document.createElement("div");
    loading.classList.add("loading");
    const text = document.createElement("p");
    text.innerText = "Waiting for another player";
    loading.appendChild(text);
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    loading.appendChild(spinner);
    this.loading = loading;
    document.body.appendChild(loading);
  }

  createOpponentLabel(name: string) {
    const label = document.createElement("p");
    label.innerText = `Opponent: ${name}`;
    label.classList.add("opponent-label");
    document.body.appendChild(label);
  }
}
