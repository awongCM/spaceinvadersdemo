/**
 * Game Board - Entity manager and collision detection
 */

import { spriteRenderer } from './sprite-renderer';
import type { Entity, GameContext, AudioManager, GameBoard as IGameBoard, LevelData } from './types';
import { Alien, AlienFlock } from './entities';

export class GameBoard implements IGameBoard {
  public objects: Entity[] = [];
  public removed_objs: Entity[] = [];
  public missiles: number = 0;
  public level: number;
  public player?: Entity;

  constructor(
    private game: GameContext,
    private audio: AudioManager,
    private levelData: LevelData,
    levelNumber: number
  ) {
    this.level = levelNumber;
    this.loadLevel(this.levelData[levelNumber]);
  }

  add(obj: Entity): Entity {
    obj.board = this;
    this.objects.push(obj);
    return obj;
  }

  remove(obj: Entity): void {
    this.removed_objs.push(obj);
  }

  addSprite(name: string, x: number, y: number, opts?: any): Entity {
    const spriteData = spriteRenderer.map[name];
    if (!spriteData) {
      throw new Error(`Sprite not found: ${name}`);
    }

    const sprite = this.add(new spriteData.cls(this.game, this.audio, opts));
    sprite.name = name;
    sprite.x = x;
    sprite.y = y;
    sprite.w = spriteData.w;
    sprite.h = spriteData.h;
    return sprite;
  }

  input(dt: number): void {
    // For future expansion
  }

  iterate(func: (this: Entity) => void): void {
    for (let i = 0; i < this.objects.length; i++) {
      func.call(this.objects[i]);
    }
  }

  detect(func: (this: Entity) => boolean | Entity): Entity | false {
    for (let i = 0; i < this.objects.length; i++) {
      const result = func.call(this.objects[i]);
      if (result) return this.objects[i];
    }
    return false;
  }

  step(dt: number): void {
    this.removed_objs = [];
    
    this.iterate(function(this: Entity) {
      if (!this.step(dt)) {
        this.die();
      }
    });

    for (let i = 0; i < this.removed_objs.length; i++) {
      const idx = this.objects.indexOf(this.removed_objs[i]);
      if (idx !== -1) {
        this.objects.splice(idx, 1);
      }
    }
  }

  render(canvas: CanvasRenderingContext2D): void {
    canvas.clearRect(0, 0, this.game.width, this.game.height);
    this.iterate(function(this: Entity) {
      this.draw(canvas);
    });
  }

  collision(o1: Entity, o2: Entity): boolean {
    return !(
      o1.y + o1.h - 1 < o2.y ||
      o1.y > o2.y + o2.h - 1 ||
      o1.x + o1.w - 1 < o2.x ||
      o1.x > o2.x + o2.w - 1
    );
  }

  collide(obj: Entity): Entity | false {
    const board = this;
    return this.detect(function(this: Entity) {
      if (obj !== this && !(this as any).invulnrable) {
        return board.collision(obj, this) ? this : false;
      }
      return false;
    });
  }

  loadLevel(level: number[][]): void {
    this.objects = [];
    
    // Add player
    this.player = this.addSprite(
      'player',
      this.game.width / 2,
      this.game.height - spriteRenderer.map.player.h - 15
    );

    // Add shields
    this.addSprite(
      'shield1',
      this.game.width / 2 - 70,
      this.game.height - spriteRenderer.map.shield1.h - 50
    );
    this.addSprite(
      'shield2',
      this.game.width / 2 - 10,
      this.game.height - spriteRenderer.map.shield2.h - 50
    );
    this.addSprite(
      'shield3',
      this.game.width / 2 + 50,
      this.game.height - spriteRenderer.map.shield3.h - 50
    );

    // Add alien flock
    const flock = this.add(new AlienFlock(this.game, this.audio)) as AlienFlock;

    // inject factory so the flock can create a new GameBoard for the next level
    (flock as any).createNewBoard = (level: number): GameBoard => {
      return new GameBoard(this.game, this.audio, this.levelData, level);
    };
    
    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[y].length; x++) {
        const alienType = level[y][x];
        if (alienType) {
          const alienData = spriteRenderer.map['alien' + alienType];
          if (alienData) {
            this.addSprite(
              'alien' + alienType,
              (alienData.w + 10) * x,
              alienData.h * y,
              { flock: flock }
            );
          }
        }
      }
    }
  }

  nextLevel(): number | false {
    const next = this.level + 1;
    return this.levelData[next] ? next : false;
  }
}
