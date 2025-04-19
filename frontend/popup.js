document.getElementById('check-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const domain = new URL(url).hostname;
      checkTrustFactors(url, domain);
    });
  });
  
  // ✅ Main function should be async
  async function checkTrustFactors(url, domain) {
    let results = `<strong>${domain}</strong> Trust Results:<br>`;
  
    // 1. HTTPS Check
    const isHTTPS = url.startsWith("https://");
    results += `- HTTPS: ${isHTTPS ? 'Secure' : 'Not Secure'}<br>`;
  
    // 2. Domain Age (now awaited properly)
   // const domainAge = await getDomainAge(domain);
    //results += `- Domain Age: ${domainAge} years<br>`;
  
    // 3–7. Simulated checks
    const hasContactInfo = checkContactPage(url);
    const hasRefundPolicy = checkRefundPolicy(url);
    const hasRealReviews = checkReviews(url);
    const hasSocialLinks = checkSocialLinks(url);
    const hasTrustBadges = checkTrustBadges(url);
  
    results += `- Contact Information: ${hasContactInfo ? 'Found' : 'Not Found'}<br>`;
    results += `- Refund Policy: ${hasRefundPolicy ? 'Available' : 'Not Available'}<br>`;
    results += `- Reviews: ${hasRealReviews ? 'Verified' : 'None'}<br>`;
    results += `- Social Media: ${hasSocialLinks ? 'Active' : 'Inactive'}<br>`;
    results += `- Trust Badges: ${hasTrustBadges ? 'Found' : 'Not Found'}<br>`;
  
    document.getElementById('result').innerHTML = results;
  }
  
  // ✅ Clean async function
  async function getDomainAge(domain) {
    const apiKey = '23a4e69b9fc24fb792c779580a382d6d'; // Replace with a real key
    try {
      const res = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domain}&outputFormat=JSON`);
      const data = await res.json();
  
      if (!data.WhoisRecord || !data.WhoisRecord.createdDate) return 'Unknown';
  
      const createdDate = new Date(data.WhoisRecord.createdDate);
      const now = new Date();
      console.log(createdDate);
      return now.getFullYear() - createdDate.getFullYear();
    } catch (err) {
      console.error('Error fetching domain age:', err);
      return 'Unknown';
    }
  }
  
  // ✅ Simulated functions
  function checkContactPage(url) {
    return url.includes('contact');
  }
  
  function checkRefundPolicy(url) {
    return url.includes('refund');
  }
  
  function checkReviews(url) {
    return true;
  }
  
  function checkSocialLinks(url) {
    return true;
  }
  
  function checkTrustBadges(url) {
    return true;
  }