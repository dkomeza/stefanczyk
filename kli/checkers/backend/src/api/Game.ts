import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

interface players {
  white: Socket;
  black: Socket;
}

export default class Game {
  io: Server;
  queue: { socket: Socket; name: string }[] = [];
  constructor(io: Server) {
    this.io = io;
  }
  addToQueue(socket: Socket, name: string) {
    this.queue.push({ socket, name });
    this.handleMatchmaking();
  }
  handleMatchmaking() {
    if (this.queue.length >= 2) {
      const roomID = v4();
      const playerNames = [];
      const players = [];
      for (let i = 0; i < 2; i++) {
        const player = this.queue.shift()!;
        const socket = player.socket;
        players.push(player.socket);
        playerNames.push(player.name);
        socket?.join(roomID);
      }
      const random = Math.floor(Math.random() * 2);
      this.createRoom(roomID, {
        white: players[random],
        black: players[1 - random],
      });
      this.io.to(roomID).emit("players", playerNames);
      players[random].emit("color", "white");
      players[1 - random].emit("color", "black");
      this.io.to(roomID).emit("start", "start");
    }
  }

  private createRoom(room: string, players: players) {
    const checkers = new Checkers();
    players.white.on("move", (data) => checkers.playMove(data, players.white));
    players.black.on("move", (data) => checkers.playMove(data, players.black));
  }
}

class Checkers {
  board: number[] = [];
  turn: number = 0; // 0 - white, 1 - black
  constructor() {
    for (let i = 0; i < 64; i++) {
      this.board[i] = 0;
    }
    this.placeWhite();
    this.placeBlack();
  }

  private placeWhite() {
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) this.board[i] = 1;
    }
  }

  private placeBlack() {
    for (let i = 0; i < 16; i++) {
      if ((63 - i) % 2 === 0) this.board[63 - i] = 1;
    }
  }

  playMove(data: string, player: Socket) {
    console.log(data);
  }
}
