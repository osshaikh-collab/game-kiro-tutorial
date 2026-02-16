# Golden Retriever Platformer Game

A retro-style 2D platformer game inspired by Super Mario Bros (1985), featuring a golden retriever puppy as the main character. Built with vanilla JavaScript and HTML5 Canvas using Amazon Kiro agentic IDE.

## 🎮 Game Features

- **Retro NES-style pixel art** - Hand-coded golden retriever sprite
- **Platform jumping mechanics** - Jump between platforms and avoid enemies
- **Power-up system** - Hit special blocks to reveal dog treats that grant super jump ability
- **Enemy AI** - Enemies patrol platforms and can be defeated by jumping on them
- **Collectibles** - Gather coins scattered throughout the level
- **Time challenge** - Complete the level within 60 seconds
- **Scoring system** - Earn points for coins, enemies, power-ups, plus time and life bonuses
- **Camera scrolling** - Extended level with smooth camera following
- **Sound effects** - Retro-style audio for jumps, coins, enemies, and power-ups

## 🕹️ How to Play

### Controls
- **Arrow Keys (← →)** - Move left and right
- **Spacebar** - Jump
- **R** - Restart game (after game over or winning)

### Objective
Reach the green goal line at the end of the level before time runs out!

### Gameplay Tips
- **Jump on enemies** from above to defeat them (100 points each)
- **Collect coins** for points (50 points each)
- **Hit golden ? blocks** from below to reveal dog treat power-ups
- **Collect dog treats** to unlock super jump for 5 seconds (200 points + 1.5x jump height)
- **Finish quickly** - Each remaining second = 100 bonus points
- **Preserve lives** - Each remaining life = 500 bonus points
- You have **3 lives** and **60 seconds** to complete the level

### Scoring
- Coin: 50 points
- Enemy defeated: 100 points
- Power-up collected: 200 points
- Time bonus: 100 points per remaining second
- Life bonus: 500 points per remaining life

## 🚀 How to Run

### Option 1: Local Play (Easiest)
1. Download both `index.html` and `game.js` files
2. Place them in the same folder
3. Double-click `index.html` to open in your browser
4. Start playing!

### Option 2: Host Online
Upload both files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- CodePen

No build process or dependencies required - it's pure HTML/CSS/JavaScript!

## 📁 Project Structure

```
.
├── index.html         # Main HTML file with canvas and styling
├── game.js            # Game logic, physics, rendering, and audio
└── README.md          # This file
```

## 🎨 Technical Details

- **No external dependencies** - Pure vanilla JavaScript
- **HTML5 Canvas** for rendering
- **Web Audio API** for sound effects
- **RequestAnimationFrame** for smooth 60fps gameplay
- **Pixel-perfect collision detection**
- **NES-style sprite rendering** using code-drawn pixels

## 🏗️ Development Process

This game was built iteratively through 6 phases:

1. **Phase 1**: Basic game loop, player movement, jumping, and gravity
2. **Phase 2**: Platform collision detection
3. **Phase 3**: Enemy AI with patrol behavior
4. **Phase 4**: Multiple enemies, collectible coins, lives system, and scoring
5. **Phase 5**: Camera scrolling, extended level, goal/finish line, restart functionality
6. **Phase 6**: Sound effects, power-up blocks, dog treat power-ups, timer system, score breakdown

## 🎓 Learning Resource

This project demonstrates:
- Game loop architecture
- 2D physics simulation (gravity, velocity, collision)
- State management in games
- Canvas rendering techniques
- Procedural audio generation
- Camera systems for scrolling levels
- Pixel art rendering with code

## 🤝 Credits

Created as a learning exercise to demonstrate AI-assisted game development and effective prompting techniques.

## 📝 License

Free to use, modify, and share. Have fun!

---

**Enjoy the game!** 🐕🎮
