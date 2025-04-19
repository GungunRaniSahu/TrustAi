async function checkSSL(domain) {
    const res = await fetch(`http://localhost:3000/api/check-ssl/${domain}`);
    const data = await res.json();
    document.getElementById('output').textContent =
      `Domain: ${data.domain}\nSSL Status: ${data.sslStatus}`;
  }
  
  // Example: wire this up to a button click
  document.getElementById('checkBtn').addEventListener('click', () => {
    const domain = document.getElementById('domainInput').value.trim();
    checkSSL(domain);
  });
  