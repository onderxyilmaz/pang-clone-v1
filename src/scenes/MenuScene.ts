import Phaser from 'phaser';
import { getHighScore } from '../utils/storage';
import { SoundManager } from '../utils/sound';
import { GAME_CONFIG } from '../config';

export class MenuScene extends Phaser.Scene {
  private spaceKeyListener?: () => void;
  private soundManager!: SoundManager;
  private backgroundBalls: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Initialize sound manager
    this.soundManager = new SoundManager(this);
    this.soundManager.init(true); // Include startScreen music for menu

    // Check if music is playing, if not start it
    const startScreenMusic = this.sound.get('startScreen');
    if (!startScreenMusic || !startScreenMusic.isPlaying) {
      // Resume audio context and play music
      const soundManager = this.sound as any;
      if (soundManager.context && soundManager.context.state === 'suspended') {
        soundManager.context.resume().then(() => {
          this.sound.play('startScreen', { loop: true, volume: 0.3 });
        });
      } else {
        this.sound.play('startScreen', { loop: true, volume: 0.3 });
      }
    }

    // Disable gravity for menu scene (only balls should float, not fall)
    this.physics.world.gravity.y = 0;

    // Remove any existing listeners
    if (this.spaceKeyListener && this.input.keyboard) {
      this.input.keyboard.off('keydown-SPACE', this.spaceKeyListener);
    }

    // Reset balls array
    this.backgroundBalls = [];

    // Ball configurations (size and color)
    const ballConfigs = [
      { size: GAME_CONFIG.ball.sizes.large, color: GAME_CONFIG.ball.colors.large },
      { size: GAME_CONFIG.ball.sizes.large, color: GAME_CONFIG.ball.colors.medium },
      { size: GAME_CONFIG.ball.sizes.medium, color: GAME_CONFIG.ball.colors.small },
      { size: GAME_CONFIG.ball.sizes.medium, color: GAME_CONFIG.ball.colors.large },
      { size: GAME_CONFIG.ball.sizes.small, color: GAME_CONFIG.ball.colors.medium }
    ];

    // Create 5 balls with random positions and velocities
    ballConfigs.forEach((config) => {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);

      // Create ball sprite
      const ball = this.add.sprite(x, y, 'ball');
      ball.setDisplaySize(config.size * 2, config.size * 2);
      ball.setTint(config.color);
      ball.setAlpha(0.3); // Semi-transparent for background effect

      // Add physics
      this.physics.add.existing(ball);
      const body = ball.body as Phaser.Physics.Arcade.Body;

      // Enable physics body
      body.enable = true;

      // The sprite displaySize is radius*2, and origin is (0.5, 0.5) = centered
      // But physics body uses the original texture size, not displaySize
      // We need to manually set the body size and center it
      const diameter = config.size * 2;

      // Set body as a circle with correct size
      // First, set the body size to match the display size
      body.setSize(diameter, diameter);

      // Then make it circular
      body.setCircle(config.size);

      // Center the body on the sprite
      // Since sprite origin is (0.5, 0.5), we need to offset the body
      // to align with the centered sprite position
      body.setOffset(ball.width / 2 - config.size, ball.height / 2 - config.size);

      // Physics properties
      body.setBounce(1, 1); // Perfect bounce in both X and Y
      body.setCollideWorldBounds(true);
      body.setAllowGravity(false); // Explicitly disable gravity for these balls
      body.setDrag(0, 0); // No drag/friction
      body.setFriction(0, 0); // No friction
      body.setMaxVelocity(250, 250); // Limit max velocity

      // Random velocity - ensure it's not too small
      const angle = Phaser.Math.Between(0, 360);
      const speed = Phaser.Math.Between(150, 200);
      const velocityX = Math.cos(Phaser.Math.DegToRad(angle)) * speed;
      const velocityY = Math.sin(Phaser.Math.DegToRad(angle)) * speed;

      body.setVelocity(velocityX, velocityY);

      // Add to array
      this.backgroundBalls.push(ball);
    });

    // Splash screen logo
    const logo = this.add.image(width / 2, height / 2 - 150, 'splashScreen');
    // Scale the image to fit nicely
    const logoScaleX = (width * 0.6) / logo.width;
    const logoScaleY = 150 / logo.height; // Max height 150px
    const logoScale = Math.min(logoScaleX, logoScaleY);
    logo.setScale(logoScale);
    logo.setDepth(10); // Bring to front

    // High score display
    const highScore = getHighScore();
    const highScoreText = this.add.text(width / 2, height / 2 - 20, `High Score: ${highScore}`, {
      fontSize: '24px',
      color: '#ffd700',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    highScoreText.setDepth(10);

    // Start game text
    const startText = this.add.text(width / 2, height / 2 + 60, 'Press SPACE to Start', {
      fontSize: '32px',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    startText.setDepth(10);

    // Blinking effect
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Controls info
    const controlsText = this.add.text(width / 2, height / 2 + 140, 'Arrow Keys: Move | Space: Shoot', {
      fontSize: '18px',
      color: '#888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    controlsText.setDepth(10);

    // Credit text in bottom right corner
    const creditText = this.add.text(width - 20, height - 20, 'Written by Onder Yilmaz', {
      fontSize: '16px',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(1, 1);
    creditText.setDepth(10);

    // Blinking effect for credit text
    this.tweens.add({
      targets: creditText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on space key
    if (this.input.keyboard) {
      this.spaceKeyListener = () => {
        // Stop background music when starting game
        this.sound.stopByKey('startScreen');
        this.scene.start('GameScene');
      };
      this.input.keyboard.on('keydown-SPACE', this.spaceKeyListener);
    }
  }

  update() {
    // Physics automatically updates ball positions
  }
}

