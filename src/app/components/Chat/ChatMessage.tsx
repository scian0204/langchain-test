import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
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
      <MarkdownPreview
        source={content}
        wrapperElement={{
          'data-color-mode': 'light',
        }}
        style={{ backgroundColor: 'transparent' }}
        remarkPlugins={[remarkGfm]}
      />
    </div>
  );
}

export default React.memo(ChatMessage);
