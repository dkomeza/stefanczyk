import React from "react";

interface Message {
  from: string;
  content: string;
  date: string;
  type: "incoming" | "outgoing" | "connect" | "disconnect";
}

function Message(props: { message: Message }) {
  const { message } = props;
  return (
    <div className={`message ${message.type}`}>
      <div className="message__content">
        <div className="message__content__text">{message.content}</div>
      </div>
      <div className="message-info">
        {message.type === "incoming" && (
          <div className="message-info__username">{message.from}</div>
        )}
        <div className="message__content__date">{message.date}</div>
      </div>
      <div className="message-arrow"></div>
    </div>
  );
}

export default Message;
export type { Message };
