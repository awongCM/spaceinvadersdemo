import type { GameBoard, GameContext } from './types';

export class HelpScreen implements GameBoard {
  public objects: any[] = [];
  public removed_objs: any[] = [];
  public missiles = 0;
  public level = 0;

  constructor(
    private gameContext: GameContext,
    private title: string,
    private lines: string[],
    private onBack?: () => void
  ) {}

  add(obj: any) {
    return obj;
  }
  remove(obj: any): void {}
  addSprite(name: string, x: number, y: number, opts?: any) {
    return {} as any;
  }

  input(dt: number): void {}

  iterate(func: (this: any) => void): void {}

  detect(func: (this: any) => boolean | any): any {
    return false;
  }

  step(dt: number): void {
    if (this.gameContext.keys['fire']) {
      if (this.onBack) this.onBack();
    }
  }

  render(canvas: CanvasRenderingContext2D): void {
    canvas.clearRect(0, 0, this.gameContext.width, this.gameContext.height);
    canvas.textAlign = 'center';
    canvas.fillStyle = 'White';
    canvas.font = 'bold 24px Arial';
    canvas.fillText(this.title, this.gameContext.width / 2, 80);

    canvas.font = '16px Arial';
    let y = 120;
    for (const line of this.lines) {
      canvas.fillText(line, this.gameContext.width / 2, y);
      y += 30;
    }

    canvas.font = '14px Arial';
    canvas.fillText('(Press space to return)', this.gameContext.width / 2, this.gameContext.height - 60);
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
