import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class Player extends Phaser.GameObjects.Container {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private spriteLeft!: Phaser.GameObjects.Image;
  private spriteRight!: Phaser.GameObjects.Image;
  private currentDirection: 'left' | 'right' = 'right';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    // Create sprite images
    this.spriteLeft = scene.add.image(0, 0, 'characterLeft');
    this.spriteRight = scene.add.image(0, 0, 'characterRight');
    
    // Set display size based on config
    this.spriteLeft.setDisplaySize(GAME_CONFIG.player.width, GAME_CONFIG.player.height);
    this.spriteRight.setDisplaySize(GAME_CONFIG.player.width, GAME_CONFIG.player.height);
    
    // Set origin to center
    this.spriteLeft.setOrigin(0.5, 0.5);
    this.spriteRight.setOrigin(0.5, 0.5);
    
    // Add sprites to container
    this.add(this.spriteLeft);
    this.add(this.spriteRight);
    
    // Start with right-facing sprite visible
    this.spriteLeft.setVisible(false);
    this.spriteRight.setVisible(true);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(GAME_CONFIG.player.width, GAME_CONFIG.player.height);
    body.setCollideWorldBounds(true);
    body.setImmovable(true);
    // Ensure player starts at bottom and doesn't fall
    body.setVelocity(0, 0);
    body.setGravityY(0);
    
    // Keyboard input - ensure keyboard exists
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);

    if ((this.cursors?.left?.isDown) || (this.keyA?.isDown)) {
      body.setVelocityX(-GAME_CONFIG.player.speed);
      // Show left-facing sprite
      if (this.currentDirection !== 'left') {
        this.currentDirection = 'left';
        this.spriteLeft.setVisible(true);
        this.spriteRight.setVisible(false);
      }
    } else if ((this.cursors?.right?.isDown) || (this.keyD?.isDown)) {
      body.setVelocityX(GAME_CONFIG.player.speed);
      // Show right-facing sprite
      if (this.currentDirection !== 'right') {
        this.currentDirection = 'right';
        this.spriteLeft.setVisible(false);
        this.spriteRight.setVisible(true);
      }
    }
  }

  getShootPosition(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y - GAME_CONFIG.player.height / 2
    };
  }
}

