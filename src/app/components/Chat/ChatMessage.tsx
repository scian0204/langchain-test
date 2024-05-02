import React from 'react';
import ChatObject from './types/ChatObject';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatMessage({ messageType, content }: ChatObject) {
  return (
    <div
      className={`chat-message ${
        messageType === 'user' ? 'sent' : 'received'
      }`}>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}

export default ChatMessage;
