// Show or hide the popup based on a message from the web page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'sendMessageRequest') {
    chrome.tabs.create({
      active: true,
      url:  'src/options/index.html'
    }, null);
  }
});

