"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Game_js_1 = __importDefault(require("./api/Game.js"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: "/socket.io",
});
const game = new Game_js_1.default(io);
io.on("connection", (socket) => {
    const name = socket.handshake.query.name;
    game.addToQueue(socket, name.toString());
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(express.static("./static/dist"));
app.post("/status", (req, res) => {
    res.send({ status: "Api active" });
});
server.listen(5000, () => {
    console.log("listening on *:5000");
});
