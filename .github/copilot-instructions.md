# Space Invaders Game - AI Coding Instructions

## Project Overview

Classic Space Invaders HTML5 game built with vanilla JavaScript and Canvas API. Single-file HTML entry point with modular JS architecture and spritesheet-based rendering.

## Architecture

### Core Game Loop

- **[game-logic.js](../js/game-logic.js)** contains the central `Game` object (singleton) managing:
  - Canvas initialization and dimensions (500x500)
  - Keyboard input mapping (KEY_CODES)
  - Main loop via `Game.loop()` running every 30ms
  - Speed adjustment system (dx/dy ratio, adjustable via +/- keys for debugging)

### Entity System

Entities follow a consistent pattern with `draw()`, `step(dt)`, and `die()` methods:

- **[sprite.js](../js/sprite.js)** defines game entities:

  - `AlienFlock`: Moves all aliens synchronously; manages collective hit direction and speed escalation
  - `Alien`: Individual alien with frame animation (2 frames), occasionally fires missiles
  - `Player`: Controlled by arrow keys, fires missiles with 10-frame reload, bounded movement
  - `Missile`: Travels at constant speed (dy: ±100), handles collision detection with `player` flag
  - `Shield`: Static defensive sprites (3 per level), no behavior yet

- **[level.js](../js/level.js)** defines:
  - `levelData`: 2D arrays (11x3 grid) where 0=empty, 1=alien1, 2=alien2
  - `spriteData`: Metadata for all sprites (spritesheet coordinates, dimensions, class mapping)

### Game Board & Collision

`GameBoard` in [game-logic.js](../js/game-logic.js#L108) manages:

- Entity collection lifecycle (`add`, `remove`, `iterate`, `detect`)
- Collision detection using AABB: `collision(o1, o2)` checks bounding boxes
- Level progression: calls `AlienFlock.die()` on victory or next level
- Removed objects tracked in `removed_objs` array, purged post-step

### Rendering

- `Sprites` singleton loads spritesheet ([js/sprite.js](../js/sprite.js#L49)) and draws with frame offsets
- Spritesheet path hardcoded: `'images/sprites.png'`
- Sprite coordinates in spriteData: sx/sy (source coords), w/h (dimensions)

## Key Developer Workflows

### Adding a New Entity Type

1. Define class in [sprite.js](../js/sprite.js) with `draw(canvas)`, `step(dt)`, `die()` methods
2. Add sprite metadata to `spriteData` in [level.js](../js/level.js) with class reference
3. Add sprite image to `images/sprites.png` and update sx/sy coordinates
4. Spawn via `GameBoard.addSprite(name, x, y, opts)`

### Modifying Game Speed

- Adjust `dx` (pixels/frame) during gameplay: press + to increase, - to decrease
- Default: dx=30 pixels over 1000ms = 0.03 px/ms (displayed as "Speed")
- All alien movement scales with `flock.dx`; missile speed is absolute

### Level Data Format

Each level is an 11x3 grid in [level.js](../js/level.js#L3):

- 0 = empty space
- 1 = alien1 sprite type
- 2 = alien2 sprite type
- Grid position (x,y) spawns sprite at `(x * (w+10), y * h)` where w/h from spriteData

### Testing & Debugging

- Open [main.html](../main.html) in browser; no build step required
- Console logs game speed on +/- key presses
- Missiles capped at 3 per player
- Alien flock speeds up by 1 each alien death

## Conventions & Patterns

### Variable Naming

- `dt` = delta time (seconds since last frame), passed through entire entity update chain
- Underscore-prefixed variables (`_lastHit`) reserved but not widely used; prefer direct properties
- Audio/key state accessed via global `Game.keys` object

### Collision & Physics

- All position checks use integer coordinates
- Collision is AABB: no rotation/scale
- Invincibility: `invulnrable` property (note: typo in original, spelled 'invulnrable')
- Bullet origin: spawned at entity center minus half-width

### Entity Lifecycle

- `step(dt)` returns `true` to persist, `false` to die
- `die()` handles cleanup (e.g., missile count decrement, board removal)
- Removed entities stored in queue, spliced after iteration to prevent index corruption

### Menu System

`GameMenu` in [game-menu.js](../js/game-menu.js) renders text-based menus:

- Constructor takes title, items array, position, font size
- Menu.Input(dt) handles up/down navigation
- Menu.Render(canvas) draws with yellow highlight on selection

## External Dependencies

- jQuery 1.10.2 (for DOM queries and event binding, [js/jquery-1.10.2.min.js](../js/jquery-1.10.2.min.js))
- Canvas 2D context for rendering
- Web Audio API for sound playback (GameAudio in [game-logic.js](../js/game-logic.js#L183))

## Common Pitfalls

- Missile count tracking (`board.missiles`) must decrement in `Missile.die()` or count drifts
- AlienFlock tracks `max_y` per x-coordinate to determine firing aliens; updates each step
- Shield sprites are placed but behavior is stubbed (TODO comment in [sprite.js](../js/sprite.js#L45))
- Spritesheet must exist at correct path; no fallback rendering
