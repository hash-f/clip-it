# Clip it

A browser extension that allows you to save and manage highlights from any webpage, including YouTube videos.

## Features

- 🎯 Highlight and save text from any webpage
- 📺 Special support for YouTube video content
- 🔍 Easy access to your saved highlights
- ⌨️ Keyboard shortcut support (Ctrl+Shift+K to open clips)
- 🎨 Custom styling for highlights
- 💾 Local storage for your clips

## Installation

1. Clone this repository or download the source code
2. Open your browser's extension management page
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Firefox: `about:addons`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the directory containing these files

## Usage

1. **Text Highlighting**

   - Select any text on a webpage
   - Use the context menu or extension popup to save the highlight
   - Your highlights will be saved with custom styling

2. **YouTube Integration**

   - Works seamlessly with YouTube videos
   - Save timestamps and video content
   - Access your saved clips through the extension

3. **Managing Clips**
   - Use Ctrl+Shift+K to open your clips page
   - View, organize, and manage all your saved highlights
   - Custom styling makes your highlights easy to identify

## Project Structure

- `manifest.json` - Extension configuration and permissions
- `background.js` - Background service worker for extension functionality
- `contentScript.js` - Content script for webpage interaction
- `youtubeContent.js` - Specialized content script for YouTube
- `popup.html/js` - Extension popup interface
- `clips.html/js/css` - Clips management page
- `highlight.css` - Styling for highlights
- `mark.min.js` - Text marking library

## Technical Details

This extension is built using:

- Manifest V3
- JavaScript
- HTML/CSS
- Local storage for data persistence

## Permissions

The extension requires the following permissions:

- `contextMenus` - For right-click menu functionality
- `storage` - For saving highlights and preferences

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
