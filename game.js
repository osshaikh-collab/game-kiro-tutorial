// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object - this represents our golden retriever puppy
const player = {
    x: 100,           // Position on screen (horizontal)
    y: 100,           // Position on screen (vertical)
    width: 32,        // Size of player
    height: 32,
    velocityX: 0,     // How fast moving horizontally
    velocityY: 0,     // How fast moving vertically
    speed: 5,         // Movement speed
    jumpPower: 12,    // How high can jump
    isOnGround: false // Is player touching ground?
};

// Camera object - follows the player
const camera = {
    x: 0,             // Camera position in the world
    width: 800,       // Screen width
    height: 600       // Screen height
};

// Audio context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound effect functions
function playJumpSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playEnemyDefeatSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playGameOverSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playWinSound() {
    // Play a happy ascending melody
    const notes = [523, 659, 784, 1047]; // C, E, G, C (one octave up)
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + index * 0.15;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}

function playPowerUpSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playCoinSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playPowerUpEndSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Game constants
const GRAVITY = 0.5;        // How fast things fall
const GROUND_HEIGHT = 500;  // Where the ground is
const LEVEL_WIDTH = 2400;   // Total level width (3x screen width)
const GOAL_X = 2300;        // Where the finish line is

// Platforms - blocks puppy can stand on (extended level)
const platforms = [
    { x: 200, y: 400, width: 150, height: 20 },
    { x: 400, y: 300, width: 100, height: 20 },
    { x: 550, y: 200, width: 120, height: 20 },
    { x: 100, y: 250, width: 80, height: 20 },
    // New platforms for extended level
    { x: 750, y: 350, width: 100, height: 20 },
    { x: 900, y: 450, width: 150, height: 20 },
    { x: 1100, y: 300, width: 120, height: 20 },
    { x: 1300, y: 400, width: 100, height: 20 },
    { x: 1500, y: 250, width: 150, height: 20 },
    { x: 1700, y: 350, width: 100, height: 20 },
    { x: 1900, y: 450, width: 120, height: 20 },
    { x: 2100, y: 300, width: 150, height: 20 }
];

// Special blocks that contain power-ups (like ? blocks in Mario)
const powerUpBlocks = [
    { x: 300, y: 250, width: 40, height: 40, hit: false },
    { x: 1000, y: 350, width: 40, height: 40, hit: false },
    { x: 1600, y: 350, width: 40, height: 40, hit: false }
];

// Power-ups (dog treats) that fall from blocks
const powerUps = [];

// Enemies array - multiple enemies patrolling different platforms
const enemies = [
    { x: 250, y: 370, width: 30, height: 30, speed: 2, direction: 1, minX: 200, maxX: 320, alive: true },
    { x: 420, y: 270, width: 30, height: 30, speed: 1.5, direction: -1, minX: 400, maxX: 470, alive: true },
    { x: 110, y: 220, width: 30, height: 30, speed: 1, direction: 1, minX: 100, maxX: 150, alive: true },
    // New enemies
    { x: 770, y: 320, width: 30, height: 30, speed: 1.5, direction: 1, minX: 750, maxX: 820, alive: true },
    { x: 1120, y: 270, width: 30, height: 30, speed: 2, direction: -1, minX: 1100, maxX: 1190, alive: true },
    { x: 1720, y: 320, width: 30, height: 30, speed: 1.5, direction: 1, minX: 1700, maxX: 1770, alive: true }
];

// Coins array - collectibles scattered around the level
const coins = [
    { x: 275, y: 360, width: 20, height: 20, collected: false },
    { x: 450, y: 260, width: 20, height: 20, collected: false },
    { x: 600, y: 160, width: 20, height: 20, collected: false },
    { x: 140, y: 210, width: 20, height: 20, collected: false },
    { x: 350, y: 470, width: 20, height: 20, collected: false },
    // New coins
    { x: 800, y: 310, width: 20, height: 20, collected: false },
    { x: 1000, y: 470, width: 20, height: 20, collected: false },
    { x: 1150, y: 260, width: 20, height: 20, collected: false },
    { x: 1350, y: 360, width: 20, height: 20, collected: false },
    { x: 1550, y: 210, width: 20, height: 20, collected: false },
    { x: 1750, y: 310, width: 20, height: 20, collected: false },
    { x: 2000, y: 470, width: 20, height: 20, collected: false }
];

// Game state
let gameOver = false;
let gameWon = false;
let score = 0;
let lives = 3;
let hasSuperJump = false;
let superJumpTimer = 0;
let showPowerUpMessage = false;
let powerUpMessageTimer = 0;
let gameTimer = 3600; // 60 seconds at 60fps
let coinsCollected = 0;
let enemiesDefeated = 0;
let powerUpsCollected = 0;

// Keyboard state - tracks which keys are pressed
const keys = {
    left: false,
    right: false,
    space: false
};

// Listen for keyboard presses
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') {
        keys.space = true;
        e.preventDefault(); // Prevent page scrolling
    }
    // Press R to restart
    if (e.key === 'r' || e.key === 'R') {
        if (gameOver || gameWon) {
            restartGame();
        }
    }
});

// Listen for keyboard releases
document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// Update game state - this runs every frame
function update() {
    // Don't update if game is over or won
    if (gameOver || gameWon) return;
    
    // Handle left/right movement
    if (keys.left) {
        player.velocityX = -player.speed;
    } else if (keys.right) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0; // Stop moving if no key pressed
    }
    
    // Handle jumping
    if (keys.space && player.isOnGround) {
        const jumpMultiplier = hasSuperJump ? 1.5 : 1;
        player.velocityY = -player.jumpPower * jumpMultiplier; // Negative = up
        player.isOnGround = false;
        playJumpSound();
    }
    
    // Apply gravity
    player.velocityY += GRAVITY;
    
    // Update horizontal position
    player.x += player.velocityX;
    
    // Store old Y position before moving
    const oldY = player.y;
    
    // Update vertical position
    player.y += player.velocityY;
    
    // Start by assuming player is in the air
    player.isOnGround = false;
    
    // Check collision with platforms
    for (let platform of platforms) {
        // Check if player is overlapping horizontally with platform
        if (player.x + player.width > platform.x && 
            player.x < platform.x + platform.width) {
            
            // Check if player is falling and landing on top of platform
            if (player.velocityY > 0 && // Moving downward
                oldY + player.height <= platform.y && // Was above platform before
                player.y + player.height >= platform.y) { // Now at or below platform top
                
                // Land on platform
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
            }
        }
    }
    
    // Check collision with power-up blocks
    for (let block of powerUpBlocks) {
        // Check if player is overlapping with block
        if (player.x + player.width > block.x &&
            player.x < block.x + block.width &&
            player.y + player.height > block.y &&
            player.y < block.y + block.height) {
            
            // Hit from below
            if (player.velocityY < 0 && oldY + player.height <= block.y + block.height) {
                player.y = block.y + block.height;
                player.velocityY = 0;
                
                // Activate block if not already hit
                if (!block.hit) {
                    block.hit = true;
                    
                    // Random direction for power-up to fall (left or right)
                    const direction = Math.random() < 0.5 ? -1 : 1;
                    
                    // Create a power-up (dog treat) that emerges from the block
                    powerUps.push({
                        x: block.x + block.width / 2 - 10,
                        y: block.y,
                        targetY: block.y - 30, // Emerge 30 pixels above block
                        width: 20,
                        height: 20,
                        velocityY: 0,
                        velocityX: direction * 4, // Move sideways
                        emerging: true,
                        collected: false
                    });
                    
                    playPowerUpSound();
                }
            }
            // Hit from above (landing on block)
            else if (player.velocityY > 0 && oldY + player.height <= block.y) {
                player.y = block.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
            }
            // Hit from left
            else if (player.velocityX > 0) {
                player.x = block.x - player.width;
                player.velocityX = 0;
            }
            // Hit from right
            else if (player.velocityX < 0) {
                player.x = block.x + block.width;
                player.velocityX = 0;
            }
        }
    }
    
    // Update power-ups
    for (let powerUp of powerUps) {
        if (powerUp.collected) continue;
        
        if (powerUp.emerging) {
            // Slowly emerge from block
            powerUp.y -= 1;
            if (powerUp.y <= powerUp.targetY) {
                powerUp.emerging = false;
            }
        } else {
            // Apply gravity and horizontal movement
            powerUp.velocityY += GRAVITY * 0.5;
            powerUp.y += powerUp.velocityY;
            powerUp.x += powerUp.velocityX;
            
            // Stop at ground
            if (powerUp.y + powerUp.height >= GROUND_HEIGHT) {
                powerUp.y = GROUND_HEIGHT - powerUp.height;
                powerUp.velocityY = 0;
                powerUp.velocityX = 0; // Stop moving horizontally on ground
            }
            
            // Bounce off platforms
            for (let platform of platforms) {
                if (powerUp.x + powerUp.width > platform.x &&
                    powerUp.x < platform.x + platform.width &&
                    powerUp.y + powerUp.height >= platform.y &&
                    powerUp.y < platform.y + platform.height) {
                    
                    powerUp.y = platform.y - powerUp.height;
                    powerUp.velocityY = 0;
                    powerUp.velocityX = 0; // Stop moving horizontally
                }
            }
        }
        
        // Check if player collected the power-up
        if (!powerUp.emerging &&
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y) {
            
            powerUp.collected = true;
            hasSuperJump = true;
            superJumpTimer = 300; // 5 seconds at 60fps
            showPowerUpMessage = true;
            powerUpMessageTimer = 180; // Show for 3 seconds (60 fps * 3)
            score += 200;
            powerUpsCollected++;
            playPowerUpSound();
        }
    }
    
    // Check if player hit the ground
    if (player.y + player.height >= GROUND_HEIGHT) {
        player.y = GROUND_HEIGHT - player.height; // Place on ground
        player.velocityY = 0;                     // Stop falling
        player.isOnGround = true;
    }
    
    // Keep player on screen (left and right boundaries)
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > LEVEL_WIDTH) {
        player.x = LEVEL_WIDTH - player.width;
    }
    
    // Update camera to follow player
    camera.x = player.x - camera.width / 2 + player.width / 2;
    
    // Keep camera within level bounds
    if (camera.x < 0) {
        camera.x = 0;
    }
    if (camera.x + camera.width > LEVEL_WIDTH) {
        camera.x = LEVEL_WIDTH - camera.width;
    }
    
    // Check if player reached the goal
    if (player.x >= GOAL_X) {
        gameWon = true;
        
        // Calculate bonus points
        const timeBonus = Math.ceil(gameTimer / 60) * 100; // Each remaining second = 100 points
        const lifeBonus = lives * 500; // Each remaining life = 500 points
        score += timeBonus + lifeBonus;
        
        playWinSound();
    }
    
    // Update power-up message timer
    if (showPowerUpMessage) {
        powerUpMessageTimer--;
        if (powerUpMessageTimer <= 0) {
            showPowerUpMessage = false;
        }
    }
    
    // Update super jump timer (5 seconds = 300 frames at 60fps)
    if (hasSuperJump) {
        superJumpTimer--;
        if (superJumpTimer <= 0) {
            hasSuperJump = false;
            playPowerUpEndSound();
        }
    }
    
    // Update game timer
    gameTimer--;
    if (gameTimer <= 0) {
        gameOver = true;
        playGameOverSound();
    }
    
    // Update all enemies
    for (let enemy of enemies) {
        if (!enemy.alive) continue; // Skip dead enemies
        
        // Move enemy
        enemy.x += enemy.speed * enemy.direction;
        
        // Make enemy turn around at boundaries
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.direction *= -1; // Reverse direction
        }
        
        // Check collision between player and enemy
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            // Check if player is jumping on enemy from above
            if (player.velocityY > 0 && oldY + player.height <= enemy.y + 10) {
                // Player stomped on enemy
                enemy.alive = false;
                player.velocityY = -8; // Bounce up a bit
                score += 100; // Award points
                enemiesDefeated++;
                playEnemyDefeatSound();
            } else {
                // Player hit enemy from side or below - lose a life
                lives--;
                playGameOverSound();
                
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    // Respawn player at start position
                    player.x = 100;
                    player.y = 100;
                    player.velocityX = 0;
                    player.velocityY = 0;
                }
            }
        }
    }
    
    // Check coin collection
    for (let coin of coins) {
        if (coin.collected) continue; // Skip collected coins
        
        // Check if player touches coin
        if (player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            
            coin.collected = true;
            score += 50; // Award points
            coinsCollected++;
            playCoinSound();
        }
    }
}

// Draw everything - this runs every frame
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save the context state
    ctx.save();
    
    // Apply camera translation
    ctx.translate(-camera.x, 0);
    
    // Draw the ground (extended for full level)
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.fillRect(0, GROUND_HEIGHT, LEVEL_WIDTH, canvas.height - GROUND_HEIGHT);
    
    // Draw platforms
    ctx.fillStyle = '#D2691E'; // Lighter brown for platforms
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add a border to make them look like blocks
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw power-up blocks (? blocks)
    for (let block of powerUpBlocks) {
        if (block.hit) {
            // Empty block (already hit)
            ctx.fillStyle = '#8B4513';
        } else {
            // Active block with question mark
            ctx.fillStyle = '#FFD700';
        }
        ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
        
        // Draw ? if not hit
        if (!block.hit) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', block.x + block.width / 2, block.y + block.height / 2 + 8);
            ctx.textAlign = 'left';
        }
    }
    
    // Draw power-ups (dog treats)
    for (let powerUp of powerUps) {
        if (powerUp.collected) continue;
        
        // Draw dog treat (bone shape)
        ctx.fillStyle = '#D2691E';
        
        // Bone ends
        ctx.fillRect(powerUp.x, powerUp.y + 5, 6, 10);
        ctx.fillRect(powerUp.x + 14, powerUp.y + 5, 6, 10);
        
        // Bone middle
        ctx.fillRect(powerUp.x + 6, powerUp.y + 8, 8, 4);
        
        // Add outline
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.strokeRect(powerUp.x, powerUp.y + 5, 6, 10);
        ctx.strokeRect(powerUp.x + 14, powerUp.y + 5, 6, 10);
        ctx.strokeRect(powerUp.x + 6, powerUp.y + 8, 8, 4);
    }
    
    // Draw the goal/finish line
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(GOAL_X, 0, 20, GROUND_HEIGHT);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText('GOAL', GOAL_X - 10, GROUND_HEIGHT - 10);
    
    // Draw the player as a golden retriever puppy (NES style)
    drawPuppy(player.x, player.y);
    
    // Draw all coins
    for (let coin of coins) {
        if (coin.collected) continue; // Skip collected coins
        
        // Draw coin as a yellow circle
        ctx.fillStyle = '#FFD700'; // Gold color
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a shine effect
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2 - 3, coin.y + coin.height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw all enemies
    for (let enemy of enemies) {
        if (!enemy.alive) continue; // Skip dead enemies
        
        ctx.fillStyle = '#8B4513'; // Brown color for enemy
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Add eyes to make it look more like an enemy
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 8, 8);   // Left eye
        ctx.fillRect(enemy.x + 17, enemy.y + 8, 8, 8);  // Right eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 7, enemy.y + 10, 4, 4);  // Left pupil
        ctx.fillRect(enemy.x + 19, enemy.y + 10, 4, 4); // Right pupil
    }
    
    // Restore context (remove camera translation for HUD)
    ctx.restore();
    
    // Draw HUD (score and lives) - stays on screen
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, 10, 55);
    
    // Draw timer
    const secondsLeft = Math.ceil(gameTimer / 60);
    const timerColor = secondsLeft <= 10 ? '#FF0000' : '#FFFFFF'; // Red when low
    ctx.fillStyle = timerColor;
    ctx.fillText(`Time: ${secondsLeft}s`, 10, 105);
    
    if (hasSuperJump) {
        const superJumpSeconds = Math.ceil(superJumpTimer / 60);
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`⚡ SUPER JUMP (${superJumpSeconds}s)`, 10, 80);
    }
    
    // Draw power-up message
    if (showPowerUpMessage) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(canvas.width / 2 - 150, 150, 300, 60);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SUPER JUMP UNLOCKED!', canvas.width / 2, 185);
        ctx.textAlign = 'left';
    }
    
    // Draw game over message if needed
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 90);
        ctx.textAlign = 'left'; // Reset alignment
    }
    
    // Draw win message if needed
    if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', canvas.width / 2, 80);
        
        // Score breakdown
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        
        const timeBonus = Math.ceil(gameTimer / 60) * 100;
        const lifeBonus = lives * 500;
        const coinPoints = coinsCollected * 50;
        const enemyPoints = enemiesDefeated * 100;
        const powerUpPoints = powerUpsCollected * 200;
        
        let yPos = 150;
        ctx.fillText('SCORE BREAKDOWN', canvas.width / 2, yPos);
        yPos += 40;
        
        ctx.fillText(`Coins: ${coinsCollected} × 50 = ${coinPoints}`, canvas.width / 2, yPos);
        yPos += 30;
        ctx.fillText(`Enemies: ${enemiesDefeated} × 100 = ${enemyPoints}`, canvas.width / 2, yPos);
        yPos += 30;
        ctx.fillText(`Power-ups: ${powerUpsCollected} × 200 = ${powerUpPoints}`, canvas.width / 2, yPos);
        yPos += 30;
        
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`Time Bonus: ${Math.ceil(gameTimer / 60)}s × 100 = ${timeBonus}`, canvas.width / 2, yPos);
        yPos += 30;
        ctx.fillText(`Life Bonus: ${lives} × 500 = ${lifeBonus}`, canvas.width / 2, yPos);
        yPos += 40;
        
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`TOTAL SCORE: ${score}`, canvas.width / 2, yPos);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.fillText('Press R to Play Again', canvas.width / 2, yPos + 50);
        ctx.textAlign = 'left'; // Reset alignment
    }
}

// Draw a golden retriever puppy in NES pixel art style
function drawPuppy(x, y) {
    const pixelSize = 4; // Each "pixel" is 4x4 canvas pixels for NES look
    
    // Helper function to draw a pixel
    function pixel(px, py, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize, pixelSize);
    }
    
    // Golden retriever color palette (NES-style limited colors)
    const gold = '#D4A574';      // Main body color
    const darkGold = '#B8860B';  // Darker gold for shading
    const cream = '#F5DEB3';     // Lighter areas
    const black = '#000000';     // Eyes, nose, outline
    const pink = '#FF69B4';      // Tongue
    
    // Body outline and main shape (8x8 grid)
    // Row 0 - Ears
    pixel(1, 0, darkGold);
    pixel(2, 0, darkGold);
    pixel(5, 0, darkGold);
    pixel(6, 0, darkGold);
    
    // Row 1 - Top of head
    pixel(1, 1, darkGold);
    pixel(2, 1, gold);
    pixel(3, 1, gold);
    pixel(4, 1, gold);
    pixel(5, 1, gold);
    pixel(6, 1, darkGold);
    
    // Row 2 - Face with eyes
    pixel(1, 2, gold);
    pixel(2, 2, black);      // Left eye
    pixel(3, 2, cream);
    pixel(4, 2, cream);
    pixel(5, 2, black);      // Right eye
    pixel(6, 2, gold);
    
    // Row 3 - Snout
    pixel(1, 3, gold);
    pixel(2, 3, cream);
    pixel(3, 3, black);      // Nose
    pixel(4, 3, black);      // Nose
    pixel(5, 3, cream);
    pixel(6, 3, gold);
    
    // Row 4 - Mouth/tongue
    pixel(1, 4, gold);
    pixel(2, 4, cream);
    pixel(3, 4, pink);       // Tongue
    pixel(4, 4, cream);
    pixel(5, 4, cream);
    pixel(6, 4, gold);
    
    // Row 5 - Neck/chest
    pixel(1, 5, gold);
    pixel(2, 5, gold);
    pixel(3, 5, cream);
    pixel(4, 5, cream);
    pixel(5, 5, gold);
    pixel(6, 5, gold);
    
    // Row 6 - Body
    pixel(1, 6, darkGold);
    pixel(2, 6, gold);
    pixel(3, 6, gold);
    pixel(4, 6, gold);
    pixel(5, 6, gold);
    pixel(6, 6, darkGold);
    
    // Row 7 - Legs
    pixel(1, 7, darkGold);
    pixel(2, 7, darkGold);
    pixel(5, 7, darkGold);
    pixel(6, 7, darkGold);
}

// Game loop - the heartbeat of the game
function gameLoop() {
    update(); // Update game state
    draw();   // Draw everything
    
    requestAnimationFrame(gameLoop); // Run again next frame
}

// Start the game
gameLoop();

// Restart game function
function restartGame() {
    // Reset player
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isOnGround = false;
    
    // Reset camera
    camera.x = 0;
    
    // Reset game state
    gameOver = false;
    gameWon = false;
    score = 0;
    lives = 3;
    hasSuperJump = false;
    superJumpTimer = 0;
    showPowerUpMessage = false;
    powerUpMessageTimer = 0;
    gameTimer = 3600; // Reset to 60 seconds
    coinsCollected = 0;
    enemiesDefeated = 0;
    powerUpsCollected = 0;
    
    // Reset power-up blocks
    for (let block of powerUpBlocks) {
        block.hit = false;
    }
    
    // Clear power-ups
    powerUps.length = 0;
    
    // Reset all enemies
    enemies[0] = { x: 250, y: 370, width: 30, height: 30, speed: 2, direction: 1, minX: 200, maxX: 320, alive: true };
    enemies[1] = { x: 420, y: 270, width: 30, height: 30, speed: 1.5, direction: -1, minX: 400, maxX: 470, alive: true };
    enemies[2] = { x: 110, y: 220, width: 30, height: 30, speed: 1, direction: 1, minX: 100, maxX: 150, alive: true };
    enemies[3] = { x: 770, y: 320, width: 30, height: 30, speed: 1.5, direction: 1, minX: 750, maxX: 820, alive: true };
    enemies[4] = { x: 1120, y: 270, width: 30, height: 30, speed: 2, direction: -1, minX: 1100, maxX: 1190, alive: true };
    enemies[5] = { x: 1720, y: 320, width: 30, height: 30, speed: 1.5, direction: 1, minX: 1700, maxX: 1770, alive: true };
    
    // Reset all coins
    for (let coin of coins) {
        coin.collected = false;
    }
}
