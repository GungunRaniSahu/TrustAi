const { OpenAI } = require('openai');
const cheerio = require('cheerio');
const fs = require('fs').promises;
require('dotenv').config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: 'fec7afa05f9f4884b07b00ad266b6203',
  baseURL: 'https://api.aimlapi.com/v1',
});

const customPrompt = `You are a web trust evaluator for e-commerce sites.

I will give you the **HTML content of a webpage**.

Your job is to analyze the HTML and determine whether the page is trustworthy for online shopping. Look for these signals:

Positive Trust Signals:
Is HTTPS used (SSL valid)?
Does it seem like an old/trusted domain? (Check for clues in metadata if available)
Is there an About Us or Contact page with real-looking info?
Is a Refund Policy present and clearly written?
Are there user reviews that seem real and not fake or repeated?
Are there working links to real social media accounts (Instagram, Facebook, etc.)?
Is a secure payment gateway used (Razorpay, Paytm, Stripe, etc.)?
Are trust badges like Norton, SSL Secure, or McAfee present?`;

(async () => {
  try {
    const htmlContent = await fs.readFile('file.html', 'utf-8');
    const $ = cheerio.load(htmlContent);

    const reviews = $('.links-text');
    const allReviews = reviews
      .map((i, review) => $(review).text().trim())
      .get()
      .join('\n\n');

    const limitedReviews = allReviews.slice(0, 30000);

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `${customPrompt}\n\n${limitedReviews}`,
        },
      ],
    });

    const trustSummary = response.choices[0].message.content;

    console.log("✅ Trust Evaluation Summary:\n");
    console.log(trustSummary);

    // Optional save
    // await fs.writeFile('trust-summary.txt', trustSummary);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
