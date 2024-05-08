import React from 'react';
import ChatMessage from './ChatMessage';
import { Message } from 'ai/react';

function ChatBox({
  messages,
  isResWait,
}: {
  messages: Message[];
  isResWait: boolean;
}) {
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
      {isResWait && (
        <ChatMessage role="assistant" content="Llama will respond soon..." />
      )}
    </div>
  );
}

export default ChatBox;
