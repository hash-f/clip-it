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
