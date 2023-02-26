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
      this.io.to(roomID).emit("players", playerNames);
      players[random].emit("color", "white");
      players[1 - random].emit("color", "black");
      this.createRoom(
        roomID,
        {
          white: players[random],
          black: players[1 - random],
        },
        this.io
      );
      this.io.to(roomID).emit("start", "start");
    }
  }

  private createRoom(room: string, players: players, io: Server) {
    const checkers = new Checkers();
    players.white.on("ready", () => {
      io.to(room).emit("position", checkers.board);
    });
    players.white.on("move", (data) => {
      checkers.playMove(data);
      io.to(room).emit("position", checkers.board);
    });
    players.black.on("move", (data) => {
      checkers.playMove(data);
      io.to(room).emit("position", checkers.board);
    });
    players.white.on("legalMoves", (data) => {
      checkers.showLegalMoves(data, players.white);
    });
    players.black.on("legalMoves", (data) => {
      checkers.showLegalMoves(data, players.black);
    });
  }
}

class Checkers {
  board: number[] = [
    0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
  ];
  turn: number = 0; // 0 - white, 1 - black
  constructor() {}

  playMove(data: { from: number; to: number }) {
    const { from, to } = data;
    if (this.board[from] === 1 && this.turn === 0) {
      this.board[from] = 0;
      this.board[to] = 1;
      if (from - to === 14) {
        this.board[from - 7] = 0;
      }
      if (from - to === 18) {
        this.board[from - 9] = 0;
      }
      if (from - to === 21) {
        this.board[from - 7] = 0;
        this.board[from - 14] = 0;
      }
      if (from - to === 27) {
        this.board[from - 9] = 0;
        this.board[from - 18] = 0;
      }
      this.turn = 1;
    } else if (this.board[from] === 2 && this.turn === 1) {
      this.board[from] = 0;
      this.board[to] = 2;
      if (from - to === -14) {
        this.board[from + 7] = 0;
      }
      if (from - to === -18) {
        this.board[from + 9] = 0;
      }
      this.turn = 0;
    }
  }

  showLegalMoves(square: number, player: Socket) {
    if (this.board[square] === 1 && this.turn === 0) {
      const directions = [-9, -7];
      const legalMoves = [];
      for (let i = 0; i < directions.length; i++) {
        let move = square;
        let capture = false;
        while (true) {
          const col = move % 8;
          move += directions[i];
          if (col === 0 && directions[i] === -9) {
            break;
          }
          if (col === 7 && directions[i] === -7) {
            break;
          }
          if (move < 0 || move > 63) break;
          if (this.board[move] === 0) {
            if (capture) break;
            legalMoves.push(move);
            break;
          } else if (
            this.board[move] === 2 &&
            this.board[move + directions[i]] === 0
          ) {
            legalMoves.push(move + directions[i]);
            move += directions[i];
            capture = true;
          } else {
            break;
          }
        }
      }
      player.emit("legalMoves", legalMoves);
    } else if (this.board[square] === 2 && this.turn === 1) {
      const directions = [9, 7];
      const legalMoves = [];
      for (let i = 0; i < directions.length; i++) {
        let move = square;
        let capture = false;
        while (true) {
          const col = move % 8;
          move += directions[i];
          if (col === 0 && directions[i] === 9) {
            break;
          }
          if (col === 7 && directions[i] === 7) {
            break;
          }
          if (move < 0 || move > 63) break;
          if (this.board[move] === 0) {
            if (capture) break;
            legalMoves.push(move);
            break;
          } else if (
            this.board[move] === 1 &&
            this.board[move + directions[i]] === 0
          ) {
            legalMoves.push(move + directions[i]);
            move += directions[i];
            capture = true;
          } else {
            break;
          }
        }
      }
      player.emit("legalMoves", legalMoves);
    }
  }
}
