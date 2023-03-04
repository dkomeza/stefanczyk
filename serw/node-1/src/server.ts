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
  path: "/socket.io",
});

io.on("connection", (socket) => {
  socket.on("message", (message: { message: string; username: string }) => {
    const date = new Date().getTime().toLocaleString();
    socket.broadcast.emit("message", {
      content: message.message,
      from: message.username,
      date: date,
      type: "incoming",
    });
    socket.send("message", {
      content: message.message,
      from: message.username,
      date: date,
      type: "outgoing",
    });
  });
});

function useStatic(
  path: string,
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let url = decodeURI(req.url || "/");
  console.log(url);
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

server.listen(5000);
