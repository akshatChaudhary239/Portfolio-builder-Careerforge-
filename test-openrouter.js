const { createOpenAI } = require('@ai-sdk/openai');
const { generateText } = require('ai');


const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function testModel(modelName) {
  try {
    const { text } = await generateText({
      model: openrouter(modelName),
      prompt: 'say hi',
    });
    console.log(`Success with ${modelName}:`, text);
    return true;
  } catch (err) {
    console.error(`Error with ${modelName}:`, err.message);
    return false;
  }
}

async function run() {
  const models = [
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'google/gemini-2.0-pro-exp-02-05:free',
    'google/gemini-2.5-flash-free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-coder-32b-instruct:free'
  ];
  for (const m of models) {
    const success = await testModel(m);
    if (success) break;
  }
}

run();
