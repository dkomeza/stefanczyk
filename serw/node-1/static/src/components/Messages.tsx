import React, { useEffect } from "react";

import Message from "./Message";

function Messages(props: { messages: Message[] | undefined }) {
  const [placeholderHeight, setPlaceholderHeight] = React.useState(0);
  const messages = props.messages;
  const dummy = React.useRef<HTMLDivElement>(null);
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const messagesInnerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dummy.current && messagesRef.current && messagesInnerRef.current) {
      const messagesHeight =
        messagesInnerRef.current.getBoundingClientRect().height;
      const messagesBottom = messagesRef.current.getBoundingClientRect().bottom;
      setPlaceholderHeight(messagesBottom - messagesHeight - 155);
      //   setPlaceholderHeight(
      //     messagesRef.current.getBoundingClientRect().height -
      //       dummy.current.getBoundingClientRect().height -
      //       dummy.current.getBoundingClientRect().top
      //   );
    }
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="messages" ref={messagesRef}>
      <div className="placeholder" style={{ height: placeholderHeight }}></div>
      <div className="messages-inner" ref={messagesInnerRef}>
        {messages &&
          messages.map((message, key) => (
            <Message message={message} key={key} />
          ))}
        <div className="dummy" ref={dummy}></div>
      </div>
    </div>
  );
}

export default Messages;
