document.addEventListener("DOMContentLoaded", () => {
  const clipsContainer = document.getElementById("clips-container");

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function displayClips() {
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const clips = result.highlights;

      if (clips.length === 0) {
        clipsContainer.innerHTML = "<p>No clips saved yet.</p>";
        return;
      }

      // Group clips by URL
      const groupedClips = clips.reduce((groups, clip) => {
        if (!groups[clip.url]) {
          groups[clip.url] = [];
        }
        groups[clip.url].push(clip);
        return groups;
      }, {});

      // Create HTML for each group
      const groupsHTML = Object.entries(groupedClips)
        .map(([url, urlClips]) => {
          const sortedClips = urlClips.sort(
            (a, b) => b.timestamp - a.timestamp
          );
          const clipsHTML = sortedClips
            .map(
              (clip) => `
                <div class="clip">
                  <div class="clip-text">${clip.text}</div>
                  <div class="clip-meta">
                    Date: ${formatDate(clip.timestamp)}
                  </div>
                </div>
              `
            )
            .join("");

          return `
            <div class="url-group">
              <h2 class="url-header">
                <a class="clip-url" href="${url}" target="_blank">${url}</a>
              </h2>
              ${clipsHTML}
            </div>
          `;
        })
        .join("");

      clipsContainer.innerHTML = groupsHTML;
    });
  }

  displayClips();
});
