import React from 'react';
import ChatMessage from './ChatMessage';
import { Message } from 'ai/react';

function ChatBox({ messages }: { messages: Message[] }) {
  return (
    <div className="chat-box" id="chat-box">
      {messages.map(
        (message: Message) =>
          (message.role === 'user' || message.role === 'assistant') && (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          )
      )}
    </div>
  );
}

export default ChatBox;
