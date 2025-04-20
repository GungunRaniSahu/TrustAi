document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const domain = new URL(url).hostname;

    await checkTrustFactors(tab.id, url, domain);

    const websiteNameTd = document.getElementById('website-name');
    if (websiteNameTd) {
      websiteNameTd.innerText = domain;
    }
  });

  const settingsIcon = document.getElementById('settings-icon');
  const closeIcon = document.getElementById('close-icon');
  const settingsPanel = document.getElementById('settings-panel');

  if (settingsIcon && settingsPanel) {
    if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
      settingsPanel.style.display = 'block';
    } else {
      settingsPanel.style.display = 'none';
    }
  }

  if (closeIcon) {
    closeIcon.addEventListener('click', () => {
      window.close();
    });
  }

  const darkToggle = document.querySelector('.dark-mode-toggle');
  const mainContainer = document.getElementById('main-container');

  if (darkToggle && mainContainer) {
    darkToggle.addEventListener('click', () => {
      mainContainer.classList.toggle('dark-mode');
      console.log("Dark mode toggled");
    });
  }
});

async function checkTrustFactors(tabId, url, domain) {
  const trustItems = [];

  // 1. HTTPS Check
  const isHTTPS = url.startsWith("https://");
  trustItems.push(createResultItem('🔒', 'SSL Secured', isHTTPS ? 'green' : 'red'));

  // 2. PCCI Compliance Check
  const isPCCICompliant = await checkPCCICompliance(tabId);
  trustItems.push(createResultItem('📜', 'PCCI Compliant', isPCCICompliant ? 'green' : 'red'));

  // 3. DNS Verified (Placeholder)
  trustItems.push(createResultItem('🌐', 'DNS Verified', 'green'));

  // 4. Malware Check (Placeholder)
  trustItems.push(createResultItem('🛡️', 'No Malware Detected', 'green'));

  // Wrap every 2 items in a flex row
  let results = '';
  for (let i = 0; i < trustItems.length; i += 2) {
    results += `
      <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 10px;">
        ${trustItems[i]}
        ${trustItems[i + 1] || ''}
      </div>
    `;
  }

  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = results;
    resultDiv.style.display = 'block';
  }
}

function createResultItem(icon, text, color) {
  return `
    <div style="
      flex: 1;
      display: flex; 
      align-items: center; 
      padding: 10px;
      border: 1px solid ${color}; 
      border-radius: 8px;
      background-color: #f9f9f9;
      font-size: 14px;
      color:black;
    ">
      <span style="color: ${color}; font-size: 18px; margin-right: 10px;">${icon}</span>
      <span>${text}</span>
    </div>
  `;
}

async function checkPCCICompliance(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const bodyText = document.body.innerText.toLowerCase();
          const keywords = [
            'pci dss',
            'pci compliant',
            'razorpay',
            'stripe',
            'paypal',
            'paytm',
            'secured by',
            'ssl secure',
            'verified by visa',
            'mastercard securecode',
            'https://secure.',
            'trust badge'
          ];

          const strongKeywords = ['pci dss', 'pci compliant', 'ssl secure'];
          let score = 0;

          keywords.forEach(keyword => {
            if (bodyText.includes(keyword)) {
              score += strongKeywords.includes(keyword) ? 2 : 1;
            }
          });

          return score >= 3;
        },
      },
      (result) => {
        if (chrome.runtime.lastError || !result || !result[0]) {
          console.error('Error during PCCI check:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(result[0].result);
        }
      }
    );
  });
  
}
