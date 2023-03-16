import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
// import io from "./Socket";
import socket from "./Socket";

import { io, Socket } from "socket.io-client";

import Messages from "./Messages";
import { Message } from "./Message";

function Chat(props: { username: string }) {
  const [messages, setMessages] = useState<Message[]>();
  const messageRef = useRef<HTMLInputElement | null>(null);
  const username = props.username;
  socket.assignState(messages, setMessages);
  useEffect(() => {
    socket.connect(username);
  }, []);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (message) {
      socket.send(message);
    }
  };

  return (
    <div className="msg">
      <form className="input" onSubmit={(e) => sendMessage(e)}>
        <input type="text" name="" id="" ref={messageRef} />
        <button type="submit">Send</button>
      </form>
      <Messages messages={messages} />
    </div>
  );
}

export default Chat;
