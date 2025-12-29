/**
 * Space Invaders - Modern TypeScript Edition
 * Main entry point
 */

import './style.css';
import { game } from './modules/game';
import { audioManager } from './modules/audio';
import { spriteRenderer } from './modules/sprite-renderer';
import { levelData, spriteData } from './modules/level-data';
import { GameBoard } from './modules/board';
import { GameScreen } from './modules/screens';

/**
 * Initialize canvas gradient background
 */
function initCanvasGradient(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!;
  ctx.rect(0, 0, canvas.width, canvas.height);
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(1, '#d3d3d3');
  ctx.fillStyle = gradient;
  ctx.fill();
}

/**
 * Start a new game
 */
function startGame(): void {
  const board = new GameBoard(game, audioManager, levelData, 1);
  game.loadBoard(board);
}

/**
 * Show game over screen
 */
function endGame(): void {
  const screen = new GameScreen(
    game,
    'Game Over',
    '(Press space to restart)',
    () => {
      startGame();
    }
  );
  game.loadBoard(screen);
}

/**
 * Show victory screen
 */
function winGame(): void {
  const screen = new GameScreen(
    game,
    'You Win!',
    '(Press space to restart)',
    () => {
      startGame();
    }
  );
  game.loadBoard(screen);
}

/**
 * Show loading screen
 */
function showLoadingScreen(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 30px arial';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
}

/**
 * Show error screen
 */
function showErrorScreen(canvas: HTMLCanvasElement, error: Error): void {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'red';
  ctx.font = 'bold 20px arial';
  ctx.textAlign = 'center';
  ctx.fillText('Failed to load game', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '14px arial';
  ctx.fillText(error.message, canvas.width / 2, canvas.height / 2 + 10);
}

/**
 * Main initialization
 */
async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#gameboard');
  
  if (!canvas) {
    console.error('Canvas element #gameboard not found');
    return;
  }

  // Initialize gradient background
  initCanvasGradient(canvas);
  
  // Show loading screen
  showLoadingScreen(canvas);

  try {
    // Load assets in parallel
    await Promise.all([
      audioManager.load({
        fire: './media/laser.ogg',
        die: './media/explosion.ogg'
      }),
      spriteRenderer.load('./images/sprites.png', spriteData)
    ]);

    // Initialize game
    game.initialize('#gameboard', levelData, spriteData, {
      start: startGame,
      die: endGame,
      win: winGame
    });

    // Show start screen
    const startScreen = new GameScreen(
      game,
      'Space Invaders',
      'Press space to start',
      () => {
        startGame();
      }
    );
    game.loadBoard(startScreen);

    // Start game loop
    game.start();

  } catch (error) {
    console.error('Failed to initialize game:', error);
    showErrorScreen(canvas, error as Error);
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
