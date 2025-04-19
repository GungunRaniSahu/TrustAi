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
  let results = `<strong>${domain}</strong> Trust Results:<br>`;

  // 1. HTTPS Check
  const isHTTPS = url.startsWith("https://");
  results += `- HTTPS: ${isHTTPS ? 'Secure' : 'Not Secure'}<br>`;

  // 2. PCCI Compliance Check (via scripting)
  const isPCCICompliant = await checkPCCICompliance(tabId);
  results += `- PCCI: ${isPCCICompliant ? 'Compliant' : 'Not Compliant'}<br>`;

  document.getElementById('result').innerHTML = results;
}

// ✅ Check PCCI Compliance by scanning page content
async function checkPCCICompliance(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const bodyText = document.body.innerText.toLowerCase();
          return (
            bodyText.includes('pcci certified') ||
            bodyText.includes('platform compliance') ||
            bodyText.includes('verified by pcci')
          );
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          console.error('Error during PCCI check:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(results[0].result);
        }
      }
    );
  });
}

// ✅ Settings panel toggle
const settingsIcon = document.getElementById('settings-icon');
const closeIcon = document.getElementById('close-icon');
const settingsPanel = document.getElementById('settings-panel');

settingsIcon.addEventListener('click', () => {
  settingsPanel.style.display = (settingsPanel.style.display === 'block') ? 'none' : 'block';
});

closeIcon.addEventListener('click', () => {
  window.close();
});
