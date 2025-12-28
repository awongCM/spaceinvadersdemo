# Space Invaders - Legacy vs Modern

A side-by-side comparison of a classic Space Invaders game implemented in two different approaches:

- **Legacy Edition**: Vanilla JavaScript + jQuery + Canvas API
- **Modern Edition**: TypeScript + Vite + Modern ES6+ Modules

## ✨ Features

- 🕹️ Classic Space Invaders gameplay
- 🎮 Both implementations running simultaneously
- 📦 Self-contained build systems for each version
- 🚀 Production-ready static builds
- 🔄 Independent development workflows

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for both the legacy and modern editions.

### 2. Build Both Games

```bash
npm run build
```

Or use the build script directly:

```bash
./build.sh
```

### 3. Serve and Play

```bash
npm run serve
```

Then open your browser to:

```
http://localhost:8000/index.html
```

You'll see both games running side-by-side! 🎉

## 📁 Project Structure

```
spaceinvadersdemo/
├── index.html          # Landing page showing both games
├── build.sh            # Master build script
├── package.json        # Root scripts and commands
│
├── legacy/             # Legacy Edition (Vanilla JS)
│   ├── main.html       # Game entry point
│   ├── js/             # Game logic files
│   │   ├── sprite.js
│   │   ├── game-logic.js
│   │   ├── game-menu.js
│   │   └── level.js
│   ├── css/            # Styles
│   ├── images/         # Sprite sheets
│   ├── media/          # Sound effects
│   ├── build.js        # Legacy build script
│   └── dist/           # Built output (after build)
│
└── modern/             # Modern Edition (TypeScript)
    ├── index.html      # Game entry point
    ├── src/            # TypeScript source files
    │   ├── main.ts
    │   └── modules/
    │       ├── game.ts
    │       ├── entities.ts
    │       ├── board.ts
    │       └── ...
    ├── public/         # Static assets
    ├── package.json    # Modern dependencies
    └── dist/           # Built output (after build)
```

## 🎮 Controls

- **Arrow Keys** - Move left/right
- **Spacebar** - Fire missiles
- **+ / - Keys** - Adjust speed (Legacy only, debug feature)

## 🛠️ Available Commands

From the project root:

```bash
# Installation
npm run install:all      # Install all dependencies

# Building
npm run build            # Build both games
npm run build:legacy     # Build legacy only
npm run build:modern     # Build modern only
npm run clean            # Remove all build outputs

# Development
npm run dev:legacy       # Develop legacy (port 8080)
npm run dev:modern       # Develop modern (Vite dev server)

# Serving
npm run serve            # Serve the landing page (port 8000)
```

## 🔧 Development Workflow

### Legacy Edition

```bash
cd legacy
# Edit files in js/, css/, images/, media/
# Test by opening main.html directly or:
python3 -m http.server 8080
# Rebuild when ready:
npm run build
```

### Modern Edition

```bash
cd modern
# Edit files in src/
npm run dev  # Hot module reloading!
# Build when ready:
npm run build
```

### Both Games Together

1. Make changes to either codebase
2. Run `npm run build` from root
3. Run `npm run serve` from root
4. Open `http://localhost:8000/index.html`

## 📦 Deployment

To deploy to static hosting (Netlify, Vercel, GitHub Pages, etc.):

1. Run the build:

   ```bash
   npm run build
   ```

2. Upload the entire project directory (including `legacy/dist/` and `modern/dist/`)

3. Set `index.html` as the entry point

The landing page will automatically serve both games from their dist folders.

## 🎯 What's Different?

### Legacy Edition

- Classic JavaScript patterns
- jQuery for DOM manipulation
- Single file architecture
- Global state management
- Immediate execution

### Modern Edition

- TypeScript with type safety
- Modular ES6+ architecture
- Vite for fast builds
- Class-based entity system
- Strict mode compilation

## 🤝 Contributing

Feel free to explore both implementations and see how the same game logic can be expressed in different paradigms!

## 📝 License

MIT

---

**Enjoy the comparison!** 🚀👾
