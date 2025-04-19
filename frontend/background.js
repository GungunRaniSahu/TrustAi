chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkWebsiteTrust') {
        const trustData = fetchTrustData(message.url);
        sendResponse({ trustData: trustData });
    }
});

function fetchTrustData(url) {
    // Simulate fetching trust data (e.g., SSL, domain age, reviews)
    return {
        sslValid: true,
        domainAge: 3,
        realReviews: true
    };
}
