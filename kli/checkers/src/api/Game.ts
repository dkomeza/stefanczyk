import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

export default class Game {
  io: Server;
  constructor(io: Server) {
    this.io = io;
  }
  handleMatchmaking(socketNames: String[], sockets: Map<String, Socket>) {
    if (socketNames.length >= 2) {
      const roomID = v4();
      console.log(roomID);
      for (let i = 0; i < 2; i++) {
        const socket = sockets.get(socketNames.shift()!);
        socket?.join(roomID);
        this.io.to(roomID).emit("Joined room: " + roomID);
      }
    }
  }

  private createRoom() {}
}
