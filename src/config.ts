// Game configuration constants
export const GAME_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  
  // Player settings
  player: {
    width: 40,
    height: 40,
    speed: 300,
    startY: 550,
    color: 0x4ecdc4
  },
  
  // Rope/shot settings
  rope: {
    width: 8, // Doubled from 4
    height: 20,
    speed: 600,
    color: 0xffff00
  },
  
  // Ball settings
  ball: {
    sizes: {
      large: 40,
      medium: 25,
      small: 15
    },
    colors: {
      large: 0xff6b6b,
      medium: 0xffa500,
      small: 0x90ee90
    },
    bounce: 0.8,
    gravity: 300,
    initialSpeed: 150
  },
  
  // Scoring
  scores: {
    small: 100,
    medium: 50,
    large: 25
  },
  
  // Game settings
  lives: 3,
  ballSpawnCount: 3,
  ballSpawnDelay: 2000
};


