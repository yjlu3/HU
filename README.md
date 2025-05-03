# 🎱 JS Billiards Physics Simulator

A realistic billiard game built with pure JavaScript and HTML5 Canvas that implements accurate physics for ball collisions, momentum transfer, and friction.

![Billiard Game Screenshot](screenshot-placeholder.png)

## ✨ Features

- **Realistic Physics Engine**
  - Elastic collisions with conservation of momentum
  - Friction simulation with gradual deceleration
  - Border collision detection and reflection
  - Trajectory prediction line for aiming

- **Interactive Game Elements**
  - Player-controlled cue stick with adjustable power and angle
  - Color-coded billiard balls with realistic 3D effects
  - Pockets that remove balls when they fall in
  - Cue ball reset when it falls into a pocket

- **Responsive Controls**
  - Fine-tuned rotation for precise aiming
  - Adjustable power for different shot strengths
  - Visual feedback through the cue stick and power indicator

## 🎮 How to Play

1. **Aim** using the A/D keys to rotate the cue stick
2. **Adjust power** using the W/S keys
3. **Shoot** by pressing the Spacebar
4. **Reset** the game with the R key

The goal is to use the white cue ball to pocket all the colored balls.

## 🛠️ Installation

No build tools or dependencies required!

1. Clone this repository:
```bash
git clone https://github.com/yourusername/js-billiards.git
```

2. Open `index.html` in your favorite browser.

That's it! The game will run immediately in your browser.

## 🕹️ Controls

| Key | Action |
|-----|--------|
| A | Rotate cue stick counter-clockwise |
| D | Rotate cue stick clockwise |
| W | Increase shot power |
| S | Decrease shot power |
| Space | Strike the cue ball |
| R | Reset the game |

## 🧠 Physics Implementation

The game uses several physics concepts:

1. **Conservation of Momentum**
   - In elastic collisions, momentum is conserved according to the formula:
   ```
   (m1*v1 + m2*v2) before collision = (m1*v1 + m2*v2) after collision
   ```

2. **Vector Decomposition**
   - Ball velocities are decomposed into normal and tangential components during collisions
   - Only the normal components are affected by collisions

3. **Friction Model**
   - A constant friction factor reduces ball velocities over time
   - Balls come to rest when their speed falls below a minimum threshold

4. **Collision Resolution**
   - Ball overlaps are resolved proportional to their velocities
   - Adds small random variations to prevent balls from getting stuck

## 📁 Project Structure

- `index.html` - Basic HTML structure and canvas element
- `styles.css` - Game styling and layout
- `ball.js` - Base ball class with physics properties and behavior
- `cueBall.js` - Special cue ball class that extends Ball
- `game.js` - Main game logic, rendering, and input handling

## 🚀 Future Improvements

- Add score tracking
- Implement game rules (8-ball, 9-ball, etc.)
- Add multiplayer support
- Improve collision sounds
- Add mobile touch controls
- Create an AI opponent

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Physics formulas based on principles of conservation of momentum and energy
- Built using vanilla JavaScript and HTML5 Canvas

---

Enjoy the game and feel free to contribute! 