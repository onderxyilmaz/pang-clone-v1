import Phaser from 'phaser';
import { getHighScore } from '../utils/storage';
import { SoundManager } from '../utils/sound';

interface GameOverData {
  score: number;
  isNewHighScore: boolean;
}

export class GameOverScene extends Phaser.Scene {
  private countdownText!: Phaser.GameObjects.Text;
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

    // Countdown text
    this.countdownText = this.add.text(width / 2, height / 2 + 140, 'Please wait...', {
      fontSize: '20px',
      color: '#888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Start countdown timer (3 seconds)
    let countdown = 3;
    const updateCountdown = () => {
      if (countdown > 0) {
        this.countdownText.setText(`Please wait ${countdown}...`);
        countdown--;
        this.time.delayedCall(1000, updateCountdown);
      } else {
        // Countdown finished, automatically return to menu
        this.scene.start('MenuScene');
      }
    };

    this.time.delayedCall(1000, updateCountdown);
  }
}

