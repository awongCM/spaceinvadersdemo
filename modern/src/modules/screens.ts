/**
 * Game Screens - Start, Game Over, Win screens
 */

import { game } from './game';
import { GameMenu } from './menu';
import { HelpScreen } from './help-screen';
import type { GameContext, GameBoard } from './types';

export class GameScreen implements GameBoard {
  public objects: any[] = [];
  public removed_objs: any[] = [];
  public missiles: number = 0;
  public level: number = 0;

  private title: string = 'Space Invaders';
  private gameMenu: GameMenu;

  constructor(
    private gameContext: GameContext,
    text: string,
    text2: string,
    private callback?: () => void
  ) {
    this.title = text;
    const menus = ['Play', 'Settings', 'Help', 'Credits'];
    this.gameMenu = new GameMenu(
      gameContext,
      this.title,
      menus,
      200,
      40,
      50,
      gameContext.height,
      gameContext.width
    );
  }

  add(obj: any): any {
    return obj;
  }

  remove(obj: any): void {}

  addSprite(name: string, x: number, y: number, opts?: any): any {
    return {};
  }

  input(dt: number): void {
    if (this.gameContext.keys['up'] && this.callback) {
      this.gameMenu.input(dt);
    }
    if (this.gameContext.keys['down'] && this.callback) {
      this.gameMenu.input(dt);
    }
  }

  iterate(func: () => void): void {}

  detect(func: () => boolean): any {
    return false;
  }

  step(dt: number): void {
    if (this.gameContext.keys['fire']) {
      const idx = this.gameMenu.getSelectedItemIndex();

      if (idx === 0 && this.callback) {
        this.callback();
      } else if (idx === 2) {
        const lines = [
          'Left Arrow: Move Left',
          'Right Arrow: Move Right',
          'Space: Fire',
          '+ : Speed Up',
          '- : Speed Down'
        ];

        this.gameContext.loadBoard(
          new HelpScreen(this.gameContext, 'Help — Controls', lines, () => this.gameContext.loadBoard(this))
        );
      }
    }
  }

  render(canvas: CanvasRenderingContext2D): void {
    canvas.clearRect(0, 0, this.gameContext.width, this.gameContext.height);
    this.gameMenu.render(canvas);
  }

  collision(o1: any, o2: any): boolean {
    return false;
  }

  collide(obj: any): any {
    return false;
  }

  loadLevel(level: number[][]): void {}

  nextLevel(): number | false {
    return false;
  }
}
