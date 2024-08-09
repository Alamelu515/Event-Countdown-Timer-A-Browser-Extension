chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ events: [] });
    console.log('Event Countdown Timer installed.');
  });
  