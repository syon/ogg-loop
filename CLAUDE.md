# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ogg Loop Editor is a web-based tool for editing loop metadata in .ogg audio files. It displays audio waveforms, allows users to visually identify loop points, and writes loop metadata (Vorbis Comments: LOOPSTART and LOOPLENGTH) directly into the file.

**Technology Stack:**
- Frontend: Nuxt.js 2.15 (SSR disabled, SPA mode)
- UI Framework: Vuetify 2.5
- Audio Visualization: WaveSurfer.js 4.0
- Backend API: Python Flask (serverless functions)
- Audio Metadata: mutagen library (Python)
- Deployment: Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload at localhost:3000
npm run dev

# Linting
npm run lint        # Run all linters
npm run lint:js     # ESLint for .js and .vue files

# Production build
npm run build
npm run start

# Static site generation
npm run generate
```

## Architecture

### Frontend-Backend Communication Flow

1. **File Upload → Metadata Reading:**
   - User drops/selects .ogg file → Vuex store ([store/dropper.js](store/dropper.js))
   - Frontend sends file to `/api/read` → Python Flask endpoint ([api/read/index.py](api/read/index.py))
   - Backend uses mutagen to extract Vorbis comments
   - Frontend receives metadata (LOOPSTART, LOOPLENGTH) and initializes waveform

2. **Waveform Visualization:**
   - [lib/Surf.js](lib/Surf.js) wraps WaveSurfer.js configuration
   - Creates main waveform, minimap, cursor, timeline, and regions plugins
   - Loop region is visual representation of LOOPSTART and LOOPLENGTH
   - Sample rate is hardcoded to 44100 Hz throughout the app

3. **Loop Editing:**
   - User adjusts region visually or via form inputs
   - [components/LoopEditor.vue](components/LoopEditor.vue) syncs region ↔ form values
   - All calculations convert between seconds and samples (samples = seconds * 44100)

4. **Metadata Writing:**
   - User clicks Download → sends file + loop values to `/api/write`
   - Python Flask endpoint ([api/write/index.py](api/write/index.py)) writes Vorbis comments
   - Returns modified .ogg file as blob
   - Frontend triggers browser download via js-file-download

### Key Classes and Utilities

**[lib/Ogg.js](lib/Ogg.js)** - OGG file operations wrapper:
- `scan(myfile)` - POST to /api/read, returns extracted metadata
- `write({ myfile, loopstart, looplength })` - POST to /api/write, returns blob
- `sendUsage(myfile)` - Sends Discord webhook notification (analytics)

**[lib/Surf.js](lib/Surf.js)** - WaveSurfer.js configuration factory:
- `create(options)` - Initializes WaveSurfer with plugins and loop region
- Accepts `loopstart` and `looplength` in samples, converts to seconds
- Returns configured WaveSurfer instance

**[store/dropper.js](store/dropper.js)** - Vuex module for file state:
- Stores uploaded file and its ArrayBuffer representation
- `load` action converts File to DataURL (note: method name is misleading - uses readAsDataURL not readAsArrayBuffer)
- Tracks `lastLoaded` timestamp to trigger waveform refresh

### Important Constants

- **Sample Rate:** 44100 Hz (hardcoded throughout)
- **Conversion:** `samples = seconds * 44100`
- **Metadata Keys:** LOOPSTART (sample position), LOOPLENGTH (sample count)

### Serverless API Structure

The `/api` directory contains Python Flask serverless functions deployed to Vercel:
- Each subdirectory (read/, write/) contains an `index.py` that defines the handler
- Functions are stateless and use temporary files for processing
- Dependencies managed via Vercel's Python runtime (mutagen, Flask)

### UI/UX Features

**Keyboard Shortcuts** (via vue-shortkey):
- Space: Play/Pause
- I/O/P: Zoom controls (reset/out/in)
- G/H/J/K/L: Playback speed (0.2x, 0.5x, 1.0x, 1.5x, 2.0x)
- Arrow keys: Skip forward/backward (5/10 seconds with Shift)
- N/M: Repeat from loop end minus 6/3 seconds

**Loop Controls:**
- Toggle loop on/off (enables region looping)
- Visual region editing with draggable handles
- Form inputs for precise sample-level control
- Auto-sync between visual region and form values

### Notes

- The app loads a sample audio file (TropicalBeach.ogg) on mount for demo purposes
- Discord webhook URL is exposed in nuxt.config.js (consider moving to env vars)
- Vuex store's `readAsArrayBuffer` function actually uses `readAsDataURL` - naming inconsistency
- No automated tests are present in the project
