// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -15;
const MOVEMENT_SPEED = 3;
const PLATFORM_HEIGHT = 20;
const MEI_WIDTH = 50;
const MEI_HEIGHT = 60;
const ACORN_SIZE = 30;
const PAVESA_SIZE = 30;
const TOTORO_SIZE = 80;
const DOOR_SIZE = 60;

// Game state
let gameLoop;
let score = 0;
let currentLevel = 1;
let platforms = [];
let acorns = [];
let pavesas = [];
let butterflies = [];
let time = 0;
let assetsLoaded = false;
let acornReturnAnimation = false;
let acornReturnProgress = 0;
let acornReturnDuration = 70;
let wasColliding = false;
let acornTrajectories = [];
let door = {
    x: 0,
    y: 0,
    visible: false,
    radius: 40,
    butterflies: []
};

// Level configurations
const levels = [
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 300, y: 400, width: 200, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 100, y: 300, width: 200, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 500, y: 200, width: 200, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 350, y: 350, collected: false, rotation: 0 },
            { x: 150, y: 250, collected: false, rotation: 0 },
            { x: 550, y: 150, collected: false, rotation: 0 }
        ]
    },
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 200, y: 400, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 450, y: 400, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 100, y: 300, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 550, y: 300, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 325, y: 200, width: 150, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 275, y: 350, collected: false, rotation: 0 },
            { x: 525, y: 350, collected: false, rotation: 0 },
            { x: 175, y: 250, collected: false, rotation: 0 },
            { x: 625, y: 250, collected: false, rotation: 0 },
            { x: 400, y: 150, collected: false, rotation: 0 }
        ]
    },
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 150, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 350, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 550, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 250, y: 300, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 450, y: 300, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 350, y: 200, width: 100, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 200, y: 350, collected: false, rotation: 0 },
            { x: 400, y: 350, collected: false, rotation: 0 },
            { x: 600, y: 350, collected: false, rotation: 0 },
            { x: 300, y: 250, collected: false, rotation: 0 },
            { x: 500, y: 250, collected: false, rotation: 0 },
            { x: 400, y: 150, collected: false, rotation: 0 }
        ]
    },
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 200, y: 400, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 450, y: 400, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 100, y: 300, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 550, y: 300, width: 150, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 325, y: 200, width: 150, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 275, y: 350, collected: false, rotation: 0 },
            { x: 525, y: 350, collected: false, rotation: 0 },
            { x: 175, y: 250, collected: false, rotation: 0 },
            { x: 625, y: 250, collected: false, rotation: 0 },
            { x: 400, y: 150, collected: false, rotation: 0 }
        ]
    },
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 150, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 350, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 550, y: 400, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 250, y: 300, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 450, y: 300, width: 100, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 350, y: 200, width: 100, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 200, y: 350, collected: false, rotation: 0 },
            { x: 400, y: 350, collected: false, rotation: 0 },
            { x: 600, y: 350, collected: false, rotation: 0 },
            { x: 300, y: 250, collected: false, rotation: 0 },
            { x: 500, y: 250, collected: false, rotation: 0 },
            { x: 400, y: 150, collected: false, rotation: 0 }
        ]
    },
    {
        platforms: [
            { x: 0, y: 500, width: 800, height: PLATFORM_HEIGHT, type: 'ground' },
            { x: 300, y: 400, width: 200, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 100, y: 300, width: 200, height: PLATFORM_HEIGHT, type: 'platform' },
            { x: 500, y: 200, width: 200, height: PLATFORM_HEIGHT, type: 'platform' }
        ],
        acorns: [
            { x: 350, y: 350, collected: false, rotation: 0 },
            { x: 150, y: 250, collected: false, rotation: 0 },
            { x: 550, y: 150, collected: false, rotation: 0 }
        ]
    }
];

// Player state
const player = {
    x: 100,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    direction: 1 // 1 for right, -1 for left
};

// Totoro state
const totoro = {
    x: 700,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    direction: -1,
    speed: 2
};

// Load game assets
const meiSprite = new Image();
const acornSprite = new Image();
const pavesaSprite = new Image();
const backgroundImage1 = new Image();
const backgroundImage2 = new Image();
const backgroundImage3 = new Image();
const backgroundImage4 = new Image();
const backgroundImage5 = new Image();
const backgroundImage6 = new Image();
const totoroSprite = new Image();

// Function to load all assets
function loadAssets() {
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalAssets = 8; // Updated to include all assets
        let loadErrors = [];

        function assetLoaded() {
            loadedCount++;
            if (loadedCount === totalAssets) {
                if (loadErrors.length > 0) {
                    reject(new Error('Failed to load: ' + loadErrors.join(', ')));
                } else {
                    assetsLoaded = true;
                    resolve();
                }
            }
        }

        function handleError(assetName) {
            loadErrors.push(assetName);
            console.error(`Error loading ${assetName}`);
            assetLoaded();
        }

        // Set up error handlers first
        meiSprite.onerror = () => handleError('mei.png');
        acornSprite.onerror = () => handleError('acorn.png');
        pavesaSprite.onerror = () => handleError('Pavesa.png');
        backgroundImage1.onerror = () => handleError('Fondo1.png');
        backgroundImage2.onerror = () => handleError('ureshii.png');
        backgroundImage3.onerror = () => handleError('Fondo2.jpg');
        backgroundImage4.onerror = () => handleError('Fondo3.jpeg');
        backgroundImage5.onerror = () => handleError('neko.png');
        backgroundImage6.onerror = () => handleError('oshimai.png');
        totoroSprite.onerror = () => handleError('totorito.png');

        // Set up load handlers
        meiSprite.onload = assetLoaded;
        acornSprite.onload = assetLoaded;
        pavesaSprite.onload = assetLoaded;
        backgroundImage1.onload = assetLoaded;
        backgroundImage2.onload = assetLoaded;
        backgroundImage3.onload = assetLoaded;
        backgroundImage4.onload = assetLoaded;
        backgroundImage5.onload = assetLoaded;
        backgroundImage6.onload = assetLoaded;
        totoroSprite.onload = assetLoaded;

        // Start loading images
        meiSprite.src = 'mei.png';
        acornSprite.src = 'acorn.png';
        pavesaSprite.src = 'Pavesa.png';
        backgroundImage1.src = 'Fondo1.png';
        backgroundImage2.src = 'ureshii.png';
        backgroundImage3.src = 'Fondo2.jpg';
        backgroundImage4.src = 'Fondo3.jpeg';
        backgroundImage5.src = 'neko.png';
        backgroundImage6.src = 'oshimai.png';
        totoroSprite.src = 'totorito.png';
    });
}

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to clear all keyboard states
function clearKeyboardStates() {
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    keys[' '] = false;
}

// Initialize game
async function initGame() {
    try {
        await loadAssets();
        
        // Clear keyboard states
        clearKeyboardStates();
        
        // Load first level
        const levelConfig = levels[0];
        platforms = JSON.parse(JSON.stringify(levelConfig.platforms));
        acorns = JSON.parse(JSON.stringify(levelConfig.acorns));
        
        // Reset all acorns
        acorns.forEach(acorn => {
            acorn.collected = false;
            acorn.rotation = 0;
        });
        
        // Initialize door position
        const bottomPlatform = platforms.find(p => p.type === 'ground');
        door.x = canvas.width - door.radius * 2 - 20;
        door.y = bottomPlatform.y - door.radius * 2;
        door.visible = false;
        
        // Initialize door butterflies
        door.butterflies = [];
        for (let i = 0; i < 5; i++) {
            door.butterflies.push({
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                speed: 0.3 + Math.random() * 0.2,
                wingAngle: Math.random() * Math.PI * 2,
                wingSpeed: 0.15 + Math.random() * 0.1,
                size: 8 + Math.random() * 4,
                color: `hsl(${Math.random() * 30 + 200}, 70%, 60%)`,
                changeTargetTime: 0,
                targetChangeInterval: 60 + Math.random() * 40,
                verticalOscillation: Math.random() * 0.1 + 0.05,
                horizontalOscillation: Math.random() * 0.1 + 0.05
            });
        }

        // Reset player state completely
        player.x = 100;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        player.isJumping = false;
        player.direction = 1;

        // Reset Totoro state completely
        totoro.x = 700;
        // Set Totoro's initial y position based on level
        if (currentLevel === 3) {
            totoro.y = 150; // Start higher in level 3
        } else if (currentLevel === 5) {
            totoro.y = 300;
            totoro.x = 400; // Start closer to player
            totoro.speed = 3; // Increase speed for level 5
        } else {
            totoro.y = 300;
        }
        totoro.velocityX = 0;
        totoro.velocityY = 0;
        totoro.isJumping = false;
        totoro.direction = -1;

        // Create pavesas
        pavesas = []; // Clear existing pavesas
        for (let i = 0; i < 15; i++) {
            pavesas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.7,
                size: PAVESA_SIZE + Math.random() * 10,
                speed: 0.2 + Math.random() * 0.3,
                angle: Math.random() * Math.PI * 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: 0.6 + Math.random() * 0.4
            });
        }

        // Update score display
        updateScoreDisplay();

        // Start game loop
        if (!gameLoop) {
            gameLoop = setInterval(update, 1000 / 60);
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Error loading game assets. Please check console for details.', 50, 50);
    }
}

// Handle keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update game state
function update() {
    time += 0.1;
    
    // Update acorn rotations
    acorns.forEach(acorn => {
        if (!acorn.collected) {
            acorn.rotation += 0.05;
        }
    });

    // Handle acorn return animation
    if (acornReturnAnimation) {
        acornReturnProgress++;
        if (acornReturnProgress >= acornReturnDuration) {
            acornReturnAnimation = false;
            acornReturnProgress = 0;
        }
    }

    // Check if all acorns are collected
    const allAcornsCollected = acorns.every(acorn => acorn.collected);
    if (allAcornsCollected) {
        door.visible = true;
    }

    // Check collision with door
    if (door.visible) {
        // Calculate the center of the door
        const doorCenterX = door.x + door.radius;
        const doorCenterY = door.y + door.radius;
        
        // Calculate the center of Mei
        const meiCenterX = player.x + MEI_WIDTH/2;
        const meiCenterY = player.y + MEI_HEIGHT/2;
        
        // Calculate distance between centers
        const dx = meiCenterX - doorCenterX;
        const dy = meiCenterY - doorCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if Mei is inside the door (radius)
        if (distance < door.radius) {
            // Transition to next level
            nextLevel();
        }
    }

    // Update pavesas
    pavesas.forEach(pavesa => {
        // Gentle floating movement
        pavesa.angle += (Math.random() - 0.5) * 0.1;
        pavesa.x += Math.cos(pavesa.angle) * pavesa.speed;
        pavesa.y += Math.sin(pavesa.angle) * pavesa.speed;
        pavesa.rotation += pavesa.rotationSpeed;
        
        // Wrap around screen
        if (pavesa.x < -PAVESA_SIZE) pavesa.x = canvas.width;
        if (pavesa.x > canvas.width) pavesa.x = -PAVESA_SIZE;
        if (pavesa.y < -PAVESA_SIZE) pavesa.y = canvas.height;
        if (pavesa.y > canvas.height) pavesa.y = -PAVESA_SIZE;
    });

    // Update Totoro's movement
    // Make Totoro follow Mei with smoother movement
    const distanceToPlayer = player.x - totoro.x;
    if (Math.abs(distanceToPlayer) > 50) { // Only move if far enough
        if (distanceToPlayer > 0) {
            totoro.velocityX = totoro.speed;
            totoro.direction = -1; // Left
        } else {
            totoro.velocityX = -totoro.speed;
            totoro.direction = 1; // Right
        }
    } else {
        totoro.velocityX = 0; // Stop when close to player
    }

    // Apply gravity to Totoro
    totoro.velocityY += GRAVITY;
    totoro.y += totoro.velocityY;

    // Check Totoro's platform collisions
    let onPlatform = false;
    platforms.forEach(platform => {
        if (totoro.y + TOTORO_SIZE > platform.y &&
            totoro.y < platform.y + platform.height &&
            totoro.x + TOTORO_SIZE > platform.x &&
            totoro.x < platform.x + platform.width) {
            if (totoro.velocityY > 0) {
                totoro.y = platform.y - TOTORO_SIZE;
                totoro.velocityY = 0;
                totoro.isJumping = false;
                onPlatform = true;
            }
        }
    });

    // Update Totoro's position
    totoro.x += totoro.velocityX;

    // Keep Totoro in bounds
    if (totoro.x < 0) totoro.x = 0;
    if (totoro.x + TOTORO_SIZE > canvas.width) totoro.x = canvas.width - TOTORO_SIZE;

    // Check collision between Mei and Totoro
    const isColliding = Math.abs(player.x - totoro.x) < MEI_WIDTH &&
                       Math.abs(player.y - totoro.y) < MEI_HEIGHT;
    
    // Only trigger animation on new collision
    if (isColliding && !wasColliding) {
        acornReturnAnimation = true;
        acornReturnProgress = 0;
        
        // Create unique trajectories for each acorn
        acornTrajectories = acorns.map(acorn => {
            const startX = player.x;
            const startY = player.y;
            const endX = acorn.x;
            const endY = acorn.y;
            
            // Create a curved path with random control points
            const controlPoint1 = {
                x: startX + (endX - startX) * 0.3 + (Math.random() - 0.5) * 100,
                y: startY - 50 + (Math.random() - 0.5) * 50
            };
            const controlPoint2 = {
                x: startX + (endX - startX) * 0.7 + (Math.random() - 0.5) * 100,
                y: startY - 50 + (Math.random() - 0.5) * 50
            };
            
            return {
                startX, startY, endX, endY,
                controlPoint1, controlPoint2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                currentRotation: Math.random() * Math.PI * 2,
                floatOffset: Math.random() * Math.PI * 2,
                floatAmplitude: 5 + Math.random() * 5
            };
        });
        
        // Reset all acorns
        acorns.forEach(acorn => {
            acorn.collected = false;
        });
        score = 0;
        updateScoreDisplay();
    }
    
    // Update collision state
    wasColliding = isColliding;

    // Handle player movement - only move when keys are pressed
    if (keys['ArrowLeft']) {
        player.velocityX = -MOVEMENT_SPEED;
        player.direction = -1;
    } else if (keys['ArrowRight']) {
        player.velocityX = MOVEMENT_SPEED;
        player.direction = 1;
    } else {
        player.velocityX = 0; // Stop movement when no keys are pressed
    }

    // Handle jumping
    if (keys[' '] && !player.isJumping) {
        player.velocityY = JUMP_FORCE;
        player.isJumping = true;
    }

    // Apply gravity
    player.velocityY += GRAVITY;

    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Check platform collisions
    platforms.forEach(platform => {
        if (player.y + MEI_HEIGHT > platform.y &&
            player.y < platform.y + platform.height &&
            player.x + MEI_WIDTH > platform.x &&
            player.x < platform.x + platform.width) {
            if (player.velocityY > 0) {
                player.y = platform.y - MEI_HEIGHT;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    });

    // Check acorn collisions
    acorns.forEach((acorn, index) => {
        if (!acorn.collected &&
            player.x < acorn.x + ACORN_SIZE &&
            player.x + MEI_WIDTH > acorn.x &&
            player.y < acorn.y + ACORN_SIZE &&
            player.y + MEI_HEIGHT > acorn.y) {
            acorn.collected = true;
            score++;
            updateScoreDisplay();
        }
    });

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + MEI_WIDTH > canvas.width) player.x = canvas.width - MEI_WIDTH;
    if (player.y < 0) player.y = 0;
    if (player.y + MEI_HEIGHT > canvas.height) {
        player.y = canvas.height - MEI_HEIGHT;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // Update butterflies
    door.butterflies.forEach(butterfly => {
        // Update wing animation with smoother movement
        butterfly.wingAngle += butterfly.wingSpeed;
        
        // Change target position with more natural intervals
        butterfly.changeTargetTime++;
        if (butterfly.changeTargetTime >= butterfly.targetChangeInterval) {
            butterfly.changeTargetTime = 0;
            // Set new target position with more natural variation
            const angle = Math.random() * Math.PI * 2;
            const distance = door.radius + 15 + Math.random() * 30;
            butterfly.targetX = door.x + door.radius + Math.cos(angle) * distance;
            butterfly.targetY = door.y + door.radius + Math.sin(angle) * distance;
        }
        
        // Move towards target with smoother acceleration
        const dx = butterfly.targetX - butterfly.x;
        const dy = butterfly.targetY - butterfly.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Smoother speed variation
            const speed = butterfly.speed * (0.4 + Math.sin(time * 0.1) * 0.2);
            
            // Add natural horizontal and vertical oscillation
            const horizontalMove = Math.sin(time * 0.2) * butterfly.horizontalOscillation;
            const verticalMove = Math.sin(time * 0.3) * butterfly.verticalOscillation;
            
            // Apply movement with smooth acceleration
            butterfly.x += (dx / distance) * speed + horizontalMove;
            butterfly.y += (dy / distance) * speed + verticalMove;
        }
    });

    // Draw game state
    draw();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image based on current level
    let currentBackground;
    switch(currentLevel) {
        case 1:
            currentBackground = backgroundImage1;
            break;
        case 2:
            currentBackground = backgroundImage2;
            break;
        case 3:
            currentBackground = backgroundImage3;
            break;
        case 4:
            currentBackground = backgroundImage4;
            break;
        case 5:
            currentBackground = backgroundImage5;
            break;
        case 6:
            currentBackground = backgroundImage6;
            break;
        default:
            currentBackground = backgroundImage1;
    }

    // Draw background if it's loaded
    if (currentBackground.complete && currentBackground.naturalWidth > 0) {
        // Reset any previous transformations
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Calculate scale to cover the canvas while maintaining aspect ratio
        const scale = Math.max(
            canvas.width / currentBackground.naturalWidth,
            canvas.height / currentBackground.naturalHeight
        );
        const x = (canvas.width - currentBackground.naturalWidth * scale) / 2;
        const y = (canvas.height - currentBackground.naturalHeight * scale) / 2;
        
        // Draw the background image
        ctx.drawImage(
            currentBackground,
            x, y,
            currentBackground.naturalWidth * scale,
            currentBackground.naturalHeight * scale
        );
    } else {
        // Draw a temporary background while images load
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw pavesas
    pavesas.forEach(pavesa => {
        ctx.save();
        ctx.translate(pavesa.x, pavesa.y);
        ctx.rotate(pavesa.rotation);
        ctx.globalAlpha = pavesa.opacity;
        ctx.drawImage(pavesaSprite, -pavesa.size/2, -pavesa.size/2, pavesa.size, pavesa.size);
        ctx.restore();
    });

    // Draw platforms with blueish texture
    platforms.forEach(platform => {
        // Base platform with gradient
        const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, 'rgba(100, 150, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(70, 120, 180, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add texture details
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for(let i = 0; i < platform.width; i += 10) {
            for(let j = 0; j < platform.height; j += 10) {
                if(Math.random() > 0.7) {
                    ctx.fillRect(platform.x + i, platform.y + j, 2, 2);
                }
            }
        }

        // Add subtle border
        ctx.strokeStyle = 'rgba(150, 200, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw acorns with enhanced glow and effects
    acorns.forEach((acorn, index) => {
        if (!acorn.collected) {
            // Pulsating effect
            const pulseSize = ACORN_SIZE * (1 + Math.sin(time * 2) * 0.1);
            
            // Draw acorn with enhanced effects
            ctx.save();
            
            // If in return animation, add magical floating effect
            if (acornReturnAnimation && acornTrajectories[index]) {
                const progress = acornReturnProgress / acornReturnDuration;
                const trajectory = acornTrajectories[index];
                
                // Calculate position on the curved path
                const t = progress;
                const mt = 1 - t;
                const x = mt * mt * mt * trajectory.startX +
                         3 * mt * mt * t * trajectory.controlPoint1.x +
                         3 * mt * t * t * trajectory.controlPoint2.x +
                         t * t * t * trajectory.endX;
                const y = mt * mt * mt * trajectory.startY +
                         3 * mt * mt * t * trajectory.controlPoint1.y +
                         3 * mt * t * t * trajectory.controlPoint2.y +
                         t * t * t * trajectory.endY;
                
                // Add floating effect
                const floatY = Math.sin(time * 2 + trajectory.floatOffset) * trajectory.floatAmplitude;
                
                // Update rotation
                trajectory.currentRotation += trajectory.rotationSpeed;
                
                // Draw trail effect
                const trailLength = 15;
                const trailOpacity = 0.2 * (1 - progress); // Reduced from 0.3
                
                for (let i = 0; i < trailLength; i++) {
                    const trailProgress = progress - (i / trailLength) * 0.2;
                    if (trailProgress > 0) {
                        const trailT = trailProgress;
                        const trailMt = 1 - trailT;
                        const trailX = trailMt * trailMt * trailMt * trajectory.startX +
                                     3 * trailMt * trailMt * trailT * trajectory.controlPoint1.x +
                                     3 * trailMt * trailT * trailT * trajectory.controlPoint2.x +
                                     trailT * trailT * trailT * trajectory.endX;
                        const trailY = trailMt * trailMt * trailMt * trajectory.startY +
                                     3 * trailMt * trailMt * trailT * trajectory.controlPoint1.y +
                                     3 * trailMt * trailT * trailT * trajectory.controlPoint2.y +
                                     trailT * trailT * trailT * trajectory.endY;
                        
                        ctx.globalAlpha = trailOpacity * (1 - i / trailLength);
                        ctx.translate(trailX + ACORN_SIZE/2, trailY + ACORN_SIZE/2 + floatY);
                        ctx.rotate(trajectory.currentRotation);
                        ctx.drawImage(acornSprite, -pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
                        ctx.restore();
                        ctx.save();
                    }
                }
                
                // Draw main acorn
                ctx.translate(x + ACORN_SIZE/2, y + ACORN_SIZE/2 + floatY);
                ctx.rotate(trajectory.currentRotation);
            } else {
                ctx.translate(acorn.x + ACORN_SIZE/2, acorn.y + ACORN_SIZE/2);
                ctx.rotate(acorn.rotation);
            }
            
            // Draw the acorn
            ctx.drawImage(acornSprite, -pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
            
            // Add a subtle shine on top of the acorn
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Reduced from 0.3
            ctx.beginPath();
            ctx.arc(-pulseSize/4, -pulseSize/4, pulseSize/6, 0, Math.PI * 2);
            ctx.fill();
            
            // Enhanced glow effect (drawn after the acorn)
            const glow = ctx.createRadialGradient(
                0, 0, 0,
                0, 0, ACORN_SIZE * 1.5
            );
            glow.addColorStop(0, 'rgba(255, 255, 200, 0.3)'); // Reduced from 0.6
            glow.addColorStop(0.5, 'rgba(255, 255, 200, 0.15)'); // Reduced from 0.3
            glow.addColorStop(1, 'rgba(255, 255, 200, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, ACORN_SIZE * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    });

    // Draw Totoro
    ctx.save();
    if (totoro.direction === -1) { // Left
        ctx.drawImage(totoroSprite, totoro.x, totoro.y, TOTORO_SIZE, TOTORO_SIZE);
    } else { // Right
        ctx.translate(totoro.x + TOTORO_SIZE, totoro.y);
        ctx.scale(-1, 1);
        ctx.drawImage(totoroSprite, 0, 0, TOTORO_SIZE, TOTORO_SIZE);
    }
    ctx.restore();

    // Draw Mei with proper direction and shadow
    ctx.save();
    // Draw shadow with blur effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(player.x + MEI_WIDTH/2, player.y + MEI_HEIGHT + 5, 
                MEI_WIDTH/2, MEI_WIDTH/4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    if (player.direction === -1) {
        ctx.translate(player.x + MEI_WIDTH, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(meiSprite, 0, 0, MEI_WIDTH, MEI_HEIGHT);
    } else {
        ctx.drawImage(meiSprite, player.x, player.y, MEI_WIDTH, MEI_HEIGHT);
    }
    ctx.restore();

    // Draw door if visible
    if (door.visible) {
        // Draw magical cave entrance
        ctx.save();
        
        // Outer glow - softer color
        const outerGlow = ctx.createRadialGradient(
            door.x + door.radius, door.y + door.radius, 0,
            door.x + door.radius, door.y + door.radius, door.radius * 2
        );
        outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        outerGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(door.x + door.radius, door.y + door.radius, door.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow - softer color
        const innerGlow = ctx.createRadialGradient(
            door.x + door.radius, door.y + door.radius, 0,
            door.x + door.radius, door.y + door.radius, door.radius
        );
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        innerGlow.addColorStop(0.7, 'rgba(240, 240, 255, 0.6)');
        innerGlow.addColorStop(1, 'rgba(220, 220, 255, 0.4)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(door.x + door.radius, door.y + door.radius, door.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw butterflies with more realistic movement
        door.butterflies.forEach(butterfly => {
            // Update wing animation with smoother movement
            butterfly.wingAngle += butterfly.wingSpeed;
            
            // Change target position with more natural intervals
            butterfly.changeTargetTime++;
            if (butterfly.changeTargetTime >= butterfly.targetChangeInterval) {
                butterfly.changeTargetTime = 0;
                // Set new target position with more natural variation
                const angle = Math.random() * Math.PI * 2;
                const distance = door.radius + 15 + Math.random() * 30;
                butterfly.targetX = door.x + door.radius + Math.cos(angle) * distance;
                butterfly.targetY = door.y + door.radius + Math.sin(angle) * distance;
            }
            
            // Move towards target with smoother acceleration
            const dx = butterfly.targetX - butterfly.x;
            const dy = butterfly.targetY - butterfly.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Smoother speed variation
                const speed = butterfly.speed * (0.4 + Math.sin(time * 0.1) * 0.2);
                
                // Add natural horizontal and vertical oscillation
                const horizontalMove = Math.sin(time * 0.2) * butterfly.horizontalOscillation;
                const verticalMove = Math.sin(time * 0.3) * butterfly.verticalOscillation;
                
                // Apply movement with smooth acceleration
                butterfly.x += (dx / distance) * speed + horizontalMove;
                butterfly.y += (dy / distance) * speed + verticalMove;
            }
            
            ctx.save();
            ctx.translate(butterfly.x, butterfly.y);
            
            // Draw butterfly body
            ctx.fillStyle = butterfly.color;
            ctx.beginPath();
            ctx.arc(0, 0, butterfly.size / 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw wings with more natural movement
            ctx.fillStyle = butterfly.color + '80';
            const wingSize = butterfly.size;
            
            // Left wing with smoother flapping
            ctx.save();
            const leftWingAngle = Math.sin(butterfly.wingAngle) * 0.6; // Reduced angle for more natural movement
            ctx.rotate(leftWingAngle);
            ctx.beginPath();
            ctx.ellipse(-wingSize/2, 0, wingSize/2, wingSize/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Right wing with smoother flapping
            ctx.save();
            const rightWingAngle = -Math.sin(butterfly.wingAngle) * 0.6; // Reduced angle for more natural movement
            ctx.rotate(rightWingAngle);
            ctx.beginPath();
            ctx.ellipse(wingSize/2, 0, wingSize/2, wingSize/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            ctx.restore();
        });

        ctx.restore();
    }
}

// Helper function to draw mountains with more detail
function drawMountains() {
    // Base mountains
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.6);
    ctx.lineTo(200, canvas.height * 0.4);
    ctx.lineTo(400, canvas.height * 0.5);
    ctx.lineTo(600, canvas.height * 0.3);
    ctx.lineTo(800, canvas.height * 0.6);
    ctx.lineTo(800, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Mountain details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(200, canvas.height * 0.4);
    ctx.lineTo(250, canvas.height * 0.35);
    ctx.lineTo(300, canvas.height * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(500, canvas.height * 0.35);
    ctx.lineTo(550, canvas.height * 0.3);
    ctx.lineTo(600, canvas.height * 0.35);
    ctx.closePath();
    ctx.fill();
}

// Helper function to draw detailed flowers
function drawDetailedFlower(x, y) {
    // Stem with gradient
    const stemGradient = ctx.createLinearGradient(x, y, x, y - 20);
    stemGradient.addColorStop(0, '#228B22');
    stemGradient.addColorStop(1, '#32CD32');
    ctx.strokeStyle = stemGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20);
    ctx.stroke();

    // Leaves
    ctx.fillStyle = '#32CD32';
    // Left leaf
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.quadraticCurveTo(x - 8, y - 8, x - 5, y - 15);
    ctx.quadraticCurveTo(x - 2, y - 10, x, y - 10);
    ctx.fill();
    // Right leaf
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.quadraticCurveTo(x + 8, y - 8, x + 5, y - 15);
    ctx.quadraticCurveTo(x + 2, y - 10, x, y - 10);
    ctx.fill();

    // Petals with gradient
    const petalGradient = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, 8);
    petalGradient.addColorStop(0, '#FFB6C1');
    petalGradient.addColorStop(1, '#FF69B4');
    
    // Draw petals in a circle
    for(let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const petalX = x + Math.cos(angle) * 8;
        const petalY = y - 20 + Math.sin(angle) * 8;
        
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        
        ctx.fillStyle = petalGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    // Center with gradient
    const centerGradient = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, 4);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(x, y - 20, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Center details
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(x, y - 20, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Helper function to draw Ghibli-style clouds
function drawGhibliCloud(x, y, size) {
    // Main cloud body
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI * 2);
    ctx.arc(x + size/3, y - size/3, size/3, 0, Math.PI * 2);
    ctx.arc(x + size/2, y, size/3, 0, Math.PI * 2);
    ctx.arc(x - size/3, y - size/4, size/3, 0, Math.PI * 2);
    ctx.arc(x + size/4, y + size/4, size/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloud shading
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(x - size/6, y - size/6, size/3, 0, Math.PI * 2);
    ctx.arc(x + size/6, y - size/6, size/3, 0, Math.PI * 2);
    ctx.fill();
}

// Function to transition to next level
function nextLevel() {
    currentLevel++;
    
    // Check if we've completed all levels
    if (currentLevel > levels.length) {
        // Game completed!
        currentLevel = 1; // Reset to first level
        
        // Create and show completion modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 80%;
            animation: modalAppear 0.5s ease-out;
            position: relative;
            overflow: hidden;
        `;
        
        // Add floating acorns
        for (let i = 0; i < 4; i++) {
            const acorn = document.createElement('img');
            acorn.src = 'acorn.png';
            acorn.style.cssText = `
                position: absolute;
                width: 30px;
                height: auto;
                animation: floatAcorn${i} 3s infinite ease-in-out;
                opacity: 0.8;
            `;
            
            // Position acorns at different corners
            switch(i) {
                case 0:
                    acorn.style.top = '10px';
                    acorn.style.left = '10px';
                    break;
                case 1:
                    acorn.style.top = '10px';
                    acorn.style.right = '10px';
                    break;
                case 2:
                    acorn.style.bottom = '10px';
                    acorn.style.left = '10px';
                    break;
                case 3:
                    acorn.style.bottom = '10px';
                    acorn.style.right = '10px';
                    break;
            }
            
            modalContent.appendChild(acorn);
        }
        
        const title = document.createElement('h2');
        title.textContent = '¡Felicidades!';
        title.style.cssText = `
            color: #4a2c0a;
            margin: 0 0 20px 0;
            font-size: 28px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            position: relative;
            z-index: 1;
        `;
        
        const message = document.createElement('p');
        message.textContent = 'Has completado todos los niveles.';
        message.style.cssText = `
            color: #666;
            margin: 0 0 25px 0;
            font-size: 18px;
            line-height: 1.5;
            position: relative;
            z-index: 1;
        `;
        
        const button = document.createElement('button');
        button.textContent = 'Jugar de nuevo';
        button.style.cssText = `
            background: linear-gradient(135deg, #4a2c0a 0%, #6b4423 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            position: relative;
            z-index: 1;
        `;
        
        button.onmouseover = () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 8px rgba(0,0,0,0.2)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        };
        
        button.onclick = () => {
            document.body.removeChild(modal);
            // Reset game state
            score = 0;
            updateScoreDisplay();
            clearKeyboardStates();
        };
        
        // Add keyframe animations for floating acorns
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalAppear {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes floatAcorn0 {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(5px, 5px) rotate(5deg); }
            }
            @keyframes floatAcorn1 {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(-5px, 5px) rotate(-5deg); }
            }
            @keyframes floatAcorn2 {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(5px, -5px) rotate(-5deg); }
            }
            @keyframes floatAcorn3 {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(-5px, -5px) rotate(5deg); }
            }
        `;
        document.head.appendChild(style);
        
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(button);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    
    // Clear keyboard states
    clearKeyboardStates();
    
    // Reset game state for new level
    score = 0;
    updateScoreDisplay();
    
    // Load level configuration
    const levelConfig = levels[currentLevel - 1];
    platforms = JSON.parse(JSON.stringify(levelConfig.platforms)); // Deep copy
    acorns = JSON.parse(JSON.stringify(levelConfig.acorns)); // Deep copy
    
    // Reset all acorns
    acorns.forEach(acorn => {
        acorn.collected = false;
        acorn.rotation = 0;
    });
    
    // Reset player state completely
    player.x = 100;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    player.direction = 1;
    
    // Reset Totoro state completely
    totoro.x = 700;
    // Set Totoro's initial y position based on level
    if (currentLevel === 3) {
        totoro.y = 150; // Start higher in level 3
    } else if (currentLevel === 5) {
        totoro.y = 300;
        totoro.x = 400; // Start closer to player
        totoro.speed = 3; // Increase speed for level 5
    } else {
        totoro.y = 300;
    }
    totoro.velocityX = 0;
    totoro.velocityY = 0;
    totoro.isJumping = false;
    totoro.direction = -1;
    
    // Hide door
    door.visible = false;
    
    // Initialize door position for new level
    const bottomPlatform = platforms.find(p => p.type === 'ground');
    door.x = canvas.width - door.radius * 2 - 20;
    door.y = bottomPlatform.y - door.radius * 2;
}

// Function to update score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            color: #4a2c0a;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            background: rgba(255, 255, 255, 0.7);
            padding: 4px 8px;
            border-radius: 8px;
            box-shadow: 0 0 6px rgba(0,0,0,0.1);
        ">
            <img src="acorn.png" style="width: 16px; height: auto; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));">
            <span>${score}</span>
            <span style="color: #666;">|</span>
            <span>Level: ${currentLevel}</span>
        </div>
    `;
}

// Start the game when the window loads
window.onload = initGame; 