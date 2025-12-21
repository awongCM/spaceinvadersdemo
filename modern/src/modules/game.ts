/**
 * Game Manager - Core game engine with requestAnimationFrame loop
 */

import { spriteRenderer } from './sprite-renderer';
import type { GameContext, GameCallbacks, GameBoard, LevelData, SpriteData } from './types';

const KEY_CODES: Record<number, string> = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  32: 'fire',
  187: 'speedup',   // = key
  189: 'speeddown'  // - key
};

export class GameManager implements GameContext {
  public keys: Record<string, boolean> = {};
  public width: number = 500;
  public height: number = 500;
  public callbacks: GameCallbacks = {
    start: () => {},
    die: () => {},
    win: () => {}
  };
  public board?: GameBoard;

  private canvas!: CanvasRenderingContext2D;
  private canvasElem!: HTMLCanvasElement;
  private levelData!: LevelData;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  private isPaused: boolean = false;
  
  // Speed debugging
  private dx: number = 30;
  private dy: number = 1000;
  private get currentSpeed(): number {
    return this.dx / this.dy;
  }

  /**
   * Initialize game with canvas and callbacks
   */
  initialize(
    canvasSelector: string,
    levelData: LevelData,
    spriteData: SpriteData,
    callbacks: GameCallbacks
  ): void {
    // Get canvas element
    this.canvasElem = document.querySelector<HTMLCanvasElement>(canvasSelector)!;
    if (!this.canvasElem) {
      throw new Error(`Canvas not found: ${canvasSelector}`);
    }

    this.canvas = this.canvasElem.getContext('2d')!;
    this.width = this.canvasElem.width;
    this.height = this.canvasElem.height;

    // Setup keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keypress', this.handleKeyPress);

    this.levelData = levelData;
    this.callbacks = callbacks;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = KEY_CODES[event.keyCode];
    if (key) {
      this.keys[key] = true;
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = KEY_CODES[event.keyCode];
    if (key) {
      this.keys[key] = false;
    }
  };

  private handleKeyPress = (event: KeyboardEvent): void => {
    const key = KEY_CODES[event.keyCode];
    if (key === 'speedup') {
      if (this.dx < 100) {
        this.dx += 10;
        console.log('dx:', this.dx);
      }
    }
    if (key === 'speeddown') {
      if (this.dx > 0) {
        this.dx -= 10;
        console.log('dx:', this.dx);
      }
    }
  };

  /**
   * Load a new game board
   */
  loadBoard(board: GameBoard): void {
    this.board = board;
  }

  /**
   * Main game loop using requestAnimationFrame
   */
  private loop = (timestamp: number = 0): void => {
    if (this.isPaused) return;

    // Calculate actual delta time in seconds
    const dt = this.lastFrameTime
      ? (timestamp - this.lastFrameTime) / 1000
      : 0;
    this.lastFrameTime = timestamp;

    // Cap delta time to prevent spiral of death
    const cappedDt = Math.min(dt, 0.1);

    // Update game state
    if (this.board) {
      this.board.input(cappedDt);
      this.board.step(cappedDt);
      this.board.render(this.canvas);
    }
    
    this.displaySpeed(this.canvas, this.currentSpeed);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Start the game loop
   */
  start(): void {
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Pause the game loop
   */
  pause(): void {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the game loop
   */
  resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Display current speed (for debugging)
   */
  private displaySpeed(canvas: CanvasRenderingContext2D, speed: number): void {
    canvas.font = 'bold 16px arial';
    canvas.fillStyle = '#F3F315';
    const text = `Speed: ${(speed * 1000).toFixed(1)}`;
    canvas.fillText(text, this.width / 2 + 150, this.height / 2 - 230);
  }
}

// Export singleton instance
export const game = new GameManager();
