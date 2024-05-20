const { StringOutputParser } = require('@langchain/core/output_parsers');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { SqlDatabase } = require('langchain/sql_db');
const { DataSource } = require('typeorm');
const express = require('express');
const { ChatOllama } = require('@langchain/community/chat_models/ollama');

const model = new ChatOllama({
  baseUrl: 'http://192.168.5.182:11434', // Default value
  model: 'llama3', // Default value
});

const app = express();
const port = 8080;

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const datasource = new DataSource({
  type: 'mssql',
  database: '*',
  schema: '*',
  host: '*',
  port: 1433,
  username: '*',
  password: '*',
  extra: {
    options: {
      encrypt: false,
    },
  },
});

app.post('/api/chat', async (req, resp) => {
  const { messages } = await req.body;

  const userQuestion = messages.pop().content;

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  const prompt =
    PromptTemplate.fromTemplate(`Based on the SQL table schema provided below, write a "SQL query only" that can answer the user's question.
  ------------
  SCHEMA: {schema}
  ------------
  QUESTION: {question}
  ------------
  SQL QUERY:`);

  const sqlQueryChain = RunnableSequence.from([
    {
      schema: async () => db.getTableInfo(),
      question: (input) => input.question,
    },
    prompt,
    model.bind({ stop: ['\nSQLResultL:'] }),
    new StringOutputParser(),
  ]);

  const res = await sqlQueryChain.invoke({
    question: userQuestion,
  });

  const finalResponsePrompt =
    PromptTemplate.fromTemplate(`Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
  ------------
  SCHEMA: {schema}
  ------------
  QUESTION: {question}
  ------------
  SQL QUERY: {query}
  ------------
  SQL RESPONSE: {response}
  ------------
  NATURAL LANGUAGE RESPONSE:`);

  const finalChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      query: sqlQueryChain,
    },
    {
      schema: async () => db.getTableInfo(),
      question: (input) => input.question,
      query: (input) =>
        input.query.substring(
          input.query.indexOf('SELECT'),
          input.query.indexOf(';') + 1
        ),
      response: (input) => {
        const { query } = input;
        const finalQuery = query.substring(
          query.indexOf('SELECT'),
          query.indexOf(';') + 1
        );
        return db.run(finalQuery);
      },
    },
    finalResponsePrompt,
    model,
    new StringOutputParser(),
  ]);

  const stream = await finalChain.stream({
    question: userQuestion,
  });

  for await (const chunk of stream) {
    resp.write(chunk);
  }
  resp.end();
});

app.listen(app.get('port'), () => {
  console.log(`Express server listen port:${port}`);
  console.log(`http://localhost:${port}`);
});
