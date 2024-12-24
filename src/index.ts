import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { generateClue, play, randomWord, test } from './llm/gpt';

const app = new Hono();

app.get('/test', async (c) => {
  const result = await test();
  return c.json({ result });
});

const sumSchema = z.object({
  a: z.number(),
  b: z.number(),
});

app.post('/sum', zValidator('json', sumSchema), (c) => {
  const { a, b } = c.req.valid('json');
  return c.json({ answer: a + b });
});

const generateClueSchema = z.object({
  word: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ),
});

app.post(
  '/generate-clue',
  zValidator('json', generateClueSchema),
  async (c) => {
    const { word, messages } = c.req.valid('json');
    const message = await generateClue(word, messages);
    return c.json({ message });
  },
);

const playSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    }),
  ),
});

app.post('/play', zValidator('json', playSchema), async (c) => {
  const { messages } = c.req.valid('json');
  const message = await play(messages);
  return c.json({ message });
});

app.get('/random', async (c) => {
  const word = await randomWord();
  return c.json({ word });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
