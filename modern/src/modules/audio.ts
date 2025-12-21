/**
 * Audio Manager - Handles game sound effects with channel pooling
 */

import type { AudioChannel } from './types';

export class AudioManager {
  private loadQueue: string[] = [];
  private loadingSounds: number = 0;
  private sounds: Record<string, HTMLAudioElement> = {};
  
  private channelMax: number = 10;
  private audioChannels: AudioChannel[] = [];

  constructor() {
    // Initialize audio channels
    for (let a = 0; a < this.channelMax; a++) {
      this.audioChannels[a] = {
        channel: new Audio(),
        finished: -1
      };
    }
  }

  /**
   * Load audio files asynchronously
   */
  async load(files: Record<string, string>): Promise<void> {
    const loadPromises = Object.entries(files).map(([name, filename]) => 
      this.loadSound(name, filename)
    );
    
    await Promise.all(loadPromises);
  }

  private loadSound(name: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingSounds++;
      const snd = new Audio();
      this.sounds[name] = snd;
      
      snd.addEventListener('canplaythrough', () => {
        this.loadingSounds--;
        resolve();
      }, { once: true });
      
      snd.addEventListener('error', () => {
        reject(new Error(`Failed to load audio: ${filename}`));
      }, { once: true });
      
      snd.src = filename;
      snd.load();
    });
  }

  /**
   * Play a sound using channel pooling
   */
  play(soundName: string): void {
    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    const thistime = new Date();
    
    for (let a = 0; a < this.audioChannels.length; a++) {
      if (this.audioChannels[a].finished < thistime.getTime()) {
        this.audioChannels[a].finished = 
          thistime.getTime() + sound.duration * 1000;
        this.audioChannels[a].channel.src = sound.src;
        this.audioChannels[a].channel.load();
        this.audioChannels[a].channel.play();
        break;
      }
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
