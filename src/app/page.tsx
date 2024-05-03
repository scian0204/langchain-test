'use client';

import React, { useRef, useState } from 'react';
import ChatObject from './components/Chat/types/ChatObject';
import ChatBox from './components/Chat/ChatBox';
import model from './utils/OllamaLangchain';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

function Home() {
  const saveLogRef = useRef<HTMLInputElement>(null);
  const [messageLog, setMessageLog] = useState<ChatObject[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [addPrompt, setAddPrompt] = useState<ChatObject[]>([]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    setMessage(e.target.value);
  };

  const handleMessageSubmit = async () => {
    const content = message;
    const chatObject: ChatObject = { messageType: 'user', content };
    const temp: ChatObject[] = [...messageLog, chatObject];
    setMessageLog([
      ...temp,
      { messageType: 'assistant', content: 'Llama will respond soon...' },
    ]);
    setMessage('');

    setIsSending(true);
    const prompt = ChatPromptTemplate.fromMessages([
      ...addPrompt.map((e): [string, string] => [e.messageType, e.content]),
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);
    const stream = await prompt.pipe(model).stream({
      chat_history: saveLogRef.current?.checked
        ? messageLog.map((log) => {
            if (log.messageType === 'assistant') {
              return new AIMessage(log.content);
            } else if (log.messageType === 'user') {
              return new HumanMessage(log.content);
            }
          })
        : [],
      input: content,
    });

    let chunks = '';
    for await (const chunk of stream) {
      chunks += chunk.content;
      setMessageLog([...temp, { messageType: 'assistant', content: chunks }]);
    }
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
                setAddPrompt([
                  {
                    messageType: 'system',
                    content: 'Always answer in Korean using Hangul',
                  },
                ]);
              } else {
                setAddPrompt([]);
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
