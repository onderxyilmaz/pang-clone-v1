import Phaser from 'phaser';

// Sound manager for game audio
export class SoundManager {
  private scene: Phaser.Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private enabled: boolean = true;
  private audioContextResumed: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Resume AudioContext after user interaction
  resumeAudioContext(): Promise<void> {
    if (this.audioContextResumed) {
      return Promise.resolve();
    }
    
    const sound = this.scene.sound;
    if (sound && (sound as any).context) {
      const context = (sound as any).context;
      if (context.state === 'suspended') {
        return context.resume().then(() => {
          this.audioContextResumed = true;
        }).catch(() => {
          // Ignore errors but still mark as attempted
          this.audioContextResumed = true;
        });
      } else {
        this.audioContextResumed = true;
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  }

  // Initialize sounds from loaded audio files
  init(includeStartScreen: boolean = true) {
    // Load sounds from cache
    if (this.scene.cache.audio.exists('shoot')) {
      this.sounds.set('shoot', this.scene.sound.add('shoot', { volume: 0.5 }));
    }
    if (this.scene.cache.audio.exists('pop')) {
      this.sounds.set('pop', this.scene.sound.add('pop', { volume: 0.5 }));
    }
    if (this.scene.cache.audio.exists('ball')) {
      this.sounds.set('ball', this.scene.sound.add('ball', { volume: 0.5 }));
    }
    if (this.scene.cache.audio.exists('collision')) {
      this.sounds.set('collision', this.scene.sound.add('collision', { volume: 0.5 }));
    }
    if (this.scene.cache.audio.exists('gameOver')) {
      this.sounds.set('gameOver', this.scene.sound.add('gameOver', { volume: 0.5 }));
    }
    // Only add startScreen music if explicitly requested (for MenuScene)
    if (includeStartScreen && this.scene.cache.audio.exists('startScreen')) {
      this.sounds.set('startScreen', this.scene.sound.add('startScreen', { 
        volume: 0.3,
        loop: true 
      }));
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (!sound || !(sound instanceof Phaser.Sound.WebAudioSound)) {
      return;
    }
    
    // If sound is already playing, don't play again
    if (sound.isPlaying) {
      return;
    }
    
    // Resume AudioContext first, then play sound
    this.resumeAudioContext().then(() => {
      try {
        if (!sound.isPlaying) {
          sound.play();
        }
      } catch (e) {
        // If play fails, try again after a short delay
        console.warn(`Failed to play sound ${soundName}, retrying...`, e);
        this.scene.time.delayedCall(100, () => {
          try {
            if (!sound.isPlaying) {
              sound.play();
            }
          } catch (e2) {
            console.error(`Failed to play sound ${soundName} after retry`, e2);
          }
        });
      }
    }).catch(() => {
      // AudioContext resume failed, try to play anyway
      try {
        if (!sound.isPlaying) {
          sound.play();
        }
      } catch (e) {
        console.error(`Failed to play sound ${soundName}`, e);
      }
    });
  }

  stop(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound && sound instanceof Phaser.Sound.WebAudioSound) {
      sound.stop();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      // Stop all sounds when disabled
      this.sounds.forEach(sound => {
        if (sound instanceof Phaser.Sound.WebAudioSound) {
          sound.stop();
        }
      });
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Check if a sound is playing
  isPlaying(soundName: string): boolean {
    const sound = this.sounds.get(soundName);
    if (sound && sound instanceof Phaser.Sound.WebAudioSound) {
      return sound.isPlaying;
    }
    return false;
  }
}

