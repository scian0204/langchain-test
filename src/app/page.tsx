'use client';

import React from 'react';
import ChatBox from './components/Chat/ChatBox';
import { useChat } from 'ai/react';

function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      streamMode: 'text',
      initialMessages: [
        {
          role: 'system',
          content: 'Always answer in Korean using Hangul',
          id: 'resKor',
        },
      ],
    });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    handleInputChange(e);
  };

  return (
    <div className="chat-container">
      <ChatBox messages={messages} />
      <form className="input-area" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={handleMessageChange}
          id="message-input"
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}></textarea>
        <button
          id="sendBtn"
          disabled={isLoading}
          className={isLoading ? 'disable' : ''}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Home;
