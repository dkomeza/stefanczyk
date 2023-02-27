"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Game {
    constructor(io) {
        this.queue = [];
        this.io = io;
    }
    addToQueue(socket, name) {
        this.queue.push({ socket, name });
        this.handleMatchmaking();
    }
    handleMatchmaking() {
        if (this.queue.length >= 2) {
            const roomID = (0, uuid_1.v4)();
            const playerNames = [];
            const players = [];
            for (let i = 0; i < 2; i++) {
                const player = this.queue.shift();
                const socket = player.socket;
                players.push(player.socket);
                playerNames.push(player.name);
                socket === null || socket === void 0 ? void 0 : socket.join(roomID);
            }
            const random = Math.floor(Math.random() * 2);
            this.io.to(roomID).emit("players", playerNames);
            players[random].emit("color", "white");
            players[1 - random].emit("color", "black");
            this.createRoom(roomID, {
                white: players[random],
                black: players[1 - random],
            }, this.io);
            this.io.to(roomID).emit("start", "start");
        }
    }
    createRoom(room, players, io) {
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
exports.default = Game;
class Checkers {
    constructor() {
        this.board = [
            // 0 - empty, 1 - white, 2 - black, 3 - whiteQ, 4 - blackQ
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.turn = 0; // 0 - white, 1 - black
    }
    playMove(data) {
        const { from, to } = data;
        const distanceX = to.x - from.x;
        const distanceY = to.y - from.y;
        if ((this.board[from.y][from.x] === 1 || this.board[from.y][from.x] === 3) &&
            this.turn === 0) {
            const directionX = distanceX > 0 ? 1 : -1;
            const directionY = distanceY > 0 ? 1 : -1;
            const initialPiece = this.board[from.y][from.x];
            const currentSquare = {
                x: from.x,
                y: from.y,
            };
            while (currentSquare.y != to.y) {
                this.board[currentSquare.y][currentSquare.x] = 0;
                currentSquare.y += directionY;
                currentSquare.x += directionX;
            }
            if (to.y === 0) {
                this.board[to.y][to.x] = 3;
            }
            else {
                this.board[to.y][to.x] = initialPiece;
            }
            this.turn = 1;
        }
        else if ((this.board[from.y][from.x] === 2 || this.board[from.y][from.x] === 4) &&
            this.turn === 1) {
            const directionX = distanceX > 0 ? 1 : -1;
            const currentSquare = {
                x: from.x,
                y: from.y,
            };
            while (currentSquare.y < to.y) {
                this.board[currentSquare.y][currentSquare.x] = 0;
                currentSquare.y++;
                currentSquare.x += directionX;
            }
            if (to.y === 7) {
                this.board[to.y][to.x] = 4;
            }
            else if (this.board[from.y][from.x] === 4) {
                this.board[to.y][to.x] = 4;
            }
            else {
                this.board[to.y][to.x] = 2;
            }
            this.turn = 0;
        }
    }
    showLegalMoves(square, player) {
        if (this.board[square.y][square.x] === 1 && this.turn === 0) {
            const directions = [
                [-1, -1],
                [-1, 1],
            ];
            const legalMoves = [];
            for (let i = 0; i < directions.length; i++) {
                let move = {
                    x: square.x,
                    y: square.y,
                };
                while (true) {
                    move.x += directions[i][1];
                    move.y += directions[i][0];
                    if (move.x < 0 || move.x > 7) {
                        break;
                    }
                    if (move.y < 0 || move.y > 7) {
                        break;
                    }
                    const x = move.x;
                    const y = move.y;
                    if (this.board[y][x] === 0) {
                        legalMoves.push({
                            x,
                            y,
                        });
                        break;
                    }
                    else if (this.board[y][x] === 2) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
            player.emit("legalMoves", legalMoves);
        }
        else if (this.board[square.y][square.x] === 2 && this.turn === 1) {
            const directions = [
                [1, -1],
                [1, 1],
            ];
            const legalMoves = [];
            for (let i = 0; i < directions.length; i++) {
                let move = {
                    x: square.x,
                    y: square.y,
                };
                while (true) {
                    move.x += directions[i][1];
                    move.y += directions[i][0];
                    if (move.x < 0 || move.x > 7) {
                        break;
                    }
                    if (move.y < 0 || move.y > 7) {
                        break;
                    }
                    const x = move.x;
                    const y = move.y;
                    if (this.board[y][x] === 0) {
                        legalMoves.push({
                            x,
                            y,
                        });
                        break;
                    }
                    else if (this.board[y][x] === 1) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
            player.emit("legalMoves", legalMoves);
        }
        else if (this.board[square.y][square.x] === 3 && this.turn === 0) {
            const directions = [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
            ];
            const legalMoves = [];
            for (let i = 0; i < directions.length; i++) {
                let move = {
                    x: square.x,
                    y: square.y,
                };
                while (true) {
                    move.x += directions[i][1];
                    move.y += directions[i][0];
                    if (move.x < 0 || move.x > 7) {
                        break;
                    }
                    if (move.y < 0 || move.y > 7) {
                        break;
                    }
                    const x = move.x;
                    const y = move.y;
                    if (this.board[y][x] === 0) {
                        legalMoves.push({
                            x,
                            y,
                        });
                    }
                    else if (this.board[y][x] === 2) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
            player.emit("legalMoves", legalMoves);
        }
        else if (this.board[square.y][square.x] === 4 && this.turn === 1) {
            const directions = [
                [1, -1],
                [1, 1],
                [-1, 1],
                [-1, -1],
            ];
            const legalMoves = [];
            for (let i = 0; i < directions.length; i++) {
                let move = {
                    x: square.x,
                    y: square.y,
                };
                while (true) {
                    move.x += directions[i][1];
                    move.y += directions[i][0];
                    if (move.x < 0 || move.x > 7) {
                        break;
                    }
                    if (move.y < 0 || move.y > 7) {
                        break;
                    }
                    const x = move.x;
                    const y = move.y;
                    if (this.board[y][x] === 0) {
                        legalMoves.push({
                            x,
                            y,
                        });
                    }
                    else if (this.board[y][x] === 1) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
            player.emit("legalMoves", legalMoves);
        }
    }
}
