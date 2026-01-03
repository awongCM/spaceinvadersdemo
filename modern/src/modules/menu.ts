/**
 * Game Menu - Menu rendering and navigation
 */

import type { GameContext } from './types';

export class GameMenu {
  private selectedItemIndex: number = 0;
  private fonttype: string = 'Arial';

  constructor(
    private game: GameContext,
    private title: string,
    private menuitems: string[],
    private y: number,
    private size: number,
    private width: number,
    private gameheight: number,
    private gamewidth: number
  ) {}

  render(canvas: CanvasRenderingContext2D): void {
    canvas.textAlign = 'center';
    canvas.fillStyle = 'White';

    let y = this.y;

    // Draw title
    if (this.title) {
      canvas.font = `${Math.floor(this.size * 1.3)}px ${this.fonttype}`;
      canvas.fillStyle = 'White';
      canvas.fillText(this.title, this.gamewidth / 2, this.gameheight / 4);
    }

    // Draw menu items
    for (let i = 0; i < this.menuitems.length; i++) {
      let size = Math.floor(this.size * 0.8);

      if (i === this.selectedItemIndex) {
        canvas.fillStyle = 'rgba(255,255,0,255)';
        size = this.size;
      }

      canvas.font = `${size}px ${this.fonttype}`;
      y += this.size;
      canvas.fillText(this.menuitems[i], this.gamewidth / 2, y);
      canvas.fillStyle = 'White';
    }
  }

  input(dt: number): void {
    const preSelected = this.selectedItemIndex;
    
    if (this.game.keys['up']) {
      this.selectedItemIndex =
        (this.selectedItemIndex + this.menuitems.length - 1) %
        this.menuitems.length;
    }
    if (this.game.keys['down']) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuitems.length;
    }
  }
  
  // Expose currently selected index for external boards
  getSelectedItemIndex(): number {
    return this.selectedItemIndex;
  }
}
