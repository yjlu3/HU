class Ball {
    // Physics constants
    static FRICTION = 0.98;
    static MIN_VELOCITY = 0.01;
    static POCKET_CHECK_DISTANCE = 25.0; // Added pocket check distance for regular balls
    
    constructor(x, y, radius, color) {
        // Ball properties
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = radius;
        this.color = color;
        this.mass = radius * radius; // Mass proportional to area
        this.inPocket = false; // Track if ball is in a pocket
    }
    
    update(tableWidth, tableHeight, borderSize) {
        // Only update if ball is not in a pocket
        if (this.inPocket) return;
        
        // Apply movement
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Apply friction
        this.velocityX *= Ball.FRICTION;
        this.velocityY *= Ball.FRICTION;
        
        // Stop the ball if it's moving very slowly (to prevent endless tiny movements)
        if (Math.abs(this.velocityX) < Ball.MIN_VELOCITY && Math.abs(this.velocityY) < Ball.MIN_VELOCITY) {
            this.velocityX = 0;
            this.velocityY = 0;
        }
        
        // Handle collisions with table borders
        this.handleBorderCollisions(tableWidth, tableHeight, borderSize);
        
        // Check for pocket collisions (for regular balls)
        this.checkPockets(tableWidth, tableHeight, borderSize);
    }
    
    checkPockets(tableWidth, tableHeight, borderSize) {
        // Define pocket positions
        const pocketPositions = [
            [borderSize, borderSize],                                // Top left
            [borderSize + tableWidth/2, borderSize],                 // Top middle
            [borderSize + tableWidth, borderSize],                   // Top right
            [borderSize, borderSize + tableHeight],                  // Bottom left
            [borderSize + tableWidth/2, borderSize + tableHeight],   // Bottom middle
            [borderSize + tableWidth, borderSize + tableHeight]      // Bottom right
        ];
        
        // Check distance to each pocket
        for (const pocket of pocketPositions) {
            const dx = this.x - pocket[0];
            const dy = this.y - pocket[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < Ball.POCKET_CHECK_DISTANCE) {
                // Ball fell into a pocket
                this.inPocket = true;
                // Move the ball off screen
                this.x = -100;
                this.y = -100;
                this.velocityX = 0;
                this.velocityY = 0;
                break;
            }
        }
    }
    
    handleBorderCollisions(tableWidth, tableHeight, borderSize) {
        let collided = false;
        
        // Left border
        if (this.x - this.radius < borderSize) {
            this.x = borderSize + this.radius;
            this.velocityX = -this.velocityX * 0.8; // Lose some energy on bounce
            collided = true;
        }
        
        // Right border
        if (this.x + this.radius > borderSize + tableWidth) {
            this.x = borderSize + tableWidth - this.radius;
            this.velocityX = -this.velocityX * 0.8; // Lose some energy on bounce
            collided = true;
        }
        
        // Top border
        if (this.y - this.radius < borderSize) {
            this.y = borderSize + this.radius;
            this.velocityY = -this.velocityY * 0.8; // Lose some energy on bounce
            collided = true;
        }
        
        // Bottom border
        if (this.y + this.radius > borderSize + tableHeight) {
            this.y = borderSize + tableHeight - this.radius;
            this.velocityY = -this.velocityY * 0.8; // Lose some energy on bounce
            collided = true;
        }
        
        // If we hit a border, add a small random variation to prevent balls from getting stuck
        if (collided) {
            this.velocityX += (Math.random() - 0.5) * 0.01;
            this.velocityY += (Math.random() - 0.5) * 0.01;
        }
    }
    
    draw(ctx) {
        // Only draw if ball is not in a pocket
        if (this.inPocket) return;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a highlight effect for more 3D look
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius/3,
            this.y - this.radius/3,
            this.radius/3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    isStationary() {
        return this.velocityX === 0 && this.velocityY === 0;
    }
    
    getSpeed() {
        return Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    }
    
    setVelocity(vx, vy) {
        this.velocityX = vx;
        this.velocityY = vy;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.inPocket = false;
    }
} 