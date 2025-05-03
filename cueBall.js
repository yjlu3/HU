class CueBall extends Ball {
    static POCKET_CHECK_DISTANCE = 25.0; // Increased from 15.0 to 25.0
    
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        this.initialX = x;
        this.initialY = y;
    }
    
    update(tableWidth, tableHeight, borderSize) {
        super.update(tableWidth, tableHeight, borderSize);
        
        // Check if the cue ball fell into a pocket
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
                // Cue ball fell into a pocket, reset it to initial position
                this.resetPosition();
                break;
            }
        }
    }
    
    resetPosition() {
        // Reset to initial position
        this.x = this.initialX;
        this.y = this.initialY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.inPocket = false;
    }
    
    draw(ctx) {
        // Draw a white cue ball
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some detail to the cue ball to make it distinctive
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
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
} 