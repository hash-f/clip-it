// Highlight clips for the current URL
async function highlightExistingClips() {
  try {
    const result = await chrome.storage.local.get({ clips: [] });
    const pageClips = result.clips.filter(
      (clip) => clip.type === "text" && clip.url === window.location.href
    );

    if (pageClips.length > 0) {
      const instance = new Mark(document.body);
      pageClips.forEach((clip) => {
        instance.mark(clip.content, {
          element: "span",
          className: "highlighted-clip",
          accuracy: "exactly",
          separateWordSearch: false,
          acrossElements: true,
        });
      });
    }
  } catch (e) {
    console.error("Error highlighting existing clips:", e);
  }
}

// Call this when the page loads
highlightExistingClips();
