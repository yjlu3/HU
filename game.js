// Game constants
const WIDTH = 800;
const HEIGHT = 600;
const BORDER_SIZE = 30;
const TABLE_WIDTH = WIDTH - (2 * BORDER_SIZE);
const TABLE_HEIGHT = HEIGHT - (2 * BORDER_SIZE);
const TABLE_COLOR = '#197a30'; // Pool table green
const BORDER_COLOR = '#663300'; // Brown border

// Game variables
let canvas;
let ctx;
let balls = [];
let cueBall;
let power = 0.0;
let maxPower = 20.0; // Increased from 10.0 to 20.0
let powerStep = 0.4; // Increased from 0.2 to 0.4
let angle = 0.0;
let animationFrameId;
let lastTime = 0;
let targetFPS = 60;
let timeStep = 1000 / targetFPS;
let keys = {};

// Initialize the game
function init() {
    // Get the canvas and context
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Create the cue ball
    cueBall = new CueBall(200, HEIGHT / 2, 15, 'white');
    
    // Create regular balls
    balls = [
        new Ball(500, HEIGHT / 2, 15, 'red'),
        new Ball(530, HEIGHT / 2 - 20, 15, 'blue'),
        new Ball(530, HEIGHT / 2 + 20, 15, 'yellow'),
        new Ball(560, HEIGHT / 2 - 40, 15, 'green'),
        new Ball(560, HEIGHT / 2, 15, 'orange'),
        new Ball(560, HEIGHT / 2 + 40, 15, 'magenta'),
        new Ball(590, HEIGHT / 2 - 60, 15, 'pink'),
        new Ball(590, HEIGHT / 2 - 20, 15, 'cyan'),
        new Ball(590, HEIGHT / 2 + 20, 15, 'purple'),
        new Ball(590, HEIGHT / 2 + 60, 15, 'black')
    ];
    
    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start the game loop
    startGameLoop();
}

// Key event handlers
function handleKeyDown(e) {
    keys[e.key] = true;
    
    // Prevent default action for game keys to avoid page scrolling
    if (['w', 'a', 's', 'd', ' ', 'r'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

// Process player input
function processInput() {
    if (cueBall.isStationary()) {
        // Rotate cue counter-clockwise
        if (keys['a'] || keys['A']) {
            angle += 2; // Reduced from 5 to 2 for more refined control
            if (angle >= 360) angle -= 360;
        }
        
        // Rotate cue clockwise
        if (keys['d'] || keys['D']) {
            angle -= 2; // Reduced from 5 to 2 for more refined control
            if (angle < 0) angle += 360;
        }
        
        // Increase power
        if (keys['w'] || keys['W']) {
            power += powerStep;
            if (power > maxPower) power = maxPower;
            updatePowerDisplay();
        }
        
        // Decrease power
        if (keys['s'] || keys['S']) {
            power -= powerStep;
            if (power < 0) power = 0;
            updatePowerDisplay();
        }
        
        // Shoot
        if (keys[' ']) {
            shootCueBall();
            keys[' '] = false; // Prevents continuous shooting
        }
        
        // Reset game
        if (keys['r'] || keys['R']) {
            resetGame();
            keys['r'] = keys['R'] = false;
        }
    }
}

function updatePowerDisplay() {
    document.getElementById('powerDisplay').textContent = `Power: ${power.toFixed(1)}`;
}

function shootCueBall() {
    if (cueBall.isStationary() && power > 0) {
        const radians = angle * Math.PI / 180;
        const velocityX = Math.cos(radians) * power;
        const velocityY = Math.sin(radians) * power;
        
        cueBall.setVelocity(velocityX, velocityY);
        power = 0; // Reset power after shooting
        updatePowerDisplay();
    }
}

function resetGame() {
    cueBall.resetPosition();
    
    // Reset all balls to their initial positions
    balls[0].reset(500, HEIGHT / 2);
    balls[1].reset(530, HEIGHT / 2 - 20);
    balls[2].reset(530, HEIGHT / 2 + 20);
    balls[3].reset(560, HEIGHT / 2 - 40);
    balls[4].reset(560, HEIGHT / 2);
    balls[5].reset(560, HEIGHT / 2 + 40);
    balls[6].reset(590, HEIGHT / 2 - 60);
    balls[7].reset(590, HEIGHT / 2 - 20);
    balls[8].reset(590, HEIGHT / 2 + 20);
    balls[9].reset(590, HEIGHT / 2 + 60);
    
    // Reset control variables
    power = 0;
    updatePowerDisplay();
}

// Update game state
function update() {
    // Process player input
    processInput();
    
    // Update cue ball
    cueBall.update(TABLE_WIDTH, TABLE_HEIGHT, BORDER_SIZE);
    
    // Update other balls
    for (const ball of balls) {
        ball.update(TABLE_WIDTH, TABLE_HEIGHT, BORDER_SIZE);
    }
    
    // Check for collisions between balls
    handleBallCollisions();
}

function handleBallCollisions() {
    // Check cue ball against all other balls
    for (const ball of balls) {
        if (detectCollision(cueBall, ball)) {
            resolveCollision(cueBall, ball);
        }
    }
    
    // Check all balls against each other
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ballA = balls[i];
            const ballB = balls[j];
            
            if (detectCollision(ballA, ballB)) {
                resolveCollision(ballA, ballB);
            }
        }
    }
}

function detectCollision(a, b) {
    // Calculate distance between ball centers
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If distance is less than sum of radii, we have a collision
    return distance < a.radius + b.radius;
}

function resolveCollision(a, b) {
    // First, reposition balls so they are not overlapping
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const overlap = a.radius + b.radius - distance;
    
    // Move balls apart proportionally to their velocities
    const totalVelocity = a.getSpeed() + b.getSpeed();
    if (totalVelocity <= 0.01) {
        // If both balls are almost stationary, just move them slightly
        const moveX = (dx / distance) * overlap * 0.5;
        const moveY = (dy / distance) * overlap * 0.5;
        
        a.setPosition(a.x - moveX, a.y - moveY);
        b.setPosition(b.x + moveX, b.y + moveY);
    } else {
        // Move balls in the opposite direction of their velocity
        const ratioA = a.getSpeed() / totalVelocity;
        const ratioB = b.getSpeed() / totalVelocity;
        
        const moveX = (dx / distance) * overlap;
        const moveY = (dy / distance) * overlap;
        
        a.setPosition(a.x - moveX * ratioB, a.y - moveY * ratioB);
        b.setPosition(b.x + moveX * ratioA, b.y + moveY * ratioA);
    }
    
    // Now apply momentum and velocity changes
    const nx = dx / distance;  // Normal x component
    const ny = dy / distance;  // Normal y component
    
    // Tangent vector (perpendicular to normal)
    const tx = -ny;
    const ty = nx;
    
    // Calculate dot products for projections
    const dpAn = a.velocityX * nx + a.velocityY * ny;  // a's velocity along normal
    const dpAt = a.velocityX * tx + a.velocityY * ty;  // a's velocity along tangent
    const dpBn = b.velocityX * nx + b.velocityY * ny;  // b's velocity along normal
    const dpBt = b.velocityX * tx + b.velocityY * ty;  // b's velocity along tangent
    
    // Conservation of momentum formula (elastic collision)
    const m1 = a.mass;
    const m2 = b.mass;
    const newDpAn = (dpAn * (m1 - m2) + 2 * m2 * dpBn) / (m1 + m2);
    const newDpBn = (dpBn * (m2 - m1) + 2 * m1 * dpAn) / (m1 + m2);
    
    // Calculate new velocities (tangential velocity doesn't change)
    const newVelAx = tx * dpAt + nx * newDpAn;
    const newVelAy = ty * dpAt + ny * newDpAn;
    const newVelBx = tx * dpBt + nx * newDpBn;
    const newVelBy = ty * dpBt + ny * newDpBn;
    
    // Set new velocities
    a.setVelocity(newVelAx, newVelAy);
    b.setVelocity(newVelBx, newVelBy);
}

// Calculate trajectory
function calculateTrajectory() {
    if (power <= 0) return [];
    
    // Create temporary ball to simulate movement
    const simBall = {
        x: cueBall.x,
        y: cueBall.y,
        radius: cueBall.radius,
        velocityX: Math.cos(angle * Math.PI / 180) * power,
        velocityY: Math.sin(angle * Math.PI / 180) * power
    };
    
    const points = [];
    const maxPoints = 30; // Limit the number of points to avoid performance issues
    let hasCollided = false;
    
    // Add starting point
    points.push({x: simBall.x, y: simBall.y});
    
    // Simulate movement for a few steps
    for (let i = 0; i < maxPoints && !hasCollided; i++) {
        // Move ball
        simBall.x += simBall.velocityX * 0.3; // Scale down for prediction
        simBall.y += simBall.velocityY * 0.3;
        
        // Add point
        points.push({x: simBall.x, y: simBall.y});
        
        // Check for border collisions
        if (simBall.x - simBall.radius < BORDER_SIZE || 
            simBall.x + simBall.radius > BORDER_SIZE + TABLE_WIDTH ||
            simBall.y - simBall.radius < BORDER_SIZE ||
            simBall.y + simBall.radius > BORDER_SIZE + TABLE_HEIGHT) {
            hasCollided = true;
        }
        
        // Check for ball collisions
        for (const ball of balls) {
            const dx = simBall.x - ball.x;
            const dy = simBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < simBall.radius + ball.radius) {
                hasCollided = true;
                break;
            }
        }
    }
    
    return points;
}

// Render the game
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw the table
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ctx.fillStyle = TABLE_COLOR;
    ctx.fillRect(BORDER_SIZE, BORDER_SIZE, TABLE_WIDTH, TABLE_HEIGHT);
    
    // Draw pockets (6 pockets)
    ctx.fillStyle = 'black';
    const pocketSize = 35; // Increased from 25 to 35
    
    // Top left pocket
    ctx.beginPath();
    ctx.arc(BORDER_SIZE, BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Top center pocket
    ctx.beginPath();
    ctx.arc(WIDTH/2, BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Top right pocket
    ctx.beginPath();
    ctx.arc(WIDTH - BORDER_SIZE, BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bottom left pocket
    ctx.beginPath();
    ctx.arc(BORDER_SIZE, HEIGHT - BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bottom center pocket
    ctx.beginPath();
    ctx.arc(WIDTH/2, HEIGHT - BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bottom right pocket
    ctx.beginPath();
    ctx.arc(WIDTH - BORDER_SIZE, HEIGHT - BORDER_SIZE, pocketSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw trajectory line if cue ball is stationary and power > 0
    if (cueBall.isStationary() && power > 0) {
        const trajectory = calculateTrajectory();
        
        // Draw dotted trajectory line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.setLineDash([5, 5]); // Dotted line
        
        for (let i = 0; i < trajectory.length - 1; i++) {
            if (i === 0) {
                ctx.moveTo(trajectory[i].x, trajectory[i].y);
            } else {
                ctx.lineTo(trajectory[i].x, trajectory[i].y);
            }
        }
        
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
    }
    
    // Draw all the regular balls
    for (const ball of balls) {
        ball.draw(ctx);
    }
    
    // Draw the cue ball
    cueBall.draw(ctx);
    
    // Draw the cue stick if the cue ball is stationary
    if (cueBall.isStationary()) {
        drawCueStick();
    }
}

function drawCueStick() {
    // Only draw the cue stick if there's some power
    if (power > 0) {
        const lineLength = 100 + (power * 10);
        
        const radians = angle * Math.PI / 180;
        const endX = cueBall.x - Math.cos(radians) * lineLength;
        const endY = cueBall.y - Math.sin(radians) * lineLength;
        
        // Draw the cue stick
        ctx.strokeStyle = '#c89664'; // Light brown for cue
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw a small white tip
        const tipX = cueBall.x - Math.cos(radians) * (lineLength + 5);
        const tipY = cueBall.y - Math.sin(radians) * (lineLength + 5);
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
    }
}

// Game loop
function gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    
    // Only update at target FPS
    if (deltaTime >= timeStep) {
        lastTime = currentTime;
        
        // Update and draw the game
        update();
        draw();
    }
    
    // Request the next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    if (!animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// Start the game when the page loads
window.addEventListener('load', init); 