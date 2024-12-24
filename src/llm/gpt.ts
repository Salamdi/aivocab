import OpenAI from 'openai';

interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const model = 'gpt-4o-mini';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const test = async () => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model,
  });

  return chatCompletion.choices[0].message.content;
};

export const generateClue = async (word: string, messages: IMessage[]) => {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an alias player. Your job is to explain the word without mentioning the word itself. If the player guesses the word reply "correct!". If not give another clue. Please be helpful, if the player asks for help provide it. For example if they ask for a rhyming word, give it. The word is ${word}.`,
      },
      ...messages,
    ],
    model,
  });

  return chatCompletion.choices[0].message.content;
};

export const play = async (messages: IMessage[]) => {
  const chatCompletion = await client.chat.completions.create({
    messages,
    model,
  });

  return chatCompletion.choices[0].message.content;
};

export const randomWord = async () => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'system', content: 'You are a random word generator. Word should be beginner level. Reply should contain only the word.' }],
    model,
    temperature: 1.5,
  });

  return chatCompletion.choices[0].message.content;
};
