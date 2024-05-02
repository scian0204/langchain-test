export default interface ChatObject {
  messageType: 'user' | 'assistant' | 'system' | 'function';
  content: string;
}
