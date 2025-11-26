import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class Rope extends Phaser.GameObjects.Container {
  private currentHeight: number = 0;
  private maxHeight: number = GAME_CONFIG.height;
  private animationSpeed: number = 800; // milliseconds to reach full height
  private autoDestroyTimer?: Phaser.Time.TimerEvent;
  private ropeTween?: Phaser.Tweens.Tween;
  private sceneRef: Phaser.Scene;
  private animationComplete: boolean = false;
  private ropeX: number;
  private ropeStartY: number;
  private sprite!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, startY?: number, maxHeight?: number) {
    // Start position: if startY provided, use it; otherwise use bottom of screen
    const ropeStartY = startY !== undefined ? startY : GAME_CONFIG.height;
    super(scene, x, ropeStartY);
    
    // Now we can use this after super()
    this.ropeStartY = ropeStartY;
    
    // Set max height if provided (for ceiling limit)
    if (maxHeight !== undefined) {
      this.maxHeight = maxHeight;
    }
    
    this.sceneRef = scene;
    this.ropeX = x;
    this.currentHeight = 0;
    
    // Create rope sprite
    this.sprite = scene.add.image(0, 0, 'rope');
    this.sprite.setOrigin(0.5, 1); // Origin at bottom center
    this.sprite.setDisplaySize(GAME_CONFIG.rope.width, 0); // Start with 0 height
    this.add(this.sprite);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Set collision body - will grow with animation
    const collisionWidth = GAME_CONFIG.rope.width + 4; // Wider than visual for better collision detection
    body.setSize(collisionWidth, 0); // Start with 0 height
    body.setOffset(-collisionWidth / 2, 0); // Offset from position
    // Rope is static - doesn't move
    body.setImmovable(true);
    body.setEnable(true);
    
    // Draw initial rope (height 0)
    this.updateRopeVisual();
    
    // Animate rope growing from bottom to top
    this.animateRope();
  }

  private animateRope() {
    // Animate height from 0 to maxHeight
    this.ropeTween = this.sceneRef.tweens.add({
      targets: this,
      currentHeight: this.maxHeight,
      duration: this.animationSpeed,
      ease: 'Linear',
      onUpdate: () => {
        if (!this.active || this.animationComplete) return; // Safety check
        // Ensure position stays fixed
        this.x = this.ropeX;
        this.y = this.ropeStartY;
        this.updateRopeVisual();
        this.updateCollisionBody();
      },
      onComplete: () => {
        // Animation complete - rope is now at full height
        this.animationComplete = true;
        this.currentHeight = this.maxHeight;
        
        // Ensure position is fixed
        this.x = this.ropeX;
        this.y = this.ropeStartY;
        
        // Final update to ensure rope is at max height
        this.updateRopeVisual();
        this.updateCollisionBody();
        
        // Stop the tween to prevent any further updates
        if (this.ropeTween) {
          this.ropeTween.stop();
          this.ropeTween.remove(); // Remove from tween manager
        }
        
        // Start auto-destroy timer after animation completes
        // 5 seconds from now
        this.autoDestroyTimer = this.sceneRef.time.delayedCall(5000, () => {
          this.destroy();
        });
      }
    });
  }

  private updateRopeVisual() {
    if (!this.active || !this.sprite) return; // Safety check
    
    // Clamp height to prevent going beyond maxHeight
    // If animation is complete, always use maxHeight
    const height = this.animationComplete 
      ? this.maxHeight 
      : Math.max(0, Math.min(this.currentHeight, this.maxHeight));
    
    // Update sprite display size (width stays same, height grows)
    this.sprite.setDisplaySize(GAME_CONFIG.rope.width, height);
    
    // Ensure position stays fixed (in case something tries to move it)
    this.x = this.ropeX;
    this.y = this.ropeStartY;
  }

  private updateCollisionBody() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body || !this.active) return; // Safety check
    
    const collisionWidth = GAME_CONFIG.rope.width + 4; // Wider than visual for better collision detection
    // If animation is complete, always use maxHeight
    const height = this.animationComplete 
      ? this.maxHeight 
      : Math.max(0, Math.min(this.currentHeight, this.maxHeight)); // Clamp height
    body.setSize(collisionWidth, height);
    // Container origin is center (0.5, 0.5)
    // Sprite origin is (0.5, 1) - bottom center
    // Position is at start position (player's top)
    // Collision body should extend upward from start position
    // Offset Y should be -height/2 to position body so it extends upward from container center
    body.setOffset(-collisionWidth / 2, -height / 2);
  }

  getCurrentHeight(): number {
    return this.currentHeight;
  }

  // Update method to ensure position stays fixed
  update() {
    // Always keep position fixed at start position
    this.x = this.ropeX;
    this.y = this.ropeStartY;
  }

  destroy() {
    // Clear tween if exists
    if (this.ropeTween) {
      this.ropeTween.stop();
      this.ropeTween.remove();
      this.ropeTween = undefined;
    }
    // Clear timer if exists
    if (this.autoDestroyTimer) {
      this.sceneRef.time.removeEvent(this.autoDestroyTimer);
      this.autoDestroyTimer = undefined;
    }
    super.destroy();
  }
}
