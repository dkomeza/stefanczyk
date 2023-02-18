"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Game {
    constructor(io) {
        this.io = io;
    }
    handleMatchmaking(socketNames, sockets) {
        if (socketNames.length >= 2) {
            const roomID = (0, uuid_1.v4)();
            console.log(roomID);
            for (let i = 0; i < 2; i++) {
                const socket = sockets.get(socketNames.shift());
                socket === null || socket === void 0 ? void 0 : socket.join(roomID);
                this.io.to(roomID).emit("Joined room: " + roomID);
            }
        }
    }
    createRoom() { }
}
exports.default = Game;
