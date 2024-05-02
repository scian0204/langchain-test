import { ChatOllama } from '@langchain/community/chat_models/ollama';

const model = new ChatOllama({
  baseUrl: 'http://192.168.5.182:11434', // Default value
  model: 'llama3', // Default value
});

export default model;
