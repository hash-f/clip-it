// Retrieve clips for the current URL
chrome.storage.local.get({ highlights: [] }, (result) => {
  const clips = result.highlights.filter(
    (clip) => clip.url === window.location.href
  );

  if (clips.length > 0) {
    const instance = new Mark(document.body);
    clips.forEach((clip) => {
      instance.mark(clip.text, {
        element: "span",
        className: "highlighted-clip",
        accuracy: "exactly",
        separateWordSearch: false,
        acrossElements: true,
      });
    });
  }
});
