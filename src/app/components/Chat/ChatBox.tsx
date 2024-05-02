import React from 'react';
import ChatObject from './types/ChatObject';
import ChatMessage from './ChatMessage';

function ChatBox({ messages }: { messages: ChatObject[] }) {
  return (
    <div className="chat-box" id="chat-box">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          messageType={message.messageType}
          content={message.content}
        />
      ))}
    </div>
  );
}

export default ChatBox;
