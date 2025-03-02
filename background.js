chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "clipIt",
    title: "Clip It",
    contexts: ["selection"],
  });
});

function generateClipId() {
  return "clip_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

function cleanUrl(url) {
  try {
    const urlObj = new URL(url);

    // List of parameters to remove
    const paramsToRemove = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "_ga",
    ];

    // Remove tracking parameters
    paramsToRemove.forEach((param) => urlObj.searchParams.delete(param));

    // Remove text fragment (#:~:text=...)
    let hash = urlObj.hash;
    if (hash.includes(":~:text=")) {
      hash = hash.split(":~:text=")[0];
      urlObj.hash = hash;
    }

    // Clean URL string
    let cleanedUrl = urlObj.toString();

    // Remove trailing slash if present
    if (
      cleanedUrl.endsWith("/") ||
      cleanedUrl.endsWith("?") ||
      cleanedUrl.endsWith("#")
    ) {
      cleanedUrl = cleanedUrl.slice(0, -1);
    }

    return cleanedUrl;
  } catch (e) {
    console.error("Error cleaning URL:", e);
    return url;
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "clipIt") {
    const clipData = {
      id: generateClipId(),
      type: "text",
      url: cleanUrl(info.pageUrl),
      content: info.selectionText,
      timestamp: Date.now(),
    };

    chrome.storage.local.get({ clips: [] }, (result) => {
      const clips = result.clips;
      clips.push(clipData);
      chrome.storage.local.set({ clips }, () => {
        console.log("Text clip stored locally.");
      });
    });
  }
});

// Listen for video clip messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveVideoClip") {
    chrome.storage.local.get({ clips: [] }, (result) => {
      const clips = result.clips;
      // Clean URL for video clips too
      message.clipData.url = cleanUrl(message.clipData.url);
      clips.push(message.clipData);
      chrome.storage.local.set({ clips }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-clips") {
    chrome.tabs.create({ url: "clips.html" });
  }
});
