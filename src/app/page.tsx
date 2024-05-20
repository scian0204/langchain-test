'use client';

import React, { useState } from 'react';
import ChatBox from './components/Chat/ChatBox';
import { useChat } from 'ai/react';

function Home() {
  const [isResWait, setIsResWait] = useState(false);
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
      onResponse: () => {
        setIsResWait(false);
      },
      api: '/api/chat',
    });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    handleInputChange(e);
  };

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsResWait(true);
    handleSubmit(e);
  };

  return (
    <div className="chat-container">
      <ChatBox messages={messages} isResWait={isResWait} />
      <form className="input-area" onSubmit={handleMessageSubmit}>
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
