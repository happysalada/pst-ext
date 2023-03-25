// Execute the API request when the extension is installed or reloaded.
chrome.runtime.onInstalled.addListener(() => {
  console.log("install callback ran")
});


