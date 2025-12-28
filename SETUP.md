# Space Invaders - Setup Instructions

This project contains both a **Legacy Edition** (vanilla JavaScript) and a **Modern Edition** (TypeScript + Vite) of Space Invaders that can run side-by-side.

## Project Structure

```
spaceinvadersdemo/
├── index.html          # Landing page (shows both games)
├── build.sh            # Build script for both games
├── package.json        # Root package.json with helper scripts
├── legacy/             # Legacy game (vanilla JS + jQuery)
│   ├── main.html       # Entry point
│   ├── js/             # Game logic
│   ├── css/            # Styles
│   ├── images/         # Sprites
│   ├── media/          # Audio
│   └── dist/           # Build output (generated)
└── modern/             # Modern game (TypeScript + Vite)
    ├── src/            # TypeScript source
    ├── public/         # Static assets
    └── dist/           # Build output (generated)
```

## Prerequisites

- Node.js (v14 or higher)
- npm
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Quick Start - Production Build (Recommended)

This approach builds both games and serves them from a single server:

### Step 1: Install Dependencies

```bash
npm run install:all
```

Or manually:

```bash
cd legacy && npm install
cd ../modern && npm install
cd ..
```

### Step 2: Build Both Games

```bash
npm run build
```

Or use the build script directly:

```bash
./build.sh
```

This creates production builds:

- `legacy/dist/` - Built legacy game
- `modern/dist/` - Built modern game

### Step 3: Serve and View

Start a local server from the project root:

```bash
npm run serve
# or
python3 -m http.server 8000
```

Open in browser:

```
http://localhost:8000/index.html
```

✅ **Both games will load from their build folders!**

## What You Should See

- **Left Side:** Legacy Edition (vanilla JS + jQuery)
- **Right Side:** Modern Edition (TypeScript + Vite)
- Both games are fully playable and independent
- Both are served from their production builds

## Development Workflow

If you want to develop on either game with live reloading:

### Legacy Development

```bash
cd legacy
# Open main.html in your browser or serve it
python3 -m http.server 8080
# Visit http://localhost:8080/main.html
```

### Modern Development

```bash
cd modern
npm run dev
# Visit http://localhost:5173
```

### Building Individual Games

```bash
# Build legacy only
npm run build:legacy

# Build modern only
npm run build:modern

# Build both
npm run build
```

## Controls

- **Arrow Keys:** Move left/right
- **Spacebar:** Fire missiles
- **+ / - Keys:** Adjust game speed (debug feature in legacy version)

## Helper Scripts

All available npm scripts from the root:

```bash
npm run install:all  # Install dependencies for both games
npm run build        # Build both games
npm run build:legacy # Build legacy game only
npm run build:modern # Build modern game only
npm run serve        # Serve the landing page (port 8000)
npm run dev:legacy   # Develop legacy game (port 8080)
npm run dev:modern   # Develop modern game (Vite dev server)
npm run clean        # Remove all build outputs
```

## Deployment

To deploy to a static hosting service (Netlify, Vercel, GitHub Pages, etc.):

1. Run `npm run build` to create production builds
2. Upload the entire project root (including `legacy/dist/` and `modern/dist/`)
3. Set `index.html` as the entry point

The landing page will serve both games from their respective dist folders.

## Troubleshooting

### Build Errors

**Legacy build fails:**

- Make sure you're in the `legacy/` directory
- Node.js must be installed (the build script uses Node's fs module)

**Modern build fails:**

- Check that TypeScript and Vite are installed: `cd modern && npm install`
- Check for TypeScript errors in the source files

### Games Not Loading

1. Make sure you've run the build step: `npm run build`
2. Check that `legacy/dist/` and `modern/dist/` folders exist
3. Ensure you're serving from the project root, not from inside legacy or modern folders
4. Open browser console (F12) to check for errors

### Clean Build

If you encounter issues, try a clean build:

```bash
npm run clean  # Removes all dist folders
npm run build  # Rebuilds everything
```

## File Structure

```
spaceinvadersdemo/
├── index.html          # Landing page (shows both games)
├── build.sh            # Build script for both games
├── package.json        # Root package.json with helper scripts
├── legacy/             # Legacy game (vanilla JS + jQuery)
│   ├── main.html       # Entry point
│   ├── js/             # Game logic
│   ├── css/            # Styles
│   ├── images/         # Sprites
│   ├── media/          # Audio
│   ├── build.js        # Build script
│   └── dist/           # Build output (generated)
└── modern/             # Modern game (TypeScript + Vite)
    ├── index.html      # Entry point
    ├── src/            # TypeScript source
    ├── public/         # Static assets
    └── dist/           # Build output (generated)
```

---

**Enjoy comparing the Legacy and Modern implementations!** 🚀
