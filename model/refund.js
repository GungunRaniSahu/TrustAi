// refund.js (Backend)
const express = require('express');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_fallback_key',
  baseURL: 'https://api.aimlapi.com/v1',
});

const customPrompt = `Does the page mention a refund policy or return policy? Summarize briefly.

✅ Refund Policy Mentioned:
"We offer 7-day returns on all products."

❌ No refund policy mentioned.`;

app.post('/refund', async (req, res) => {
  try {
    const htmlContent = await fs.readFile('file.html', 'utf-8');
    const $ = cheerio.load(htmlContent);
    const visibleText = $('body').text().replace(/\s+/g, ' ').trim();
    const limitedText = visibleText.slice(0, 30000);

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `${customPrompt}\n\n${limitedText}`,
        },
      ],
    });

    const refundResult = response.choices[0].message.content;
    res.json({ result: refundResult });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('✅ Refund evaluation server running at http://localhost:3000');
});
