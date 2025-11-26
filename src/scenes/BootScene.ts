import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load sprite images
    this.load.image('ball', 'images/ball.png');
    this.load.image('characterLeft', 'images/character_left.png');
    this.load.image('characterRight', 'images/character_right.png');
    this.load.image('rope', 'images/rope.png');
    
    // Load sound files
    this.load.audio('shoot', 'sounds/shoot.mp3');
    this.load.audio('pop', 'sounds/pop.mp3');
    this.load.audio('ball', 'sounds/ball.mp3');
    this.load.audio('collision', 'sounds/collision.mp3');
    this.load.audio('gameOver', 'sounds/game_over.mp3');
    this.load.audio('startScreen', 'sounds/start_screen.mp3');
  }

  create() {
    // Move to menu scene after boot
    this.scene.start('MenuScene');
  }
}


