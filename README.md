# Pang Clone

A classic arcade-style game built with Phaser 3 and TypeScript, inspired by the legendary Pang (Buster Bros.) game.

## About the Game

Pop bouncing balls by shooting a harpoon upward! Avoid getting hit by the balls as they split into smaller sizes. Clear all balls to advance to the next level while trying to beat your high score.

## Features

- **Classic Gameplay**: Faithful recreation of the original Pang mechanics
- **Multiple Ball Sizes**: Balls split into smaller sizes when hit
- **Score System**: Track your progress with a persistent high score system
- **Sound Effects**: Immersive audio feedback for all game actions
- **Background Music**: Engaging menu music to enhance the experience
- **Animated Menu**: Dynamic bouncing balls in the background
- **Responsive Controls**: Smooth player movement and shooting mechanics

## Screenshots

The game features:
- An attractive splash screen with animated start button
- A main menu with bouncing balls background
- Fast-paced gameplay with arcade-style physics
- Game over screen with high score tracking

## Controls

- **Arrow Keys**: Move your character left and right
- **Space**: Shoot harpoon / Start game
- **Enter**: Alternative start button (on splash screen)

## Tech Stack

- **Phaser 3.80.1**: Game framework
- **TypeScript 5.3.3**: Type-safe development
- **Vite 5.0.11**: Lightning-fast build tool
- **Arcade Physics**: Built-in Phaser physics engine

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pang_clone_v1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
pang_clone_v1/
├── public/
│   ├── images/           # Game images and sprites
│   │   ├── ball.png
│   │   ├── character.png
│   │   ├── harpoon.png
│   │   ├── splash_screen.png
│   │   └── favicon.ico
│   └── sounds/           # Audio files
│       ├── ball.mp3
│       ├── collision.mp3
│       ├── game_over.mp3
│       ├── pop.mp3
│       └── start_screen.mp3
├── src/
│   ├── scenes/           # Game scenes
│   │   ├── BootScene.ts      # Asset loading
│   │   ├── SplashScene.ts    # Initial splash screen
│   │   ├── MenuScene.ts      # Main menu
│   │   ├── GameScene.ts      # Main gameplay
│   │   └── GameOverScene.ts  # Game over screen
│   ├── utils/            # Utility modules
│   │   ├── sound.ts          # Sound manager
│   │   └── storage.ts        # Local storage handling
│   ├── config.ts         # Game configuration
│   └── main.ts           # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Game Configuration

The game uses a centralized configuration system in `src/config.ts`:

- **Screen Size**: 800x600 pixels
- **Player Speed**: 300 pixels/second
- **Ball Physics**: Different sizes with gravity and bounce mechanics
- **Harpoon Speed**: 600 pixels/second

## How to Play

1. **Start the Game**: Click the START button or press Space/Enter on the splash screen
2. **Navigate Menu**: Press Space to start playing from the main menu
3. **Gameplay**:
   - Move left and right to avoid balls
   - Shoot harpoons upward to pop balls
   - Larger balls split into two medium balls
   - Medium balls split into two small balls
   - Small balls disappear when hit
4. **Win Condition**: Clear all balls from the screen
5. **Lose Condition**: Get hit by a ball (you have 3 lives)
6. **Beat High Score**: Try to achieve the highest score possible!

## License

MIT License

Copyright (c) 2025 Onder Yilmaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Credits

**Written by Onder Yilmaz**

Inspired by the classic Pang (Buster Bros.) arcade game originally developed by Mitchell Corporation.

## Future Improvements

- Multiple levels with increasing difficulty
- Power-ups and special weapons
- Different ball types with unique behaviors
- Multiplayer mode
- Mobile touch controls
- Leaderboard system

---

Enjoy playing Pang Clone! Feel free to contribute or report issues.
