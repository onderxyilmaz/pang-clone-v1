import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { Player } from '../classes/Player';
import { Rope } from '../classes/Rope';
import { Ball, BallSize } from '../classes/Ball';
import { updateHighScore } from '../utils/storage';
import { SoundManager } from '../utils/sound';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private ropes!: Phaser.GameObjects.Group;
  private balls!: Phaser.GameObjects.Group;
  private score: number = 0;
  private lives: number = GAME_CONFIG.lives;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private shootKey!: Phaser.Input.Keyboard.Key;
  private canShoot: boolean = true;
  private shootCooldown: number = 300; // milliseconds
  private shootCooldownTimer?: Phaser.Time.TimerEvent;
  private gameStarted: boolean = false;
  private countdownText!: Phaser.GameObjects.Text;
  private soundManager!: SoundManager;
  private ballHitBottomCooldown: Map<Ball, number> = new Map();
  private ceilingY!: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Initialize sound manager (without startScreen music)
    this.soundManager = new SoundManager(this);
    this.soundManager.init(false); // Don't include startScreen music in game scene
    // Resume audio context for game sounds
    this.soundManager.resumeAudioContext();
    
    // Stop startScreen music if it's playing from MenuScene
    // Access the sound directly from Phaser's sound manager
    const startScreenSound = this.sound.get('startScreen');
    if (startScreenSound && startScreenSound.isPlaying) {
      startScreenSound.stop();
    }

    // Reset game state
    this.score = 0;
    this.lives = GAME_CONFIG.lives;
    this.canShoot = true;
    this.gameStarted = false;
    
    // Clear any existing timers
    if (this.shootCooldownTimer) {
      this.time.removeEvent(this.shootCooldownTimer);
      this.shootCooldownTimer = undefined;
    }

    // Create player at bottom of screen
    this.player = new Player(this, width / 2, GAME_CONFIG.height - GAME_CONFIG.player.height / 2);

    // Create groups
    this.ropes = this.add.group();
    this.balls = this.add.group();

    // Temporarily disable physics world gravity during countdown
    this.physics.world.gravity.y = 0;

    // Spawn initial balls without initial velocity (will start after countdown)
    this.spawnBalls(GAME_CONFIG.ballSpawnCount, 'large', false);

    // UI
    // Score at top left
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#fff',
      fontFamily: 'Arial'
    });

    // Lives at top right
    this.livesText = this.add.text(width - 20, 20, `Lives: ${this.lives}`, {
      fontSize: '24px',
      color: '#ff6b6b',
      fontFamily: 'Arial'
    }).setOrigin(1, 0); // Right align

    // Horizontal line below score and lives (ceiling)
    const lineY = 60; // Position below text (20 + 24px font + 16px spacing)
    const lineGraphics = this.add.graphics();
    lineGraphics.lineStyle(2, 0xffffff, 1); // 2px width, white color, full opacity
    lineGraphics.moveTo(0, lineY);
    lineGraphics.lineTo(width, lineY);
    lineGraphics.strokePath();
    
    // Store ceiling Y position for rope max height
    this.ceilingY = lineY;

    // Countdown text
    this.countdownText = this.add.text(width / 2, height / 2, '3', {
      fontSize: '72px',
      color: '#4ecdc4',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Shooting input - create fresh key
    if (this.input.keyboard) {
      this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Collisions - use collideWorldBounds: false for ropes to ensure they can collide
    this.physics.add.overlap(
      this.ropes,
      this.balls,
      this.handleRopeBallCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.balls,
      this.handlePlayerBallCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Start countdown
    this.startCountdown();
  }

  private startCountdown() {
    let countdown = 3;
    
    const updateCountdown = () => {
      if (countdown > 0) {
        this.countdownText.setText(countdown.toString());
        // Pulse effect
        this.tweens.add({
          targets: this.countdownText,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });
        countdown--;
        this.time.delayedCall(1000, updateCountdown);
      } else {
        // Countdown finished - start the game
        this.countdownText.setText('GO!');
        this.tweens.add({
          targets: this.countdownText,
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.countdownText.destroy();
            this.gameStarted = true;
            
            // Ensure player is at bottom position
            const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
            if (playerBody) {
              playerBody.y = GAME_CONFIG.height - GAME_CONFIG.player.height / 2;
              playerBody.setVelocity(0, 0);
              playerBody.setGravityY(0);
            }
            
            // Restore physics world gravity
            this.physics.world.gravity.y = GAME_CONFIG.ball.gravity;
            // Restore ball physics and give them initial velocity
            this.balls.children.entries.forEach((ball) => {
              const b = ball as Ball;
              const body = b.body as Phaser.Physics.Arcade.Body;
              if (body) {
                // Give balls initial random velocity
                const angle = Phaser.Math.Between(0, 360);
                const speed = GAME_CONFIG.ball.initialSpeed;
                body.setVelocity(
                  Math.cos(Phaser.Math.DegToRad(angle)) * speed,
                  Math.sin(Phaser.Math.DegToRad(angle)) * speed
                );
              }
            });
          }
        });
      }
    };

    this.time.delayedCall(1000, updateCountdown);
  }

  update() {
    // Don't update game if countdown is still running
    if (!this.gameStarted) {
      return;
    }

    this.player.update();

    // Update ropes and check collisions
    this.ropes.children.entries.forEach((rope) => {
      const r = rope as Rope;
      
      // Update rope to ensure position stays fixed
      r.update();
      
      // Manual collision check for ropes
      if (r.active) {
        this.checkRopeBallCollision(r);
      }
      
      // Remove if destroyed
      if (!r.active) {
        r.destroy();
      }
    });

    // Check if balls hit the bottom (world bounds)
    const currentTime = this.time.now;
    this.balls.children.entries.forEach((ballObj) => {
      const ball = ballObj as Ball;
      if (!ball.active) return;
      
      const body = ball.body as Phaser.Physics.Arcade.Body;
      // Check if ball is at or below the bottom of the screen
      if (body && body.y >= GAME_CONFIG.height - 5 && body.velocity.y > 0) {
        // Check cooldown to prevent sound spam
        const lastHitTime = this.ballHitBottomCooldown.get(ball) || 0;
        if (currentTime - lastHitTime > 200) { // 200ms cooldown
          // Ball hit the bottom - play sound
          this.soundManager.play('ball');
          this.ballHitBottomCooldown.set(ball, currentTime);
        }
      }
    });

    // Shooting
    if (this.shootKey.isDown && this.canShoot) {
      this.shoot();
      this.canShoot = false;
      // Clear any existing cooldown timer
      if (this.shootCooldownTimer) {
        this.time.removeEvent(this.shootCooldownTimer);
      }
      this.shootCooldownTimer = this.time.delayedCall(this.shootCooldown, () => {
        this.canShoot = true;
        this.shootCooldownTimer = undefined;
      });
    }

    // Check win condition
    if (this.balls.children.entries.length === 0) {
      this.spawnBalls(GAME_CONFIG.ballSpawnCount + 1, 'large', true);
    }
  }

  private shoot() {
    // Create rope at player's X position, starting from player's top
    const playerTopY = this.player.y - GAME_CONFIG.player.height / 2;
    // Calculate max height from player's top to ceiling
    const maxRopeHeight = playerTopY - this.ceilingY;
    const rope = new Rope(this, this.player.x, playerTopY, maxRopeHeight);
    this.ropes.add(rope);
    // Play shoot sound
    this.soundManager.play('shoot');
  }

  private spawnBalls(count: number, size: BallSize, setInitialVelocity: boolean = true) {
    const { width } = this.scale;
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, 300);
      const ball = new Ball(this, x, y, size, setInitialVelocity);
      this.balls.add(ball);
    }
  }

  private checkRopeBallCollision(rope: Rope) {
    // Manual collision check for animated ropes
    // Rope grows upward from its start position (player's top)
    const ropeX = rope.x;
    const ropeHalfWidth = (GAME_CONFIG.rope.width + 4) / 2; // Half of collision width
    
    // Get rope's current height and start position
    const ropeHeight = rope.getCurrentHeight();
    const ropeStartY = rope.y; // Rope's start position (player's top)
    const ropeTop = ropeStartY - ropeHeight; // Top of rope (grows upward from start)
    const ropeBottom = ropeStartY; // Bottom of rope (at start position)
    
    // Ensure rope doesn't go above ceiling
    const actualRopeTop = Math.max(ropeTop, this.ceilingY);
    
    const ropeBounds = {
      left: ropeX - ropeHalfWidth,
      right: ropeX + ropeHalfWidth,
      top: actualRopeTop,
      bottom: ropeBottom
    };

    this.balls.children.entries.forEach((ballObj) => {
      const ball = ballObj as Ball;
      if (!ball.active) return;

      const ballRadius = GAME_CONFIG.ball.sizes[ball.ballSize];
      const ballCenterX = ball.x;
      const ballCenterY = ball.y;

      // Check if rope's vertical line intersects with ball's circle
      // First check if ball is within rope's X bounds
      if (ballCenterX >= ropeBounds.left && ballCenterX <= ropeBounds.right) {
        // Ball is within X bounds, check Y bounds
        if (ballCenterY - ballRadius <= ropeBounds.bottom && ballCenterY + ballRadius >= ropeBounds.top) {
          // Collision detected - handle it
          this.handleRopeBallCollisionDirect(rope, ball);
          return; // Exit early since rope will be destroyed
        }
      } else {
        // Check distance from ball center to rope line
        const closestX = Phaser.Math.Clamp(ballCenterX, ropeBounds.left, ropeBounds.right);
        const closestY = Phaser.Math.Clamp(ballCenterY, ropeBounds.top, ropeBounds.bottom);
        
        const distanceX = ballCenterX - closestX;
        const distanceY = ballCenterY - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        if (distanceSquared < ballRadius * ballRadius) {
          // Collision detected - handle it
          this.handleRopeBallCollisionDirect(rope, ball);
          return; // Exit early since rope will be destroyed
        }
      }
    });
  }

  private handleRopeBallCollision(
    ropeObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    ballObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const rope = ropeObj as Rope;
    const ball = ballObj as Ball;

    // Safety check - make sure both objects are valid
    if (!rope || !rope.active || !ball || !ball.active) {
      return;
    }

    this.handleRopeBallCollisionDirect(rope, ball);
  }

  private handleRopeBallCollisionDirect(rope: Rope, ball: Ball) {
    // Remove rope
    rope.destroy();

    // Play pop sound (rope-ball collision)
    this.soundManager.play('pop');

    // Handle ball splitting
    const newBalls = ball.split();
    
    if (newBalls.length > 0) {
      // Add new balls to group
      newBalls.forEach(newBall => {
        this.balls.add(newBall);
      });
    }

    // Add score
    this.score += ball.getScore();
    this.scoreText.setText(`Score: ${this.score}`);

    // Remove original ball
    ball.destroy();
  }

  private handlePlayerBallCollision(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    ballObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const ball = ballObj as Ball;

    // Lose a life
    this.lives--;
    this.livesText.setText(`Lives: ${this.lives}`);

    // Play collision sound
    this.soundManager.play('collision');

    // Remove the ball that hit the player
    ball.destroy();

    // Check game over
    if (this.lives <= 0) {
      // Update high score
      const isNewHighScore = updateHighScore(this.score);
      
      // Pass data to GameOverScene (gameOver sound will play in GameOverScene)
      this.scene.start('GameOverScene', {
        score: this.score,
        isNewHighScore: isNewHighScore
      });
    } else {
      // Brief invincibility - flash player
      this.tweens.add({
        targets: this.player,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 5
      });
    }
  }
}

