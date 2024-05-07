import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import ChatObject from '../components/Chat/types/ChatObject';
import model from './OllamaLangchain';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';

async function SendMessage(
  content: string,
  messageLog: ChatObject[],
  addPrompt: string[],
  callBack: (message: string) => void
) {
  const prompt = ChatPromptTemplate.fromMessages([
    ...addPrompt.map((e) => new SystemMessage(e)),
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
  ]);
  const stream = await prompt.pipe(model).stream({
    chat_history: messageLog.map((log) => {
      if (log.messageType === 'assistant') {
        return new AIMessage(log.content);
      } else if (log.messageType === 'user') {
        return new HumanMessage(log.content);
      }
    }),
    input: content,
  });

  let chunks = '';
  for await (const chunk of stream) {
    chunks += chunk.content;
    callBack(chunks);
  }
}

export default SendMessage;
