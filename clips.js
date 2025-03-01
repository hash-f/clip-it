document.addEventListener("DOMContentLoaded", () => {
  const clipsContainer = document.getElementById("clips-container");

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function displayClips() {
    chrome.storage.local.get({ clips: { text: [], video: [] } }, (result) => {
      const { text: textClips, video: videoClips } = result.clips;

      if (textClips.length === 0 && videoClips.length === 0) {
        clipsContainer.innerHTML = "<p>No clips saved yet.</p>";
        return;
      }

      let clipsHTML = "";

      // Display video clips
      if (videoClips.length > 0) {
        clipsHTML += "<h2>Video Clips</h2>";
        const groupedVideoClips = groupByUrl(videoClips);

        clipsHTML += Object.entries(groupedVideoClips)
          .map(([url, clips]) => {
            const videoTitle = clips[0].title;
            return `
              <div class="url-group">
                <h3 class="url-header">
                  <a class="clip-url" href="${url}" target="_blank">${videoTitle}</a>
                </h3>
                ${clips
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map(
                    (clip) => `
                    <div class="clip video-clip">
                      <div class="clip-time-range">
                        ${formatTime(clip.startTime)} - ${
                      clip.endTime ? formatTime(clip.endTime) : "In Progress"
                    }
                      </div>
                      <div class="clip-meta">
                        Date: ${formatDate(clip.timestamp)}
                      </div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            `;
          })
          .join("");
      }

      // Display text clips
      if (textClips.length > 0) {
        clipsHTML += "<h2>Text Clips</h2>";
        const groupedTextClips = groupByUrl(textClips);

        clipsHTML += Object.entries(groupedTextClips)
          .map(
            ([url, clips]) => `
            <div class="url-group">
              <h3 class="url-header">
                <a class="clip-url" href="${url}" target="_blank">${url}</a>
              </h3>
              ${clips
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(
                  (clip) => `
                  <div class="clip">
                    <div class="clip-text">${clip.content}</div>
                    <div class="clip-meta">
                      Date: ${formatDate(clip.timestamp)}
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
          `
          )
          .join("");
      }

      clipsContainer.innerHTML = clipsHTML;
    });
  }

  function groupByUrl(clips) {
    return clips.reduce((groups, clip) => {
      if (!groups[clip.url]) {
        groups[clip.url] = [];
      }
      groups[clip.url].push(clip);
      return groups;
    }, {});
  }

  displayClips();
});
