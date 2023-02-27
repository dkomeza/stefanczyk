import { io, Socket } from "socket.io-client";


export default class Network {
  menu: HTMLElement;
  color: "black" | "white" | null = null;
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
    socket.on("players", (data) => {
      console.log(data);
    });
    socket.on("color", (data) => {
      this.color = data;
    });
    socket.on("start", () => {
      this.callback(this.color!, socket);
    });
  }
}
