document.getElementById('check-btn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const domain = new URL(url).hostname;
    checkTrustFactors(tab.id, url, domain);
  });
});

document.getElementById('ai-review-btn').addEventListener('click', async () => {
  try {
    // Get the active tab in the current window
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      console.error("❌ Could not get active tab or URL.");
      return;
    }

    // Extract the domain from the tab's URL
    const domain = new URL(tab.url).hostname;

    // Call your custom function to trigger AI-based review
    runAIReview(tab.id, domain);

  } catch (error) {
    console.error("❌ Error in AI review button click handler:", error);
  }
});


// ✅ Main Trust Check Function
async function checkTrustFactors(tabId, url, domain) {
  let results = `<strong>${domain}</strong> Trust Check Results:<br><br>`;

  const isHTTPS = url.startsWith('https://');
  results += ` HTTPS: ${isHTTPS ? '✅ Secure' : '❌ Not Secure'}<br>`;

  const isPCICompliant = await checkPCICompliance(tabId);
  results += ` PCI DSS: ${isPCICompliant ? '✅ Likely Compliant' : '❌ Not Detected'}<br>`;

  const hasRefundPolicy = await checkRefundPolicy(tabId);
  results += ` Refund Policy: ${hasRefundPolicy ? '✅ Found' : '❌ Not Found'}<br>`;

  const hasAddress = await checkAddressPresence(tabId);
  results += ` Address: ${hasAddress ? '✅ Present' : '❌ Not Detected'}<br>`;

  document.getElementById('result').innerHTML = results;
}

// ✅ PCI DSS Compliance Detection
async function checkPCICompliance(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const text = document.body.innerText.toLowerCase();
        const html = document.body.innerHTML.toLowerCase();
        const keywords = [
          "pci dss", "pci compliant", "pci certified",
          "payment card industry", "secure payment",
          "ssl secure", "trust badge", "verified by visa", "secured by mastercard"
        ];
        const trustImages = Array.from(document.images).some(img =>
          img.alt.toLowerCase().includes("secure") ||
          img.alt.toLowerCase().includes("pci") ||
          img.alt.toLowerCase().includes("verified") ||
          img.src.includes("trust") ||
          img.src.includes("secure")
        );
        return keywords.some(keyword => text.includes(keyword)) || trustImages;
      },
    }, (results) => {
      resolve(results?.[0]?.result || false);
    });
  });
}

// ✅ Refund Policy Detection
async function checkRefundPolicy(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const text = document.body.innerText.toLowerCase();
        const hasRefund = text.includes("refund policy") ||
          text.includes("refund") ||
          text.includes("return policy") ||
          Array.from(document.links).some(link =>
            link.href.toLowerCase().includes("refund") ||
            link.href.toLowerCase().includes("return")
          );
        return hasRefund;
      },
    }, (results) => {
      resolve(results?.[0]?.result || false);
    });
  });
}

// ✅ Address Detection
async function checkAddressPresence(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const text = document.body.innerText.toLowerCase();
        const addressIndicators = ["address", "street", "city", "zip", "pincode"];
        return addressIndicators.some(indicator => text.includes(indicator));
      },
    }, (results) => {
      resolve(results?.[0]?.result || false);
    });
  });
}

// ✅ AI Review Functionality
async function runAIReview(tabId, domain) {
  document.getElementById('result').innerHTML = `🤖 Running AI Review for <strong>${domain}</strong>...`;

  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const text = document.body.innerText;
      return text.length > 1000 ? text.slice(0, 3000) : text;
    },
  }, async (results) => {
    if (!results || !results[0]) {
      document.getElementById('result').innerHTML = `❌ Could not extract content for AI Review.`;
      return;
    }

    const content = results[0].result;
    const response = await fakeAIReview(content);

    document.getElementById('result').innerHTML = `<strong>${domain}</strong> AI Review:<br><br>${response}`;
  });
}

// ✅ Simulated AI Review (Replace with real API if needed)
async function fakeAIReview(text) {
  if (text.toLowerCase().includes("scam") || text.toLowerCase().includes("too good to be true")) {
    return `⚠️ This site contains potentially risky or suspicious content. Be cautious.`;
  }
  return `✅ No obvious signs of malicious or deceptive content were detected in a quick scan.`;
}

// ✅ Toggle Settings Panel
const settingsIcon = document.getElementById('settings-icon');
const closeIcon = document.getElementById('close-icon');
const settingsPanel = document.getElementById('settings-panel');

if (settingsIcon) {
  settingsIcon.addEventListener('click', () => {
    settingsPanel.style.display = (settingsPanel.style.display === 'block') ? 'none' : 'block';
  });
}

if (closeIcon) {
  closeIcon.addEventListener('click', () => {
    window.close();
  });
}
