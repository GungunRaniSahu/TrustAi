// This script will be injected into the webpage to analyze its content and determine trustworthiness

async function evaluateTrust(url) {
  const trustData = {
    privacy: 0,
    content: 0,
    credibility: 0,
    integrity: 0,
    totalScore: 0
  };

  // ----- Privacy Check ----- (Checks for HTTPS and privacy-related data)
  if (url.startsWith("https://")) trustData.privacy += 3;
  if (document.cookie && document.cookie.length > 0) trustData.privacy += 1;
  if (navigator.doNotTrack === "1") trustData.privacy += 1;

  // ----- Content Check ----- (Checks for specific content-related information)
  const bodyText = document.body.innerText.toLowerCase();
  if (bodyText.includes("return") || bodyText.includes("refund")) trustData.content += 2;
  if (bodyText.includes("cash on delivery") || bodyText.includes("cod")) trustData.content += 2;
  if (document.images.length > 5) trustData.content += 1;

  // ----- Credibility Check ----- (Checks for domain age and reviews)
  const domain = new URL(url).hostname;
  try {
    const whoisResponse = await fetch(`https://api.whois.vu/?q=${domain}`);
    const whoisData = await whoisResponse.json();
    if (whoisData.created) {
      const domainAge = new Date().getFullYear() - new Date(whoisData.created).getFullYear();
      trustData.credibility += domainAge >= 3 ? 3 : 1;
    }
  } catch {
    trustData.credibility += 1; // fallback in case of error
  }
  if (bodyText.includes("reviews") || bodyText.includes("testimonials")) trustData.credibility += 2;

  // ----- Integrity Check ----- (Checks for fake trust badges and layout)
  const fakeBadgeCheck = bodyText.includes("verified by trust") || bodyText.includes("secured by safety");
  if (!fakeBadgeCheck) trustData.integrity += 3;
  if (document.querySelectorAll("script").length < 20) trustData.integrity += 2;

  // Total trust score calculation
  trustData.totalScore = trustData.privacy + trustData.content + trustData.credibility + trustData.integrity;

  return trustData;
}

// Listening for messages from popup.js or background.js to evaluate the trust of a URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "evaluateTrust") {
    evaluateTrust(message.url).then((result) => {
      sendResponse(result);  // Send the evaluation result back
    });
    return true;  // Indicates that the response is asynchronous
  }
});
