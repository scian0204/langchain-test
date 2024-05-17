import model from '@/app/utils/OllamaLangchain';
import { Message, StreamingTextResponse } from 'ai';
import {
  BytesOutputParser,
  StringOutputParser,
} from '@langchain/core/output_parsers';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import getChromaRetriever, {
  combineDocuments,
} from '@/app/utils/getChromaRetriever';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from 'langchain/prompts';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const parser = new BytesOutputParser();

  const chromaRetriever = await getChromaRetriever();

  const userQuestion = messages.pop()!.content;

  const questionPrompt = PromptTemplate.fromTemplate(`
  다음 사용자 질문의 경우 독립형 질문으로 변환합니다.
  {userQuestion}`);

  const questionChain = questionPrompt
    .pipe(model)
    .pipe(new StringOutputParser())
    .pipe(chromaRetriever);

  const documents = await questionChain.invoke({
    userQuestion,
  });

  const combineDocs = combineDocuments(documents);

  const questionTemplate = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    [
      'user',
      `
  귀하는 새로운 개발자나 사용자가 제기하는 질문에 잘 답변하는 랭체인 강사입니다. 아래 질문에 문맥을 사용하여 답하세요.
  문맥을 엄격하게 사용하여 명확하고 정확하게 답변하세요.
  <context>
  {context}
  </context>

  질문: {userQuestion}
  `,
    ],
  ]);

  const answerChain = questionTemplate.pipe(model);

  const stream = await answerChain.pipe(parser).stream({
    chat_history: messages.map((m) =>
      m.role == 'system'
        ? new SystemMessage(m.content)
        : m.role == 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    ),
    context: combineDocs,
    userQuestion: userQuestion,
  });

  return new StreamingTextResponse(stream);
}
