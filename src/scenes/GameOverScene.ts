import Phaser from 'phaser';
import { getHighScore } from '../utils/storage';
import { SoundManager } from '../utils/sound';

interface GameOverData {
  score: number;
  isNewHighScore: boolean;
}

export class GameOverScene extends Phaser.Scene {
  private spaceKeyListener?: () => void;
  private canReturnToMenu: boolean = false;
  private countdownText!: Phaser.GameObjects.Text;
  private menuText!: Phaser.GameObjects.Text;
  private soundManager!: SoundManager;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData) {
    const { width, height } = this.scale;
    const score = data.score || 0;
    const isNewHighScore = data.isNewHighScore || false;
    const highScore = getHighScore();

    // Initialize sound manager and play game over sound
    this.soundManager = new SoundManager(this);
    this.soundManager.init(false); // Don't include startScreen music in game over scene
    this.soundManager.resumeAudioContext();
    this.soundManager.play('gameOver');

    // Reset flag
    this.canReturnToMenu = false;

    // Remove any existing listeners
    if (this.spaceKeyListener && this.input.keyboard) {
      this.input.keyboard.off('keydown-SPACE', this.spaceKeyListener);
    }

    // Game Over text
    this.add.text(width / 2, height / 2 - 120, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff6b6b',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score display
    this.add.text(width / 2, height / 2 - 40, `Your Score: ${score}`, {
      fontSize: '32px',
      color: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // High score display
    this.add.text(width / 2, height / 2 + 20, `High Score: ${highScore}`, {
      fontSize: '28px',
      color: '#ffd700',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // New high score message
    if (isNewHighScore) {
      this.add.text(width / 2, height / 2 + 70, 'NEW HIGH SCORE!', {
        fontSize: '24px',
        color: '#4ecdc4',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    // Countdown text (initially hidden)
    this.countdownText = this.add.text(width / 2, height / 2 + 140, 'Please wait...', {
      fontSize: '20px',
      color: '#888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Return to menu text (initially hidden)
    this.menuText = this.add.text(width / 2, height / 2 + 140, 'Press SPACE to Return to Menu', {
      fontSize: '24px',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setAlpha(0);

    // Start countdown timer (3 seconds)
    let countdown = 3;
    const updateCountdown = () => {
      if (countdown > 0) {
        this.countdownText.setText(`Please wait ${countdown}...`);
        countdown--;
        this.time.delayedCall(1000, updateCountdown);
      } else {
        // Countdown finished, show menu text and enable return
        this.countdownText.setAlpha(0);
        this.menuText.setAlpha(1);
        this.canReturnToMenu = true;

        // Blinking effect for menu text
        this.tweens.add({
          targets: this.menuText,
          alpha: 0.3,
          duration: 800,
          yoyo: true,
          repeat: -1
        });
      }
    };

    this.time.delayedCall(1000, updateCountdown);

    // Return to menu on space key (only after countdown)
    if (this.input.keyboard) {
      this.spaceKeyListener = () => {
        if (this.canReturnToMenu) {
          this.scene.start('MenuScene');
        }
      };
      this.input.keyboard.on('keydown-SPACE', this.spaceKeyListener);
    }
  }
}

