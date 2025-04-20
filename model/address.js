const { OpenAI } = require('openai');
const cheerio = require('cheerio');
const fs = require('fs').promises;
require('dotenv').config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: 'BACKGROUND_API_KEY',
  baseURL: 'https://api.aimlapi.com/v1',
});

const customPrompt = `You are a web trust evaluator that checks whether an e-commerce website mentions a clear business address or physical location.

I will give you the HTML content of a webpage. You should analyze the visible text and structure of the page to identify any address, location, or contact information that appears legitimate.

Here’s what to do:
Look through footer, contact section, or any obvious places where address or store information is found.
Determine if a real-world physical address is clearly visible.
Don’t worry about exact formatting — just check if there’s something that looks like a business address.

Give me your output in one of the following two formats:

✅ Address or location is mentioned clearly.  
Detected Address: "..."

❌ No clear address or location was found.

---

Now evaluate the below HTML:
`;

(async () => {
  try {
    // Load HTML file
    const htmlContent = await fs.readFile('file.html', 'utf-8');

    // Extract text using Cheerio
    const $ = cheerio.load(htmlContent);
    const visibleText = $('body').text().replace(/\s+/g, ' ').trim();
    const limitedText = visibleText.slice(0, 30000); // Limit for safety

    // Get GPT output
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `${customPrompt}\n\n${limitedText}`,
        },
      ],
    });

    const addressEvaluationResult = response.choices[0].message.content;

    // Print result
    console.log("✅ GPT Address Evaluation:\n", addressEvaluationResult);

    // Optional: Save result
    // await fs.writeFile('address-eval.txt', addressEvaluationResult);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
