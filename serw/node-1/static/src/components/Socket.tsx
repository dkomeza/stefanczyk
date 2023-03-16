import { io, Socket } from "socket.io-client";
import { Message } from "./Message";

class socket {
  private socket: Socket | undefined;
  private username: string = "";
  private messages: Message[] | undefined;
  private setMessages:
    | React.Dispatch<React.SetStateAction<Message[] | undefined>>
    | undefined;

  public assignState(
    messages: Message[] | undefined,
    setMessages: React.Dispatch<React.SetStateAction<Message[] | undefined>>
  ) {
    this.messages = messages;
    this.setMessages = setMessages;
  }

  public connect(username: string) {
    this.username = username;
    this.socket = io("", {
      path: "/socket.io",
      query: {
        username,
      },
    });

    this.socket.on("message", (data) => {
      if (this.setMessages) {
        if (this.messages) {
          this.setMessages((messages) => [...messages!, data]);
        } else {
          this.setMessages([data]);
        }
      }
      console.log("juh", data);
    });
  }

  public send(message: string) {
    this.socket?.emit("message", { message, username: this.username });
  }
}

export default new socket();
// Path: static/src/components/Chat.tsx
