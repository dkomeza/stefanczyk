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
      players[random].emit("opponent", playerNames[1 - random]);
      players[1 - random].emit("opponent", playerNames[random]);
      this.io.to(roomID).emit("start", "start");
    }
  }

  private createRoom(room: string, players: players, io: Server) {
    const checkers = new Checkers();
    players.white.on("ready", () => {
      io.to(room).emit("position", checkers.board);
    });
    players.white.on("move", (data) => {
      const removePawns = checkers.playMove(data);
      checkers.createTimer(players.black, players.white);
      io.to(room).emit("move", { data, removePawns });
    });
    players.black.on("move", (data) => {
      const removePawns = checkers.playMove(data);
      checkers.createTimer(players.white, players.black);
      io.to(room).emit("move", { data, removePawns });
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
  timer: NodeJS.Timer | null = null;
  time = 60;
  board: number[][] = [
    // 0 - empty, 1 - white, 2 - black, 3 - whiteQ, 4 - blackQ
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ];
  turn: number = 0; // 0 - white, 1 - black
  constructor() {}

  playMove(data: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }) {
    const { from, to } = data;
    const distanceX = to.x - from.x;
    const distanceY = to.y - from.y;
    const removePawns = [];
    if (
      (this.board[from.y][from.x] === 1 || this.board[from.y][from.x] === 3) &&
      this.turn === 0
    ) {
      const directionX = distanceX > 0 ? 1 : -1;
      const directionY = distanceY > 0 ? 1 : -1;
      const initialPiece = this.board[from.y][from.x];
      const currentSquare = {
        x: from.x,
        y: from.y,
      };
      while (currentSquare.y != to.y) {
        if (this.board[currentSquare.y][currentSquare.x] !== 0) {
          removePawns.push({
            x: currentSquare.x,
            y: currentSquare.y,
          });
        }
        this.board[currentSquare.y][currentSquare.x] = 0;
        currentSquare.y += directionY;
        currentSquare.x += directionX;
      }
      if (to.y === 0) {
        this.board[to.y][to.x] = 3;
      } else {
        this.board[to.y][to.x] = initialPiece;
      }
      this.turn = 1;
    } else if (
      (this.board[from.y][from.x] === 2 || this.board[from.y][from.x] === 4) &&
      this.turn === 1
    ) {
      const directionX = distanceX > 0 ? 1 : -1;
      const currentSquare = {
        x: from.x,
        y: from.y,
      };
      while (currentSquare.y < to.y) {
        if (this.board[currentSquare.y][currentSquare.x] !== 0) {
          removePawns.push({
            x: currentSquare.x,
            y: currentSquare.y,
          });
        }
        this.board[currentSquare.y][currentSquare.x] = 0;
        currentSquare.y++;
        currentSquare.x += directionX;
      }
      if (to.y === 7) {
        this.board[to.y][to.x] = 4;
      } else if (this.board[from.y][from.x] === 4) {
        this.board[to.y][to.x] = 4;
      } else {
        this.board[to.y][to.x] = 2;
      }
      this.turn = 0;
    }
    return removePawns;
  }

  showLegalMoves(square: { x: number; y: number }, player: Socket) {
    const legalMoves: { x: number; y: number }[] = [];
    if (this.board[square.y][square.x] === 1 && this.turn === 0) {
      const directions = [
        [-1, -1],
        [-1, 1],
      ];
      for (let i = 0; i < directions.length; i++) {
        let move = {
          x: square.x,
          y: square.y,
        };
        let capture = false;
        let previousLegalMove = {
          x: -1,
          y: -1,
        };
        while (true) {
          move.x += directions[i][1];
          move.y += directions[i][0];
          if (move.x < 0 || move.x > 7) {
            legalMoves.push(previousLegalMove);
            break;
          }
          if (move.y < 0 || move.y > 7) {
            legalMoves.push(previousLegalMove);
            break;
          }
          const x = move.x;
          const y = move.y;
          const piece = this.board[y][x];
          if (piece === 0) {
            if (capture) {
              capture = false;
              let nextMove = {
                x: move.x + directions[i][1],
                y: move.y + directions[i][0],
              };
              if (nextMove.x < 0 || nextMove.x > 7) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              if (nextMove.y < 0 || nextMove.y > 7) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              if (this.board[nextMove.y][nextMove.x] === 0) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              previousLegalMove = {
                x,
                y,
              };
              continue;
            } else {
              legalMoves.push({
                x,
                y,
              });
              break;
            }
          } else if (piece === 2 || piece === 4) {
            capture = true;
            continue;
          } else {
            break;
          }
        }
      }
    } else if (this.board[square.y][square.x] === 2 && this.turn === 1) {
      const directions = [
        [1, -1],
        [1, 1],
      ];
      for (let i = 0; i < directions.length; i++) {
        let move = {
          x: square.x,
          y: square.y,
        };
        let capture = false;
        let previousLegalMove = {
          x: -1,
          y: -1,
        };
        while (true) {
          move.x += directions[i][1];
          move.y += directions[i][0];
          if (move.x < 0 || move.x > 7) {
            legalMoves.push(previousLegalMove);
            break;
          }
          if (move.y < 0 || move.y > 7) {
            legalMoves.push(previousLegalMove);
            break;
          }
          const x = move.x;
          const y = move.y;
          const piece = this.board[y][x];
          if (piece === 0) {
            if (capture) {
              capture = false;
              let nextMove = {
                x: move.x + directions[i][1],
                y: move.y + directions[i][0],
              };
              if (nextMove.x < 0 || nextMove.x > 7) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              if (nextMove.y < 0 || nextMove.y > 7) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              if (this.board[nextMove.y][nextMove.x] === 0) {
                legalMoves.push({
                  x,
                  y,
                });
                break;
              }
              previousLegalMove = {
                x,
                y,
              };
              continue;
            } else {
              legalMoves.push({
                x,
                y,
              });
              break;
            }
          } else if (piece === 1 || piece === 3) {
            capture = true;
            continue;
          } else {
            break;
          }
        }
      }
    }
    const goodMoves = legalMoves.filter(
      (move) => move.x !== -1 && move.y !== -1
    );
    player.emit("legalMoves", goodMoves);
  }

  createTimer(player: Socket, opponent: Socket) {
    this.time = 20;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.time--;
      if (this.time === 0) {
        this.turn = this.turn === 0 ? 1 : 0;
        player.emit("message", "You ran out of time!");
        clearInterval(this.timer!);
      }
      opponent.emit("timer", this.time);
    }, 1000);
  }
}
