/**
 * Sprite Renderer - Handles sprite sheet loading and rendering
 */

import type { SpriteData } from './types';

export class SpriteRenderer {
  public map: SpriteData = {};
  private image: HTMLImageElement | null = null;

  /**
   * Load sprite sheet asynchronously
   */
  async load(imagePath: string, spriteData: SpriteData): Promise<void> {
    this.map = spriteData;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.image = img;
        resolve();
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load sprite sheet: ${imagePath}`));
      };
      
      img.src = imagePath;
    });
  }

  /**
   * Draw a sprite on the canvas
   */
  draw(
    canvas: CanvasRenderingContext2D,
    sprite: string,
    x: number,
    y: number,
    frame: number = 0
  ): void {
    if (!this.image) {
      throw new Error('Sprites not loaded');
    }

    const s = this.map[sprite];
    if (!s) {
      console.warn(`Sprite not found: ${sprite}`);
      return;
    }

    canvas.drawImage(
      this.image,
      s.sx + frame * s.w, s.sy, s.w, s.h,
      x, y, s.w, s.h
    );
  }
}

// Export singleton instance
export const spriteRenderer = new SpriteRenderer();
