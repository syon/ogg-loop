# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ogg Loop Editor is a web-based tool for editing loop metadata in .ogg audio files. It displays audio waveforms, allows users to visually identify loop points, and writes loop metadata (Vorbis Comments: LOOPSTART and LOOPLENGTH) directly into the file.

**Technology Stack:**
- Frontend: Nuxt.js 3.14 (SSR disabled, SPA mode)
- UI Framework: Vuetify 3.10
- Audio Visualization: WaveSurfer.js 4.0
- Backend API: Python Flask (serverless functions)
- Audio Metadata: mutagen library (Python)
- Deployment: Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Set up Python virtual environment (required for API development)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Development server (runs both frontend and backend)
npm run dev
# This starts:
#   - Nuxt frontend at localhost:3000 (dev:nuxt)
#   - Flask API server at localhost:3001 (dev:api)
# The frontend proxies /api/* requests to the backend

# Run frontend or backend separately
npm run dev:nuxt    # Frontend only
npm run dev:api     # Backend only (uses venv/bin/python3 api/dev_server.py)

# Linting (note: no linting configuration currently in project)
# Available if configured later

# Production build
npm run build
npm run start

# Static site generation
npm run generate
```

## Architecture

### Frontend-Backend Communication Flow

1. **File Upload → Metadata Reading:**
   - User drops/selects .ogg file → Pinia store ([stores/appState.ts](stores/appState.ts))
   - Frontend sends file to `/api/read` → Python Flask endpoint ([api/read/index.py](api/read/index.py))
   - Backend uses mutagen to extract Vorbis comments
   - Frontend receives metadata (LOOPSTART, LOOPLENGTH) and initializes waveform

2. **Waveform Visualization:**
   - [lib/Surf.js](lib/Surf.js) provides WaveSurfer.js configuration and audio utility functions
   - Creates main waveform, minimap, timeline, and regions plugins
   - Loop region is visual representation of LOOPSTART and LOOPLENGTH
   - Sample rate constant (44100 Hz) and conversion functions are exported from [lib/Surf.js](lib/Surf.js)

3. **Loop Editing:**
   - User adjusts region visually or via form inputs
   - [components/LoopEditor.vue](components/LoopEditor.vue) coordinates UI, delegating to store
   - [stores/appState.ts](stores/appState.ts) manages state and performs calculations using Surf.js utilities
   - All calculations use `samplesToSeconds()` and `secondsToSamples()` functions

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

**[lib/Surf.js](lib/Surf.js)** - WaveSurfer.js configuration and audio utilities:
- `SAMPLE_RATE` - Constant for audio sample rate (44100 Hz)
- `samplesToSeconds(samples)` - Converts sample count to seconds
- `secondsToSamples(seconds)` - Converts seconds to sample count (rounded)
- `calculateLoopEnd(startSample, lengthSample)` - Calculates loop end time in seconds
- `Surf.create(options)` - Initializes WaveSurfer with plugins and loop region
  - Accepts `loopstart` and `looplength` in samples, converts to seconds internally
  - Returns configured WaveSurfer instance with regions plugin

**[stores/appState.ts](stores/appState.ts)** - Pinia store for application state:
- **State:**
  - `file`, `buffer`, `lastLoaded` - File data and metadata
  - `region` - Current loop region (start/end in seconds)
  - `formLoopStartSample`, `formLoopLengthSample` - Form input values (in samples)
  - `audioprocess` - Current playback position (in seconds)
  - `zoom` - Waveform zoom level
- **Getters:**
  - `gSampleStart`, `gSampleEnd`, `gLooplengthSample` - Region values in samples
  - `gFormLoopStartSeconds`, `gFormLoopEndSeconds` - Form values converted to seconds
  - `gSampleStartTime`, `gSampleEndTime`, `gLooplengthTime` - Formatted time strings
  - `gCurrentSample`, `gCurrentTime` - Current playback position
- **Actions:**
  - `load(files)` - Loads file and converts to DataURL
  - `setRegion(region)` - Updates region and syncs form values
  - `updateRegionByForm(startSample, lengthSample)` - Updates region from form inputs
  - `changeZoom(operation)` - Adjusts zoom level (reset/minus/plus)

### Important Constants

- **Sample Rate:** 44100 Hz (defined as `SAMPLE_RATE` in [lib/Surf.js](lib/Surf.js))
- **Conversion Functions:**
  - Samples to seconds: `samplesToSeconds(samples)` → `samples / 44100`
  - Seconds to samples: `secondsToSamples(seconds)` → `Math.round(seconds * 44100)`
- **Metadata Keys:** LOOPSTART (sample position), LOOPLENGTH (sample count)
- **Zoom Step:** 20 units per increment/decrement (defined in store's `changeZoom` action)

### Development vs Production API

**Local Development:**
- [api/dev_server.py](api/dev_server.py) - Flask development server running on port 3001
- Loads `/api/read` and `/api/write` endpoints from their respective index.py files
- Nuxt proxy (nuxt.config.ts) forwards `/api/*` requests from localhost:3000 to localhost:3001
- Must run in Python virtual environment with `venv/bin/python3`

**Production (Vercel):**
- Each `/api` subdirectory (read/, write/) deploys as a separate serverless function
- Each contains an `index.py` that defines the handler (Flask app)
- Functions are stateless and use temporary files for processing
- Dependencies: mutagen (OGG metadata), Flask (HTTP handling)
- Configured in vercel.json with `@vercel/python` builder
- **Python Version:** Vercel only supports Python 3.12 (fixed, cannot be changed)
- Local development may use different Python version (check `.python-version`)

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

### Development Notes

- **Sample File:** The app auto-loads TropicalBeach.ogg on mount for demo purposes
- **Discord Analytics:** Webhook URL is exposed in nuxt.config.ts (consider moving to env vars)
- **State Management:** Uses Pinia ([stores/appState.ts](stores/appState.ts))
- **No Tests:** No automated tests are present in the project
- **Node Version:** Requires Node.js >= 22.0.0 (see package.json engines)
- **Git Branches:** Development on `nuxt3` branch, PRs merge to `master`
- **Python Environment:**
  - Local venv managed in `venv/` directory (gitignored)
  - Dependencies listed in `requirements.txt`
  - `.python-version` specifies version for local development (currently 3.12)
  - Vercel production uses Python 3.12 (fixed by platform)

## Refactoring Guidelines

When refactoring this codebase, follow these principles based on the project maintainer's preferences:

### 1. Centralize Business Logic in Store

**Principle:** Keep calculation logic and state management in the Pinia store, not in components.

**Examples:**
- ✅ **Good:** Create store getters that provide pre-calculated values (e.g., `gFormLoopStartSeconds`, `gFormLoopEndSeconds`)
- ❌ **Bad:** Import utility functions directly into components and perform calculations there
- ✅ **Good:** Store actions handle complex operations (e.g., `changeZoom(operation)`)
- ❌ **Bad:** Components contain switch statements and state manipulation logic

**Rationale:** Components should be thin presentation layers that delegate to the store. This improves:
- Reusability: Other components can use the same computed values
- Testability: Business logic is isolated in the store
- Maintainability: Changes to calculations happen in one place

### 2. Create Utility Functions for Repeated Patterns

**Principle:** Extract repeated calculations into well-named utility functions.

**Examples:**
- ✅ **Good:** Create `samplesToSeconds()` and `secondsToSamples()` functions in [lib/Surf.js](lib/Surf.js)
- ❌ **Bad:** Write `value / 44100` and `value * 44100` throughout the codebase
- ✅ **Good:** Use descriptive function names that reveal intent (e.g., `calculateLoopEnd(startSample, lengthSample)`)
- ❌ **Bad:** Inline arithmetic that requires mental calculation to understand

**Location Strategy:**
- Utility functions belong in [lib/Surf.js](lib/Surf.js)
- Store imports and uses these utilities internally
- Components rarely need to import utilities directly (they use store getters instead)

### 3. Prefer Modern JavaScript Syntax

**Principle:** Use concise, modern JavaScript features to reduce code verbosity.

**Examples:**
- ✅ **Good:** Optional chaining: `waveformRef.value?.playPause()`
- ❌ **Bad:** Nested if statements: `if (waveformRef.value) { waveformRef.value.playPause() }`
- ✅ **Good:** Early returns for guard clauses
- ❌ **Bad:** Deep nesting with multiple conditions

**Benefits:**
- Reduced line count (10+ lines saved in recent refactoring)
- Improved readability through less nesting
- Clearer intent with modern idioms

### 4. Minimize Component State

**Principle:** Move local component state to the store when it represents application state (not just UI state).

**Examples:**
- ✅ **Good:** Zoom level lives in store (`state.zoom`) since it affects the application state
- ❌ **Bad:** Each component maintains its own zoom value
- ✅ **Good:** UI-only state like `loading` or `isPlaying` can remain local to components
- ❌ **Bad:** Moving truly local UI state to the global store

**Decision Criteria:**
- Move to store if: Multiple components need access, or it represents domain state
- Keep local if: Only one component uses it, or it's purely presentational

### 5. Code Clarity Over Cleverness

**Principle:** Optimize for readability and maintainability, not brevity.

**Examples:**
- ✅ **Good:** Named functions that describe what they calculate
- ❌ **Bad:** Inline arrow functions with complex logic
- ✅ **Good:** Clear variable names like `loopstartSec` and `loopendSec`
- ❌ **Bad:** Abbreviated names like `ls` and `le`

**When Reducing Code:**
- Eliminate duplication through abstraction
- Use modern syntax for common patterns
- Don't sacrifice clarity for fewer characters

### Recent Refactoring Wins

**Sample Rate Calculations (2025-01-29):**
- Created `samplesToSeconds()`, `secondsToSamples()`, `calculateLoopEnd()` in [lib/Surf.js](lib/Surf.js)
- Replaced all `/ 44100` and `* 44100` calculations with function calls
- Added store getters `gFormLoopStartSeconds` and `gFormLoopEndSeconds`
- Removed direct utility imports from [components/LoopEditor.vue](components/LoopEditor.vue)
- Result: Intent is clear, calculations are centralized, components are simpler

**Zoom Management (2025-01-29):**
- Moved `zoomVal` state from component to store (`state.zoom`)
- Created `changeZoom(operation)` action to encapsulate logic
- Simplified component method from 15 lines to 3 lines
- Result: State is centralized, logic is reusable, component is thinner

**Optional Chaining (2025-01-29):**
- Replaced `if (waveformRef.value) { ... }` blocks with `waveformRef.value?.method()`
- Affected functions: `playPause`, `handleSkip`, `changeZoom`, `changeSpeed`
- Result: 10 lines saved, reduced nesting, improved readability
