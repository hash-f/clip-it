class VideoClipper {
  constructor() {
    this.currentClip = null;
    this.clipButton = null;
    this.videoClips = [];
    this.init();
  }

  async init() {
    await this.loadExistingClips();
    this.createClipButton();
    this.updateClipsCount();
  }

  async loadExistingClips() {
    const result = await chrome.storage.local.get({ clips: { video: [] } });
    this.videoClips = result.clips.video.filter(
      (clip) => clip.videoId === this.getVideoId()
    );
  }

  getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v");
  }

  createClipButton() {
    this.clipButton = document.createElement("button");
    this.clipButton.className = "ytp-button clip-button";
    this.clipButton.innerHTML = `
      <span class="clip-icon">⏺</span>
      <span class="clips-count">${this.videoClips.length}</span>
    `;
    this.clipButton.addEventListener("click", () => this.toggleClipping());

    // Insert next to other YouTube controls
    const rightControls = document.querySelector(".ytp-right-controls");
    if (rightControls) {
      rightControls.insertBefore(this.clipButton, rightControls.firstChild);
    }
  }

  updateClipsCount() {
    const countSpan = this.clipButton.querySelector(".clips-count");
    countSpan.textContent = this.videoClips.length;
  }

  async toggleClipping() {
    const video = document.querySelector("video");
    if (!video) return;

    if (!this.currentClip) {
      // Start clipping
      const clipData = {
        id:
          "clip_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        type: "video",
        videoId: this.getVideoId(),
        url: window.location.href,
        title: document.title,
        startTime: video.currentTime,
        timestamp: Date.now(),
      };

      // Save immediately
      await this.saveClip(clipData);

      this.currentClip = clipData;
      this.clipButton.classList.add("clipping");
      this.clipButton.querySelector(".clip-icon").textContent = "⏹";
    } else {
      // Stop clipping
      this.currentClip.endTime = video.currentTime;
      await this.updateClip(this.currentClip);

      this.clipButton.classList.remove("clipping");
      this.clipButton.querySelector(".clip-icon").textContent = "⏺";
      this.currentClip = null;
    }
  }

  async saveClip(clipData) {
    await chrome.runtime.sendMessage({
      action: "saveVideoClip",
      clipData,
    });
    this.videoClips.push(clipData);
    this.updateClipsCount();
  }

  async updateClip(clipData) {
    const result = await chrome.storage.local.get({ clips: { video: [] } });
    const clips = result.clips;
    const index = clips.video.findIndex((clip) => clip.id === clipData.id);
    if (index !== -1) {
      clips.video[index] = clipData;
      await chrome.storage.local.set({ clips });
    }
  }
}

// Initialize when the video player is ready
function initializeClipper() {
  if (document.querySelector("video")) {
    new VideoClipper();
  } else {
    setTimeout(initializeClipper, 1000);
  }
}

initializeClipper();
