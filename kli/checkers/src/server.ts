import express from "express";
import http from "http";
import { Server } from "socket.io";

import Game from "./api/Game.js";

interface PlayerInterface {
  id: string;
}

const players: PlayerInterface[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/api/socket",
});
const game = new Game(io);

io.on("connection", (socket) => {
  const socketNames = Array.from(io.sockets.sockets.keys());
  const sockets = io.sockets.sockets;
  game.handleMatchmaking(socketNames, sockets);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("./static/dist"));

app.post("/status", (req, res) => {
  res.send({ status: "Api active" });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
