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
    removeFromQueue(socket) {
        this.queue = this.queue.filter((player) => player.socket !== socket);
    }
    handleMatchmaking() {
        if (this.queue.length >= 2) {
            for (let i = 0; i < this.queue.length; i++) {
                if (i + 1 < this.queue.length &&
                    this.queue[i].name !== this.queue[i + 1].name) {
                    const roomID = (0, uuid_1.v4)();
                    const playerNames = [];
                    const players = [];
                    const player1 = this.queue[i];
                    const player2 = this.queue[i + 1];
                    player1.socket.join(roomID);
                    player2.socket.join(roomID);
                    this.queue.splice(i, 2);
                    playerNames.push(player1.name);
                    playerNames.push(player2.name);
                    players.push(player1.socket);
                    players.push(player2.socket);
                    const random = Math.floor(Math.random() * 2);
                    players[random].emit("color", "white");
                    players[1 - random].emit("color", "black");
                    this.createRoom(roomID, {
                        white: players[random],
                        black: players[1 - random],
                    }, this.io);
                    players[random].emit("opponent", playerNames[1 - random]);
                    players[1 - random].emit("opponent", playerNames[random]);
                    this.io.to(roomID).emit("start", "start");
                }
            }
        }
    }
    createRoom(room, players, io) {
        const checkers = new Checkers();
        players.white.on("ready", () => {
            io.to(room).emit("position", checkers.board);
        });
        players.white.on("move", (data) => {
            const { removePawns, queen } = checkers.playMove(data);
            checkers.createTimer(players.black, players.white);
            io.to(room).emit("move", { data, removePawns, queen });
        });
        players.black.on("move", (data) => {
            const { removePawns, queen } = checkers.playMove(data);
            checkers.createTimer(players.white, players.black);
            io.to(room).emit("move", { data, removePawns, queen });
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
        this.timer = null;
        this.time = 20;
        this.board = [
            // 0 - empty, 1 - white, 2 - black, 3 - whiteQ, 4 - blackQ
            [0, 0, 0, 2, 0, 2, 0, 2],
            [2, 0, 1, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
        ];
        this.turn = 0; // 0 - white, 1 - black
    }
    playMove(data) {
        const { from, to } = data;
        const removePawns = [];
        let queen = false;
        let vectorX = to.x - from.x > 0 ? 1 : -1;
        let vectorY = to.y - from.y > 0 ? 1 : -1;
        let x = from.x + vectorX;
        let y = from.y + vectorY;
        while (x !== to.x && y !== to.y) {
            if (this.board[y][x] !== 0) {
                removePawns.push({ x, y });
                this.board[y][x] = 0;
            }
            x += vectorX;
            y += vectorY;
        }
        if (this.board[from.y][from.x] === 1 && to.y === 0) {
            this.board[to.y][to.x] = 3;
            queen = true;
        }
        else if (this.board[from.y][from.x] === 2 && to.y === 7) {
            this.board[to.y][to.x] = 4;
            queen = true;
        }
        else {
            this.board[to.y][to.x] = this.board[from.y][from.x];
        }
        this.board[from.y][from.x] = 0;
        this.turn = 1 - this.turn;
        return { removePawns, queen };
    }
    showLegalMoves(square, player) {
        const legalMoves = [];
        console.log(this.board[square.y][square.x]);
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
                            const nextPiece = this.board[nextMove.y][nextMove.x];
                            if (nextPiece === 0 || nextPiece === 1 || nextPiece === 3) {
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
                        }
                        else {
                            legalMoves.push({
                                x,
                                y,
                            });
                            break;
                        }
                    }
                    else if (piece === 2 || piece === 4) {
                        if (capture) {
                            legalMoves.push(previousLegalMove);
                            break;
                        }
                        capture = true;
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else if (this.board[square.y][square.x] === 2 && this.turn === 1) {
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
                            const nextPiece = this.board[nextMove.y][nextMove.x];
                            if (nextPiece === 0 || nextPiece === 2 || nextPiece === 4) {
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
                        }
                        else {
                            legalMoves.push({
                                x,
                                y,
                            });
                            break;
                        }
                    }
                    else if (piece === 1 || piece === 3) {
                        if (capture) {
                            legalMoves.push(previousLegalMove);
                            break;
                        }
                        capture = true;
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else if (this.board[square.y][square.x] === 3 && this.turn === 0) {
            const directions = [
                [-1, -1],
                [-1, 1],
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
                            const nextPiece = this.board[nextMove.y][nextMove.x];
                            if (nextPiece === 0 || nextPiece === 1 || nextPiece === 3) {
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
                        }
                        else {
                            legalMoves.push({
                                x,
                                y,
                            });
                        }
                    }
                    else if (piece === 2 || piece === 4) {
                        if (capture) {
                            legalMoves.push(previousLegalMove);
                            break;
                        }
                        capture = true;
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else if (this.board[square.y][square.x] === 4 && this.turn === 1) {
            const directions = [
                [1, -1],
                [1, 1],
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
                            const nextPiece = this.board[nextMove.y][nextMove.x];
                            if (nextPiece === 0 || nextPiece === 2 || nextPiece === 4) {
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
                        }
                        else {
                            legalMoves.push({
                                x,
                                y,
                            });
                        }
                    }
                    else if (piece === 1 || piece === 3) {
                        if (capture) {
                            legalMoves.push(previousLegalMove);
                            break;
                        }
                        capture = true;
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        const goodMoves = legalMoves.filter((move) => move.x !== -1 && move.y !== -1);
        player.emit("legalMoves", goodMoves);
    }
    createTimer(player, opponent) {
        this.time = 20;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.time--;
            if (this.time === 0) {
                this.turn = this.turn === 0 ? 1 : 0;
                player.emit("message", "You ran out of time!");
                clearInterval(this.timer);
            }
            opponent.emit("timer", this.time);
        }, 1000);
    }
    logBoard() {
        console.table(this.board);
    }
}
