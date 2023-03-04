import React, { useLayoutEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import Message from "./Message";

function Chat(props: { username: string }) {
  const [messages, setMessages] = useState<Message[]>();
  const messageRef = useRef<HTMLInputElement | null>(null);
  const username = props.username;

  let socket: Socket;

  useLayoutEffect(() => {
    socket = io("", { path: "/socket.io" });
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("message", (message) => {
      console.log(message);
      if (messages) {
        setMessages([...(messages as []), message]);
      } else {
        setMessages([message]);
      }
      console.log(messages);
    });
  }, []);

  const sendMessage = () => {
    const message = messageRef.current?.value;
    if (message) {
      socket.emit("message", { message, username });
    }
  };

  return (
    <main>
      {messages && messages.map((message) => <Message message={message} />)}
      <div className="input">
        <input type="text" name="" id="" ref={messageRef} />
        <button type="submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </main>
  );
}

export default Chat;
