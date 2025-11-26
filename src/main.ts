import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { SplashScene } from './scenes/SplashScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { GAME_CONFIG } from './config';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  parent: 'game-container',
  backgroundColor: GAME_CONFIG.backgroundColor,
  audio: {
    disableWebAudio: false,
    noAudio: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.ball.gravity },
      debug: false
    }
  },
  scene: [BootScene, SplashScene, MenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);

