# 🎮 Pang Clone V1

A modern browser-based arcade game inspired by the classic Pang game, built with Phaser 3, TypeScript, and Vite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Phaser](https://img.shields.io/badge/Phaser-3.80-green.svg)

## 🎯 Game Overview

Pang Clone is a single-screen 2D arcade game where you control a character that shoots ropes upward to split bouncing balls. The goal is to destroy all balls while avoiding collisions. As balls are destroyed, they split into smaller balls, and you earn points for each destruction.

## ✨ Features

- 🎮 **Classic Arcade Gameplay** - Split balls by shooting ropes upward
- 🎨 **Modern Graphics** - Custom sprites for player, balls, and rope
- 🔊 **Sound Effects** - Immersive audio feedback for all game actions
- 🎵 **Background Music** - Atmospheric music on the main menu
- 📊 **Score System** - Earn points by destroying balls of different sizes
- 💾 **High Score Persistence** - High scores saved in browser localStorage
- ❤️ **Lives System** - 3 lives to complete the challenge
- 🎯 **Progressive Difficulty** - Balls split into smaller sizes when hit

## 🛠️ Technologies Used

- **Phaser 3** - Game framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Web Audio API** - Sound management
- **localStorage** - High score persistence

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/onderxyilmaz/pang-clone-v1.git
cd pang-clone-v1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

### Controls

- **Arrow Keys** or **A/D** - Move character left/right
- **Space** - Shoot rope upward

### Gameplay

1. **Objective**: Destroy all balls on the screen by shooting ropes at them
2. **Ball Splitting**: 
   - Large balls split into 2 medium balls
   - Medium balls split into 2 small balls
   - Small balls are destroyed completely
3. **Scoring**:
   - Small balls: 100 points
   - Medium balls: 50 points
   - Large balls: 25 points
4. **Lives**: You have 3 lives. Lose a life when a ball hits you.
5. **Game Over**: When all lives are lost, your score is saved if it's a new high score.

### Tips

- Ropes extend from your character's top to the ceiling
- Ropes automatically disappear after 5 seconds if no ball is hit
- Balls bounce off walls and the ceiling
- Watch out for balls bouncing off the bottom - they can hit you!

## 📁 Project Structure

```
pang-clone-v1/
├── public/
│   ├── images/          # Game sprites (player, balls, rope)
│   └── sounds/          # Sound effects and music
├── src/
│   ├── classes/         # Game object classes
│   │   ├── Ball.ts      # Ball logic and splitting
│   │   ├── Player.ts    # Player movement and controls
│   │   └── Rope.ts      # Rope shooting and animation
│   ├── scenes/          # Phaser scenes
│   │   ├── BootScene.ts      # Asset loading
│   │   ├── MenuScene.ts      # Main menu
│   │   ├── GameScene.ts      # Main game logic
│   │   └── GameOverScene.ts  # Game over screen
│   ├── utils/           # Utility functions
│   │   ├── sound.ts     # Sound manager
│   │   └── storage.ts   # localStorage helpers
│   ├── config.ts        # Game configuration
│   └── main.ts          # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Game Assets

The game uses custom sprites and sound effects:

- **Player**: Left and right facing sprites
- **Balls**: Single sprite with color tinting for different sizes
- **Rope**: Vertical rope sprite
- **Sounds**: Shoot, pop, collision, ball bounce, game over, and background music

## 🚀 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Style

The project uses TypeScript with strict type checking. Make sure to:

- Use proper TypeScript types
- Follow Phaser 3 conventions
- Keep game logic separated from rendering

## 🐛 Known Issues

- AudioContext may require user interaction to start (browser autoplay policy)
- Sound effects may not play on first load until user interacts with the page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Onder Yilmaz**

- GitHub: [@onderxyilmaz](https://github.com/onderxyilmaz)
- Repository: [pang-clone-v1](https://github.com/onderxyilmaz/pang-clone-v1)

## 🙏 Acknowledgments

- Inspired by the classic Pang arcade game
- Built with [Phaser 3](https://phaser.io/)
- Sound effects and music from free sources

---

**Enjoy the game! 🎮**

