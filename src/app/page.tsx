'use client';

import React, { useState } from 'react';
import ChatObject from './components/Chat/types/ChatObject';
import ChatBox from './components/Chat/ChatBox';
import { StringOutputParser } from '@langchain/core/output_parsers';
import model from './utils/OllamaLangchain';

function Home() {
  const [messageLog, setMessageLog] = useState<ChatObject[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    setMessage(e.target.value);
  };

  const handleMessageSubmit = async () => {
    const content = message;
    const chatObject: ChatObject = { messageType: 'user', content };
    const temp = [...messageLog, chatObject];
    setMessageLog(temp);
    setMessage('');

    setIsSending(true);
    const stream = await model
      .pipe(new StringOutputParser())
      .stream(`${content}`);

    let chunks = '';
    for await (const chunk of stream) {
      chunks += chunk;
      setMessageLog([...temp, { messageType: 'assistant', content: chunks }]);
    }
    setIsSending(false);
  };

  return (
    <div className="chat-container">
      <ChatBox messages={messageLog} />
      <div>
        <label>
          <input type="checkbox" id="saveLog" />
          대화 기억하기(체크 시점부터 기억)
        </label>
        <label>
          <input type="checkbox" id="resKor" />
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
