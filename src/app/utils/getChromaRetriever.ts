import { OllamaEmbeddings } from 'langchain/embeddings/ollama';
import { Chroma } from 'langchain/vectorstores/chroma';

export function combineDocuments(docs: any) {
  return docs.map((doc: any) => doc.pageContent).join('\n\n');
}

async function getChromaRetriever() {
  const ollamaEmbeddings = new OllamaEmbeddings({
    baseUrl: 'http://192.168.5.182:11434',
    model: 'tinydolphin',
  });

  const vectorStore = await Chroma.fromExistingCollection(ollamaEmbeddings, {
    collectionName: 'myLangchainCollection',
    url: 'http://192.168.5.182:8000',
  });

  return await vectorStore.asRetriever();
}

export default getChromaRetriever;
