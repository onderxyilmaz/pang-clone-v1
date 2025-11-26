import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export type BallSize = 'large' | 'medium' | 'small';

export class Ball extends Phaser.GameObjects.Container {
  public ballSize: BallSize;
  private sceneRef: Phaser.Scene;
  private sprite!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, size: BallSize, setInitialVelocity: boolean = true) {
    super(scene, x, y);
    
    const radius = GAME_CONFIG.ball.sizes[size];
    
    this.ballSize = size;
    this.sceneRef = scene;
    
    // Create sprite image
    this.sprite = scene.add.image(0, 0, 'ball');
    
    // Set display size based on ball size (diameter = radius * 2)
    this.sprite.setDisplaySize(radius * 2, radius * 2);
    this.sprite.setOrigin(0.5, 0.5);
    
    // Apply color tint based on ball size
    this.sprite.setTint(GAME_CONFIG.ball.colors[size]);
    
    this.add(this.sprite);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(radius);
    body.setBounce(GAME_CONFIG.ball.bounce);
    body.setCollideWorldBounds(true);
    
    // Random initial velocity (only if requested)
    if (setInitialVelocity) {
      const angle = Phaser.Math.Between(0, 360);
      const speed = GAME_CONFIG.ball.initialSpeed;
      body.setVelocity(
        Math.cos(Phaser.Math.DegToRad(angle)) * speed,
        Math.sin(Phaser.Math.DegToRad(angle)) * speed
      );
    } else {
      // No initial velocity and no gravity during countdown
      body.setVelocity(0, 0);
      body.setGravityY(0);
    }
  }

  split(): Ball[] {
    const newBalls: Ball[] = [];
    
    if (this.ballSize === 'large') {
      // Split into 2 medium balls
      newBalls.push(new Ball(this.sceneRef, this.x - 20, this.y, 'medium'));
      newBalls.push(new Ball(this.sceneRef, this.x + 20, this.y, 'medium'));
    } else if (this.ballSize === 'medium') {
      // Split into 2 small balls
      newBalls.push(new Ball(this.sceneRef, this.x - 15, this.y, 'small'));
      newBalls.push(new Ball(this.sceneRef, this.x + 15, this.y, 'small'));
    }
    // Small balls don't split, they just disappear
    
    return newBalls;
  }

  getScore(): number {
    return GAME_CONFIG.scores[this.ballSize];
  }
}

