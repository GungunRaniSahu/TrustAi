# TrustAI Advisor  
A GPT-powered trust evaluator for checking if e-commerce sites are safe for Cash on Delivery.

---

##  Features

-  Parses HTML and extracts reviews
-  Uses GPT-4 to evaluate trustworthiness
-  Detects fake reviews, scam indicators, and policy gaps
-  Highlights positive trust signals (SSL, refund policy, contact info)
-  Provides a clear, human-friendly trust summary

---

##  How It Works

1. Loads HTML content of a webpage
2. Extracts reviews using Cheerio
3. Feeds structured data to OpenAI GPT-4 with custom prompt
4. Returns a final evaluation summary (safe/unsafe)

---

## Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/trustai-advisor.git
cd trustai-advisor

### 2. Install dependencies

npm install

3. Run the evaluator

node gpt.mjs

Environment Variables (Optional)
To use your own API credentials, create a .env file in the root:

env

OPENAI_API_KEY=your-openai-api-key
BASE_URL=https://api.aimlapi.com/v1

And make sure your gpt.mjs imports dotenv:

js

import dotenv from 'dotenv';
dotenv.config();

Example Output
text

**Trust Evaluation Summary:**

You should not pre-order just yet without additional research. Do the following first:

- Search for reviews of "<site name>" on Google or YouTube.  
- Check their social media handles (Facebook, Instagram, etc.) to see activity and customer comments.  
- Look for "Trustpilot" or "Sitejabber" ratings.  
- Make sure the site uses HTTPS when placing the order.  
- Prefer Cash on Delivery (COD) if available.

 Acknowledgements
Cheerio

OpenAI

aimlapi.com

yaml
