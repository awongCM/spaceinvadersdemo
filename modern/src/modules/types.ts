/**
 * Type definitions for Space Invaders game
 */

export interface SpriteMetadata {
  sx: number;
  sy: number;
  w: number;
  h: number;
  cls: new (game: GameContext, audio: AudioManager, opts?: any) => Entity;
  frames?: number;
}

export type SpriteData = Record<string, SpriteMetadata>;

export type LevelData = Record<number, number[][]>;

export interface GameCallbacks {
  start: () => void;
  die: () => void;
  win: () => void;
}

export interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  board?: GameBoard;
  draw(canvas: CanvasRenderingContext2D): void;
  step(dt: number): boolean;
  die(): void;
}

export interface GameContext {
  readonly keys: Record<string, boolean>;
  readonly width: number;
  readonly height: number;
  readonly callbacks: GameCallbacks;
  loadBoard(board: GameBoard): void;
}

export interface AudioManager {
  load(files: Record<string, string>): Promise<void>;
  play(soundName: string): void;
}

export interface GameBoard {
  objects: Entity[];
  removed_objs: Entity[];
  missiles: number;
  level: number;
  player?: Entity;
  
  add(obj: Entity): Entity;
  remove(obj: Entity): void;
  addSprite(name: string, x: number, y: number, opts?: any): Entity;
  input(dt: number): void;
  iterate(func: (this: Entity) => void): void;
  detect(func: (this: Entity) => boolean | Entity): Entity | false;
  step(dt: number): void;
  render(canvas: CanvasRenderingContext2D): void;
  collision(o1: Entity, o2: Entity): boolean;
  collide(obj: Entity): Entity | false;
  loadLevel(level: number[][]): void;
  nextLevel(): number | false;
}

export interface AudioChannel {
  channel: HTMLAudioElement;
  finished: number;
}
