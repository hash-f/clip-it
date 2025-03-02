document.addEventListener("DOMContentLoaded", () => {
  const clipsContainer = document.getElementById("clips-container");
  const searchBox = document.querySelector(".search-box");
  const sortDateBtn = document.getElementById("sortDate");
  const sortUrlBtn = document.getElementById("sortUrl");

  let allClips = [];
  let currentSort = "date";
  let searchTerm = "";

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function formatDateHeading(timestamp) {
    return new Date(timestamp).toLocaleDateString();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function groupByDate(clips) {
    const groups = {};
    clips.forEach((clip) => {
      const date = formatDateHeading(clip.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(clip);
    });

    // Sort dates in reverse chronological order
    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }

  function groupByUrl(clips) {
    const groups = {};
    clips.forEach((clip) => {
      if (!groups[clip.url]) {
        groups[clip.url] = [];
      }
      groups[clip.url].push(clip);
    });

    // Sort URLs alphabetically
    return Object.entries(groups).sort(([urlA], [urlB]) =>
      urlA.localeCompare(urlB)
    );
  }

  function sortClips(clips, sortBy) {
    if (!Array.isArray(clips)) {
      console.error("Expected array for clips, got:", clips);
      return [];
    }

    if (sortBy === "date") {
      return [...clips].sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === "url") {
      return [...clips].sort((a, b) => a.url.localeCompare(b.url));
    }
    return clips;
  }

  function filterClips(clips, term) {
    if (!Array.isArray(clips)) {
      console.error("Expected array for clips, got:", clips);
      return [];
    }

    if (!term) return clips;
    term = term.toLowerCase();
    return clips.filter((clip) => {
      const searchableContent = [
        clip.url.toLowerCase(),
        clip.type === "text" ? clip.content.toLowerCase() : "",
        clip.type === "video" ? clip.title.toLowerCase() : "",
      ].join(" ");
      return searchableContent.includes(term);
    });
  }

  function renderClip(clip) {
    if (clip.type === "video") {
      return `
        <div class="clip video-clip">
          <div class="clip-content">
            <div class="clip-header">
              <div class="clip-title">${clip.title}</div>
              <button class="delete-btn" data-clip-id="${clip.id}">×</button>
            </div>
            <div class="clip-time-range">
              ${formatTime(clip.startTime)} - ${
        clip.endTime ? formatTime(clip.endTime) : "In Progress"
      }
            </div>
          </div>
          <div class="clip-meta">
            <div>Date: ${formatDate(clip.timestamp)}</div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="clip">
          <div class="clip-header">
            <div class="clip-text">${clip.content}</div>
            <button class="delete-btn" data-clip-id="${clip.id}">×</button>
          </div>
          <div class="clip-meta">
            <div>Date: ${formatDate(clip.timestamp)}</div>
          </div>
        </div>
      `;
    }
  }

  function displayClips() {
    let filteredClips = filterClips(allClips, searchTerm);

    if (filteredClips.length === 0) {
      clipsContainer.innerHTML = searchTerm
        ? "<p>No clips match your search.</p>"
        : "<p>No clips saved yet.</p>";
      return;
    }

    let clipsHTML = "";
    if (currentSort === "date") {
      const groupedByDate = groupByDate(filteredClips);
      clipsHTML = groupedByDate
        .map(
          ([date, clips]) => `
          <div class="clips-group">
            <h2 class="group-header">${date}</h2>
            ${clips.map(renderClip).join("")}
          </div>
        `
        )
        .join("");
    } else {
      const groupedByUrl = groupByUrl(filteredClips);
      clipsHTML = groupedByUrl
        .map(
          ([url, clips]) => `
          <div class="clips-group">
            <h2 class="group-header">
              <a href="${url}" target="_blank">${
            clips[0].type === "video" ? clips[0].title : url
          }</a>
            </h2>
            ${clips
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(renderClip)
              .join("")}
          </div>
        `
        )
        .join("");
    }

    clipsContainer.innerHTML = clipsHTML;

    // Add event listeners to delete buttons after rendering
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const clipId = e.target.dataset.clipId;
        try {
          const result = await chrome.storage.local.get({ clips: [] });
          const clips = result.clips.filter((clip) => clip.id !== clipId);
          await chrome.storage.local.set({ clips });
          allClips = clips; // Update local state
          displayClips();
        } catch (e) {
          console.error("Error deleting clip:", e);
        }
      });
    });
  }

  // Event Listeners
  sortDateBtn.addEventListener("click", () => {
    currentSort = "date";
    sortDateBtn.classList.add("active");
    sortUrlBtn.classList.remove("active");
    displayClips();
  });

  sortUrlBtn.addEventListener("click", () => {
    currentSort = "url";
    sortUrlBtn.classList.add("active");
    sortDateBtn.classList.remove("active");
    displayClips();
  });

  searchBox.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    displayClips();
  });

  // Load clips
  chrome.storage.local.get({ clips: [] }, (result) => {
    console.log("Result:", result);
    allClips = Array.isArray(result.clips) ? result.clips : [];
    console.log("Loaded clips:", allClips);
    displayClips();
  });
});
