// Function to display trust results dynamically with icons
function displayTrustResults(trustData) {
  const resultContainer = document.getElementById("result");

  // Clear any existing results
  resultContainer.innerHTML = '';

  // Example icons for each trust category (you can replace these with actual icons)
  const icons = {
    ssl: "🔒",  // SSL Secured
    fast: "🕒", // Fast Response
    dns: "🌐",  // DNS Verified
    malware: "🚫" // No Malware Found
  };

  // Create result items dynamically based on the trustData
  trustData.forEach(item => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    // Create the icon
    const icon = document.createElement("span");
    icon.textContent = icons[item.icon] || "❓";  // Use the corresponding icon or fallback

    // Create the text
    const text = document.createElement("span");
    text.textContent = item.text;

    // Append the icon and text to the result item
    resultItem.appendChild(icon);
    resultItem.appendChild(text);

    // Append the result item to the result container
    resultContainer.appendChild(resultItem);
  });
}

// Example trust data array (this data comes from the trust evaluation logic)
const trustData = [
  { icon: "ssl", text: "SSL Secured" },
  { icon: "fast", text: "Fast Response" },
  { icon: "dns", text: "DNS Verified" },
  { icon: "malware", text: "No Malware Found" }
];

// Call the function to display results once trust data is evaluated
displayTrustResults(trustData);
