chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveHighlight",
    title: "Save Highlight",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveHighlight") {
    const highlightData = {
      url: info.pageUrl,
      text: info.selectionText,
      timestamp: Date.now(),
    };

    console.log("Highlight saved:", highlightData);

    // Store locally
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const highlights = result.highlights;
      highlights.push(highlightData);
      chrome.storage.local.set({ highlights }, () => {
        console.log("Highlight stored locally.");
      });
    });

    // Later: call your API to save highlightData to a database.
  }
});
