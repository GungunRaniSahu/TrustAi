import { OpenAI } from 'openai';
import * as cheerio from 'cheerio';
import fs from 'fs';

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: 'fec7afa05f9f4884b07b00ad266b6203',
  baseURL: 'https://api.aimlapi.com/v1',
});

// Load HTML file content
fs.readFile('file.html', 'utf-8', async (err, htmlContent) => {
  if (err) {
    console.error('Error reading HTML file:', err);
    return;
  }

  // Parse HTML using Cheerio
  const $ = cheerio.load(htmlContent);

  // Extract reviews (change the selector to match your HTML)
  const reviews = $('.links-text'); // Adjust this to the actual class or element you're targeting

  // Extract text from reviews
  const allReviews = reviews
    .map((i, review) => $(review).text().trim())
    .get()
    .join('\n\n');

  // Log the extracted reviews to verify they are being parsed correctly
  console.log("Extracted Reviews:", allReviews);

  if (!allReviews) {
    console.log("No reviews found. Please check the HTML structure and class names.");
    return;
  }

  // Limit to the first 30,000 characters
  const limitedReviews = allReviews.slice(0, 30000);

  // Prepare the prompt for GPT
  const customPrompt = 'Extract and summarize customer reviews from the following text.';

  // Make a request to OpenAI
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `${customPrompt}\n\n${limitedReviews}`,
        },
      ],
    });

    // Log the response from OpenAI
    console.log("GPT Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
  }
});
