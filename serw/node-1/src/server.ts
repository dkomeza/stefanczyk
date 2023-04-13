import http from "http";
import { Server } from "socket.io";
import * as fs from "fs";

const server = http.createServer((req, res) => {
  if (useStatic("static/dist", req, res)) {
    return;
  }
  res.end("Hello world");
});

const io = new Server(server, {
  path: "/socket",
});

io.on("connection", (socket) => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const username = socket.handshake.query.username;
  socket.broadcast.emit("message", {
    content: `User ${username} has joined the chat`,
    date: time,
    type: "connect",
    from: "server",
  });
  socket.on("message", (message: { message: string; username: string }) => {
    const date = new Date();
    const hour =
      date.getHours() + 1 < 10
        ? `0${date.getHours() + 1}`
        : (date.getHours() + 1).toString();
    const minute =
      date.getMinutes() < 10
        ? `0${date.getMinutes()}`
        : date.getMinutes().toString();
    const seccond =
      date.getSeconds() < 10
        ? `0${date.getSeconds()}`
        : date.getSeconds().toString();
    const time = `${hour}:${minute}:${seccond}`;
    socket.broadcast.emit("message", {
      content: message.message,
      from: message.username,
      date: time,
      type: "incoming",
    });
    socket.emit("message", {
      content: message.message,
      from: message.username,
      date: time,
      type: "outgoing",
    });
  });
  socket.on("disconnect", () => {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    socket.broadcast.emit("message", {
      content: `User ${username} has left the chat`,
      date: time,
      type: "disconnect",
      from: "server",
    });
  });
});

function useStatic(
  path: string,
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let url = decodeURI(req.url || "/");
  if (url?.endsWith("/")) {
    url += "index.html";
  }
  const finalPath = `./${path}${url}`;
  if (!finalPath.includes(".")) {
    return false;
  }
  fs.readFile(finalPath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("404 - File not found");
    } else {
      res.writeHead(200, {
        "Content-Type": handleFileType(finalPath),
      });
      res.write(data);
      res.end();
    }
  });
  return true;
}

function handleFileType(fileName: string) {
  const ext = fileName.split(".").pop();
  switch (ext) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "text/javascript";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpg";
    case "jpeg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    default:
      return "text/plain";
  }
}

server.listen(3000);
