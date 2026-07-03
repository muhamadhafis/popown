// content.js - YouTube AI Companion content script
console.log("YouTube AI Companion Content Script Active");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "seekTo") {
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = request.seconds;
      // If video is paused, play it
      if (video.paused) {
        video.play().catch(err => console.log("Failed to autoplay video after seek:", err));
      }
      sendResponse({ success: true, currentTime: video.currentTime });
    } else {
      sendResponse({ success: false, error: "Video element not found on this page." });
    }
  } else if (request.action === "getCurrentTime") {
    const video = document.querySelector("video");
    if (video) {
      sendResponse({ success: true, currentTime: video.currentTime });
    } else {
      sendResponse({ success: false, error: "Video element not found." });
    }
  }
  return true; // Keep the message channel open for async response
});
