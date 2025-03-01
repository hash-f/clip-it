chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "clipIt",
    title: "Clip It",
    contexts: ["selection"],
  });
});

// Helper to generate unique IDs
function generateClipId() {
  return "clip_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "clipIt") {
    const clipData = {
      id: generateClipId(),
      type: "text",
      url: info.pageUrl,
      content: info.selectionText,
      timestamp: Date.now(),
    };

    // Store locally
    chrome.storage.local.get({ clips: { text: [] } }, (result) => {
      const clips = result.clips;
      clips.text.push(clipData);
      chrome.storage.local.set({ clips }, () => {
        console.log("Text clip stored locally.");
      });
    });
  }
});

// Listen for video clip messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveVideoClip") {
    chrome.storage.local.get({ clips: { video: [] } }, (result) => {
      const clips = result.clips;
      clips.video.push(message.clipData);
      chrome.storage.local.set({ clips }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Required for async response
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-clips") {
    chrome.tabs.create({ url: "clips.html" });
  }
});
