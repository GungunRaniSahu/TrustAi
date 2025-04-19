document.getElementById('check-btn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const domain = new URL(url).hostname;
    checkTrustFactors(tab.id, url, domain);
  });
});

// ✅ Main Trust Check Function
async function checkTrustFactors(tabId, url, domain) {
  let results = `<strong>${domain}</strong> Trust Check Results:<br><br>`;

  // 1. HTTPS Check
  const isHTTPS = url.startsWith("https://");
  console.log('Is HTTPS:', isHTTPS);  // Log the result of the HTTPS check

  const hasMixedContent = await checkMixedContent(tabId);
  console.log('Has Mixed Content:', hasMixedContent);  // Log if mixed content was detected

  const isHTTPSSecure = isHTTPS && !hasMixedContent;
  console.log('Is HTTPS Secure:', isHTTPSSecure);  // Log final determination of HTTPS security

  results += `🔒 HTTPS: ${isHTTPSSecure ? '✅ Secure (Encrypted)' : '❌ Not Secure (Unencrypted or Mixed Content)'}<br>`;

  // 2. PCI DSS Compliance Check
  const isPCICompliant = await checkPCICompliance(tabId);
  results += `💳 PCI DSS: ${isPCICompliant ? '✅ Likely Compliant' : '❌ Not Detected'}<br>`;

  document.getElementById('result').innerHTML = results;
}

// ✅ Check for Mixed Content (HTTP resources loaded in HTTPS page)
async function checkMixedContent(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const resources = [
            ...document.querySelectorAll('img[src^="http://"]'),
            ...document.querySelectorAll('script[src^="http://"]'),
            ...document.querySelectorAll('link[href^="http://"]'),
            ...document.querySelectorAll('iframe[src^="http://"]')
          ];
          console.log('Mixed content resources found:', resources.length); // Log number of mixed content resources found
          return resources.length > 0; // Return true if any HTTP resources are found
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          console.error('Error during mixed content check:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(results[0].result);
        }
      }
    );
  });
}

// ✅ PCI DSS Compliance Detection
async function checkPCICompliance(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const text = document.body.innerText.toLowerCase();
          const html = document.body.innerHTML.toLowerCase();

          const keywords = [
            "pci dss",
            "pci compliant",
            "pci certified",
            "payment card industry",
            "secure payment",
            "ssl secure",
            "trust badge",
            "verified by visa",
            "secured by mastercard"
          ];

          const trustImages = Array.from(document.images).some(img =>
            img.alt.toLowerCase().includes("secure") ||
            img.alt.toLowerCase().includes("pci") ||
            img.alt.toLowerCase().includes("verified") ||
            img.src.includes("trust") ||
            img.src.includes("secure")
          );

          console.log('Found PCI-related text or trust images:', keywords.some(keyword => text.includes(keyword)) || trustImages);
          return keywords.some(keyword => text.includes(keyword)) || trustImages;
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          console.error('Error during PCI check:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(results[0].result);
        }
      }
    );
  });
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
