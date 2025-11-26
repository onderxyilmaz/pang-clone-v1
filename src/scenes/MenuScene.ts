import Phaser from 'phaser';
import { getHighScore } from '../utils/storage';
import { SoundManager } from '../utils/sound';

export class MenuScene extends Phaser.Scene {
  private spaceKeyListener?: () => void;
  private soundManager!: SoundManager;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Initialize sound manager
    this.soundManager = new SoundManager(this);
    this.soundManager.init(true); // Include startScreen music for menu
    
    // Resume audio context and start background music after a short delay
    // This ensures AudioContext is ready
    this.time.delayedCall(100, () => {
      this.soundManager.resumeAudioContext();
      if (!this.soundManager.isPlaying('startScreen')) {
        this.soundManager.play('startScreen');
      }
    });

    // Remove any existing listeners
    if (this.spaceKeyListener && this.input.keyboard) {
      this.input.keyboard.off('keydown-SPACE', this.spaceKeyListener);
    }

    // Title
    this.add.text(width / 2, height / 2 - 100, 'PANG CLONE', {
      fontSize: '48px',
      color: '#fff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // High score display
    const highScore = getHighScore();
    this.add.text(width / 2, height / 2 - 20, `High Score: ${highScore}`, {
      fontSize: '24px',
      color: '#ffd700',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Start game text
    const startText = this.add.text(width / 2, height / 2 + 60, 'Press SPACE to Start', {
      fontSize: '32px',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Blinking effect
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Controls info
    this.add.text(width / 2, height / 2 + 140, 'Arrow Keys: Move | Space: Shoot', {
      fontSize: '18px',
      color: '#888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Start game on space key
    if (this.input.keyboard) {
      this.spaceKeyListener = () => {
        // Stop background music when starting game
        this.soundManager.stop('startScreen');
        this.scene.start('GameScene');
      };
      this.input.keyboard.on('keydown-SPACE', this.spaceKeyListener);
      
      // Also listen for any key press to start music (in case AudioContext needs user interaction)
      this.input.keyboard.on('keydown', () => {
        this.soundManager.resumeAudioContext();
        if (!this.soundManager.isPlaying('startScreen')) {
          this.soundManager.play('startScreen');
        }
      }, this);
      
      // Also listen for mouse click to start music
      this.input.on('pointerdown', () => {
        this.soundManager.resumeAudioContext();
        if (!this.soundManager.isPlaying('startScreen')) {
          this.soundManager.play('startScreen');
        }
      }, this);
    }
  }
}

