import React from "react";

interface Message {
  from: string;
  content: string;
  date: string;
  type: "incoming" | "outgoing" | "connect" | "disconnect";
}

function Message(props: { message: Message }) {
  const { message } = props;
  return <div>{message.content}</div>;
}

export default Message;
export type { Message };
