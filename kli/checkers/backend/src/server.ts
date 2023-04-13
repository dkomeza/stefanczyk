import express from "express";
import http from "http";
import { Server } from "socket.io";

import Game from "./api/Game.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
});
const game = new Game(io);

  io.on("connection", (socket) => {
  const name = socket.handshake.query.name;
  game.addToQueue(socket, name!.toString());
  socket.on("disconnect", () => {
    game.removeFromQueue(socket);
  });
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
