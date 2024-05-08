import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatMessage({
  role,
  content,
}: {
  role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool';
  content: string;
}) {
  return (
    <div className={`chat-message ${role === 'user' ? 'sent' : 'received'}`}>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}

export default React.memo(ChatMessage);
