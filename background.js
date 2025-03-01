chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "clipIt",
    title: "Clip It",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "clipIt") {
    const highlightData = {
      url: info.pageUrl,
      text: info.selectionText,
      timestamp: Date.now(),
    };

    console.log("Clip saved:", highlightData);

    // Store locally
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const highlights = result.highlights;
      highlights.push(highlightData);
      chrome.storage.local.set({ highlights }, () => {
        console.log("Clip stored locally.");
      });
    });

    // Later: call your API to save highlightData to a database.
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-clips") {
    chrome.tabs.create({ url: "clips.html" });
  }
});
