# 🎧 NoCopyrightSounds (NCS) Web Widget

[![NPM Version](https://img.shields.io/npm/v/nocopyrightsounds-widget.svg?style=flat-square&color=1DB954)](https://www.npmjs.com/package/nocopyrightsounds-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A sleek, floating, and **100% CSS-hackable** music player to easily integrate royalty-free music from **NoCopyrightSounds** into any website. 

Built for modern developers: lightweight, persistent across page reloads, and infinitely customizable.

![NCS Widget Preview](https://raw.githubusercontent.com/floriangobin/nocopyrightsounds-widget/main/preview.png)

---

## ✨ Features

* ⚡ **Zero Latency:** Smart background preloading (buffering) for instant track transitions.
* 💾 **State Persistence:** Remembers the current track, volume, and playback progress across page navigation via `localStorage`.
* 🎵 **Full Catalog:** Intelligent random navigation through 60+ historical NCS genres.
* 🛠️ **Limitless Customization (v1.4.0):** The widget is a blank canvas! It exposes the album cover via the `--ncs-cover-img` CSS variable and dynamically injects state classes (`.ncs-is-playing`, `.ncs-is-open`). You can literally reshape the entire player using just CSS.
* 🔌 **Plug & Play:** Official backend API integrated by default. Zero server configuration required.

---

## 📦 Installation

### Via NPM (React, Vue, Angular, Next.js...)
\`\`\`bash
npm install nocopyrightsounds-widget
\`\`\`

### Via CDN (HTML / Vanilla JS)
\`\`\`html
<script type="module">
  import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@latest/src/index.js';
  const player = new NCSWidget();
</script>
\`\`\`

---

## ⚙️ Configuration (JS Options)

You can pass an options object to the constructor to tweak the widget's behavior and default look:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`position\` | String | \`'bottom-right'\` | Screen position (\`bottom-right\`, \`bottom-left\`, \`top-right\`, \`top-left\`). |
| \`offsetX\` / \`offsetY\` | String | \`'25px'\` | Margin from the screen edges (e.g., \`'0px'\`). |
| \`theme\` | String | \`'dark'\` | Base UI theme (\`'dark'\` or \`'light'\`). |
| \`primaryColor\` | String | \`'#1DB954'\` | Main accent color (sliders, active states). |
| \`glassmorphism\`| Boolean| \`false\` | Enables a semi-transparent blurred background. |
| \`hideDownload\` | Boolean| \`false\` | Hides the direct MP3 download icon. |
| \`autoOpen\` | Boolean| \`false\` | Automatically opens the widget on the user's first visit. |
| \`defaultGenre\` | String | \`'all'\` | Starting genre ID (e.g., \`'10'\` for House). |
| \`minWidth\` / \`minHeight\` | String | \`'55px'\` | Dimensions of the minimized button. |
| \`minimizedIcon\`| String | \`'🎧'\` | Text or emoji inside the minimized button. |

---

## 🎨 CSS Cookbook: The "Spinning Vinyl" Example

To show you just how far you can push the customization, here is an example of the creative freedom this widget offers. By combining our JS options and a bit of custom CSS, you can completely transform the standard rectangular player into a **spinning interactive vinyl record**!

### 1. The JavaScript Setup
First, stick the widget to the corner and make it a square:
\`\`\`html
<script type="module">
  import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@1.4.0/src/index.js';

  new NCSWidget({
    position: 'bottom-right',
    offsetX: '0px', 
    offsetY: '0px',
    minWidth: '120px', 
    minHeight: '120px',
    minimizedIcon: '' // Remove the text to leave room for the cover art
  });
</script>
\`\`\`

### 2. The CSS Magic
Copy this code into your website's stylesheet. It uses the `--ncs-cover-img` variable and the `.ncs-is-playing` state class to create a spinning vinyl record that pops out into a full-screen player when clicked!

\`\`\`css
/* --- THE QUARTER VINYL (Minimized State) --- */
.ncs-minimized {
  border-radius: 0 !important;
  background: transparent !important;
  overflow: hidden !important; 
  position: relative;
  box-shadow: none !important;
}

.ncs-minimized::before {
  content: '';
  position: absolute;
  width: 200%; height: 200%; top: 0; left: 0;
  border-radius: 50%;
  background-image: radial-gradient(circle at center, #1e1e2f 0%, #1e1e2f 8%, rgba(0,0,0,0.8) 8.5%, #181818 9%, #181818 25%, transparent 25.5%, transparent 90%, #333 90.5%, #181818 91%, #181818 100%), var(--ncs-cover-img);
  background-size: cover; background-position: center;
  transform-origin: center center;
}

/* Spin animation when music plays */
@keyframes spin { 100% { transform: rotate(360deg); } }
#ncs-persistent-widget.ncs-is-playing:not(.ncs-is-open) .ncs-minimized::before {
  animation: spin 4s linear infinite;
}
#ncs-persistent-widget:not(.ncs-is-open) .ncs-minimized:hover::before { cursor: pointer; filter: brightness(1.15); }

/* --- THE FULL VINYL (Expanded State) --- */
.ncs-expanded {
  width: 360px !important; height: 360px !important;
  border-radius: 50% !important; padding: 30px !important;
  background: transparent !important; border: none !important;
  transform-origin: bottom right;
  display: flex !important; flex-direction: column; justify-content: center; align-items: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8) !important;
}

/* The animated vinyl background */
.ncs-expanded::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%; z-index: -2;
  background-image: radial-gradient(circle at center, #1e1e2f 0%, #1e1e2f 3%, rgba(0,0,0,0.8) 3.5%, rgba(24,24,24, 0.95) 4%, rgba(24,24,24, 0.9) 35%, transparent 35.5%, transparent 85%, #333 85.5%, #181818 86%, #181818 100%), var(--ncs-cover-img);
  background-size: cover; background-position: center;
}
#ncs-persistent-widget.ncs-is-playing .ncs-expanded::before { animation: spin 10s linear infinite; }

/* Dark overlay for text readability */
.ncs-expanded::after { content: ''; position: absolute; inset: 0; border-radius: 50%; z-index: -1; background: radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.2) 100%); pointer-events: none; }

/* Open/Close Animation */
.ncs-expanded:not(.active) { transform: scale(0) rotate(-90deg) !important; opacity: 0; pointer-events: none; }
.ncs-expanded.active { transform: scale(1) rotate(0deg) !important; opacity: 1; }

/* Reorganize internal elements for the circular layout */
.ncs-header, .ncs-track-info, .ncs-progress-container, .ncs-controls, .ncs-bottom-bar { position: relative; z-index: 1; width: 100%; }
.ncs-header strong, .ncs-cover, .ncs-download-btn { display: none !important; }
.ncs-header { position: absolute; top: 35px; right: 50px; justify-content: flex-end !important; }
.ncs-close-btn { background: rgba(255,255,255,0.1) !important; color: white !important; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
.ncs-details { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 10px; }
#ncs-track-name { font-size: 18px !important; color: white !important; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-bottom: 0 !important; }
#ncs-artists { font-size: 13px !important; color: #ccc !important; }
#ncs-genre { max-width: 160px; margin-top: 10px; background: rgba(0,0,0,0.6) !important; color: white !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 20px !important; padding: 6px 15px !important; font-size: 12px !important; text-align: center; }
.ncs-controls { margin: 15px 0 !important; gap: 20px !important; }
.ncs-btn-circle { width: 60px !important; height: 60px !important; background: white !important; color: black !important; }
.ncs-progress-container { width: 80% !important; margin: 0 auto 15px auto !important; }
.ncs-bottom-bar { width: 60% !important; margin: 0 auto !important; justify-content: center !important; }
\`\`\`

---

## 📄 License

Distributed under the MIT License. 
**Disclaimer:** This project is not affiliated with NoCopyrightSounds. All streamed music belongs to their respective creators and NCS.