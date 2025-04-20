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


---

## 🛠️ How to Install TrustAI Advisor (Chrome Extension) from GitHub

Follow these simple steps to install the TrustAI Advisor extension manually:

###  Prerequisites
- Google Chrome (latest version recommended)

---

### Step 1: Download the Extension Files
1. Visit the GitHub repository: [https://github.com/GungunRaniSahu/TrustAi.git]
2. Click the green **“Code”** button and select **“Download ZIP”**
3. Extract the downloaded ZIP to a folder on your computer

---

###  Step 2: Load the Extension in Chrome
1. Open **Google Chrome**
2. In the address bar, go to:  
   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** (top-right corner toggle)
4. Click on **“Load unpacked”**
5. Select the folder where you extracted the ZIP file

---

###  Step 3: Use the Extension
- Once loaded, the **TrustAI Advisor** icon will appear in the extension toolbar
- Visit any e-commerce site and the extension will analyze and display trust info for the website.

---

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
