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
    createRoom(room, players) {
        const checkers = new Checkers();
        players.white.on("move", (data) => checkers.playMove(data, players.white));
        players.black.on("move", (data) => checkers.playMove(data, players.black));
    }
}
exports.default = Game;
class Checkers {
    constructor() {
        this.board = [];
        this.turn = 0; // 0 - white, 1 - black
        for (let i = 0; i < 64; i++) {
            this.board[i] = 0;
        }
        this.placeWhite();
        this.placeBlack();
    }
    placeWhite() {
        for (let i = 0; i < 16; i++) {
            if (i % 2 === 0)
                this.board[i] = 1;
        }
    }
    placeBlack() {
        for (let i = 0; i < 16; i++) {
            if ((63 - i) % 2 === 0)
                this.board[63 - i] = 1;
        }
    }
    playMove(data, player) {
        console.log(data);
    }
}
