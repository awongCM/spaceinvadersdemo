/**
 * Game Entities - Player, Aliens, Missiles, Shields, etc.
 */

import { spriteRenderer } from './sprite-renderer';
import type { Entity, GameContext, AudioManager, GameBoard } from './types';

/**
 * Alien Flock - Controls synchronized alien movement
 */
export class AlienFlock implements Entity {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  public name: string = 'alienFlock';
  public board?: GameBoard;
  
  public invulnrable: boolean = true; // Note: keeping original typo for compatibility
  public dx: number = 10;
  public dy: number = 0;
  public hit: number = 1;
  public lastHit: number = 0;
  public speed: number = 10;
  public max_y: Record<number, number> = {};

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    opts?: any
  ) {}

  draw(canvas: CanvasRenderingContext2D): void {
    // Flock doesn't render itself
  }

  die(): void {
    if (this.board) {
      const nextLevel = this.board.nextLevel();
      if (nextLevel) {
        this.game.loadBoard(this.createNewBoard(nextLevel));
      } else {
        this.game.callbacks.win();
      }
    }
  }

  step(dt: number): boolean {
    if (this.hit && this.hit !== this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy = 0;
    }
    this.dx = this.speed * this.hit;

    const max: Record<number, number> = {};
    let cnt = 0;
    
    this.board?.iterate(function(this: Entity) {
      if (this instanceof Alien) {
        if (!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y;
        }
        cnt++;
      }
    });

    if (cnt === 0) {
      this.die();
    }

    this.max_y = max;
    return true;
  }

  private createNewBoard(level: number): GameBoard {
    // This will be injected by the game manager
    throw new Error('GameBoard constructor not injected');
  }
}

/**
 * Shield - Defensive barrier
 */
export class Shield implements Entity {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  public name: string = '';
  public board?: GameBoard;
  
  public dx: number = 10;
  public dy: number = 0;

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    opts?: any
  ) {}

  draw(canvas: CanvasRenderingContext2D): void {
    spriteRenderer.draw(canvas, this.name, this.x, this.y);
  }

  hit(): void {
    this.audio.play('die');
    this.board?.remove(this);
  }

  step(dt: number): boolean {
    return true;
  }

  die(): void {
    // TODO: Implement shield destruction
  }
}

/**
 * Alien - Individual enemy entity
 */
export class Alien implements Entity {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  public name: string = '';
  public board?: GameBoard;
  
  public flock: AlienFlock;
  public frame: number = 0;
  public mx: number = 0;

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    opts?: any
  ) {
    this.flock = opts?.flock;
  }

  draw(canvas: CanvasRenderingContext2D): void {
    spriteRenderer.draw(canvas, this.name, this.x, this.y, this.frame);
  }

  die(): void {
    this.audio.play('die');
    this.flock.speed += 1;
    this.board?.remove(this);
  }

  step(dt: number): boolean {
    this.mx += dt * this.flock.dx;
    this.y += this.flock.dy;
    
    if (Math.abs(this.mx) > 10) {
      if (this.y === this.flock.max_y[this.x]) {
        this.fireSometimes();
      }
      this.x += this.mx;
      this.mx = 0;
      this.frame = (this.frame + 1) % 2;
      
      if (this.x > this.game.width - spriteRenderer.map.alien1.w * 2) {
        this.flock.hit = -1;
      }
      if (this.x < spriteRenderer.map.alien1.w) {
        this.flock.hit = 1;
      }
    }
    return true;
  }

  fireSometimes(): void {
    if (Math.random() * 100 < 10) {
      this.board?.addSprite(
        'missile',
        this.x + this.w / 2 - spriteRenderer.map.missile.w / 2,
        this.y + this.h,
        { dy: 100 }
      );
    }
  }
}

/**
 * Player - User-controlled ship
 */
export class Player implements Entity {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  public name: string = 'player';
  public board?: GameBoard;
  
  public reloading: number = 20;

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    opts?: any
  ) {}

  draw(canvas: CanvasRenderingContext2D): void {
    spriteRenderer.draw(canvas, 'player', this.x, this.y);
  }

  die(): void {
    this.audio.play('die');
    this.game.callbacks.die();
  }

  step(dt: number): boolean {
    if (this.game.keys['left']) {
      this.x -= 100 * dt;
    }
    if (this.game.keys['right']) {
      this.x += 100 * dt;
    }

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.w) {
      this.x = this.game.width - this.w;
    }

    this.reloading--;

    if (
      this.game.keys['fire'] &&
      this.reloading <= 0 &&
      this.board &&
      this.board.missiles < 3
    ) {
      this.audio.play('fire');
      this.board.addSprite(
        'missile',
        this.x + this.w / 2 - spriteRenderer.map.missile.w / 2,
        this.y - this.h,
        { dy: -100, player: true }
      );
      this.board.missiles++;
      this.reloading = 10;
    }
    return true;
  }
}

/**
 * Missile - Projectile fired by player or aliens
 */
export class Missile implements Entity {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  public name: string = 'missile';
  public board?: GameBoard;
  
  public dy: number;
  public player: boolean;

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    opts?: any
  ) {
    this.dy = opts?.dy || 0;
    this.player = opts?.player || false;
  }

  draw(canvas: CanvasRenderingContext2D): void {
    spriteRenderer.draw(canvas, 'missile', this.x, this.y);
  }

  step(dt: number): boolean {
    this.y += this.dy * dt;

    const enemy = this.board?.collide(this);
    if (enemy) {
      enemy.die();
      return false;
    }
    
    return !(this.y < 0 || this.y > this.game.height);
  }

  die(): void {
    if (this.player && this.board) {
      this.board.missiles--;
      if (this.board.missiles < 0) {
        this.board.missiles = 0;
      }
    }
    this.board?.remove(this);
  }
}
