document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const highlightsDiv = document.getElementById("highlights");
    result.highlights.forEach((h) => {
      const div = document.createElement("div");
      div.className = "highlight";
      div.textContent = `${h.text} (from ${h.url})`;
      highlightsDiv.appendChild(div);
    });
  });
});

document.getElementById("viewClips").addEventListener("click", () => {
  chrome.tabs.create({ url: "clips.html" });
});
