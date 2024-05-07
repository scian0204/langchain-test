'use client';

import React, { useRef, useState } from 'react';
import ChatObject from './components/Chat/types/ChatObject';
import ChatBox from './components/Chat/ChatBox';
import SendMessage from './utils/SendMessage';

function Home() {
  const saveLogRef = useRef<HTMLInputElement>(null);
  const [messageLog, setMessageLog] = useState<ChatObject[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [addPrompt, setAddPrompt] = useState<string[]>([]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    setMessage(e.target.value);
  };

  const handleMessageSubmit = async () => {
    setIsSending(true);
    const content = message;
    const chatObject: ChatObject = { messageType: 'user', content };
    const temp: ChatObject[] = [...messageLog, chatObject];
    setMessageLog([
      ...temp,
      { messageType: 'assistant', content: 'Llama will respond soon...' },
    ]);
    setMessage('');

    await SendMessage(content, messageLog, addPrompt, (content) => {
      setMessageLog([...temp, { messageType: 'assistant', content }]);
    });
    setIsSending(false);
  };

  return (
    <div className="chat-container">
      <ChatBox messages={messageLog} />
      <div>
        <label>
          <input type="checkbox" id="saveLog" ref={saveLogRef} />
          대화 기억하기
        </label>
        <label>
          <input
            type="checkbox"
            id="resKor"
            onChange={(e) => {
              if (e.target.checked) {
                setAddPrompt((currentPrmt) => [
                  'Always answer in Korean using Hangul',
                  ...currentPrmt,
                ]);
              } else {
                setAddPrompt((currentPrmt) => {
                  const result = [...currentPrmt];
                  result.shift();
                  return result;
                });
              }
            }}
          />
          한글로 답변받기
        </label>
      </div>
      <div className="input-area">
        <textarea
          value={message}
          onChange={handleMessageChange}
          id="message-input"
          placeholder="Type your message..."
          rows={1}></textarea>
        <button
          id="sendBtn"
          disabled={isSending}
          onClick={handleMessageSubmit}
          className={isSending ? 'disable' : ''}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Home;
