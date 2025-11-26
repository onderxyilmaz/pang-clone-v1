import Phaser from 'phaser';

export class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }

  preload() {
    // Load splash screen image
    this.load.image('splashScreen', 'images/splash_screen.png');
  }

  create() {
    const { width, height } = this.scale;

    // Add splash screen image
    const splashImage = this.add.image(width / 2, height / 2 - 50, 'splashScreen');

    // Scale the image to fit nicely (adjust as needed based on your image size)
    const scaleX = (width * 0.8) / splashImage.width;
    const scaleY = (height * 0.6) / splashImage.height;
    const scale = Math.min(scaleX, scaleY);
    splashImage.setScale(scale);

    // Create Start button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = width / 2;
    const buttonY = height / 2 + 180;

    // Button background
    const buttonBg = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x4ecdc4);
    buttonBg.setStrokeStyle(3, 0xffffff);
    buttonBg.setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.add.text(buttonX, buttonY, 'START', {
      fontSize: '32px',
      color: '#fff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Button hover effect
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x3da89f);
      this.tweens.add({
        targets: buttonBg,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: 'Power2'
      });
      this.tweens.add({
        targets: buttonText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: 'Power2'
      });
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x4ecdc4);
      this.tweens.add({
        targets: buttonBg,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2'
      });
      this.tweens.add({
        targets: buttonText,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2'
      });
    });

    // Button click - start menu with music
    buttonBg.on('pointerdown', () => {
      // Resume audio context first
      const soundManager = this.sound as any;
      if (soundManager.context && soundManager.context.state === 'suspended') {
        soundManager.context.resume().then(() => {
          this.startMenu();
        });
      } else {
        this.startMenu();
      }
    });

    // Credit text in bottom right corner
    const creditText = this.add.text(width - 20, height - 20, 'Written by Onder Yilmaz', {
      fontSize: '16px',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(1, 1);

    // Blinking effect for credit text
    this.tweens.add({
      targets: creditText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Also allow space/enter key to start
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-SPACE', () => {
        const soundManager = this.sound as any;
        if (soundManager.context && soundManager.context.state === 'suspended') {
          soundManager.context.resume().then(() => {
            this.startMenu();
          });
        } else {
          this.startMenu();
        }
      });

      this.input.keyboard.on('keydown-ENTER', () => {
        const soundManager = this.sound as any;
        if (soundManager.context && soundManager.context.state === 'suspended') {
          soundManager.context.resume().then(() => {
            this.startMenu();
          });
        } else {
          this.startMenu();
        }
      });
    }
  }

  private startMenu() {
    // Start playing menu music immediately
    this.sound.play('startScreen', { loop: true, volume: 0.3 });
    // Go to menu scene
    this.scene.start('MenuScene');
  }
}
