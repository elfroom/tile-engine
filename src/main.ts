// src/index.ts
import { Tilemap } from './Tilemap';
import { Player } from './Player';

// Initialize canvas and context
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d')!; // Use the non-null assertion

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Create a tilemap
const tilemap = new Tilemap(800, 600);

// Add solid tiles to the tilemap
tilemap.addTile(100, 100, 32, true);
tilemap.addTile(150, 150, 32, true);
tilemap.addTile(200, 200, 32, true);

// Create a player
const player = new Player(120, 120, 20);

// Handle touch events for player movement
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let touchStartX: number | null = null;
let touchStartY: number | null = null;

function handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
}

function handleTouchMove(event: TouchEvent): void {
    if (!touchStartX || !touchStartY) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    // Adjust the player's X position based on touch movement
    player.x += deltaX;
    player.y += deltaY;

    // Update the touch start position for the next move event
    touchStartX = touchX;

    // Prevent the default behavior to avoid scrolling
    event.preventDefault();
}

// Game loop
function gameLoop() {
    // Update logic (e.g., player movement)

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render tiles
    for (const tile of tilemap.tiles) {
        ctx.fillStyle = tile.isSolid ? '#333' : '#ddd';
        ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
    }

    // Render player
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Check collision
    const collisionOccurs = tilemap.checkCollisionWithTiles(player.x, player.y, player.size);

    if (collisionOccurs) {
        console.log('Collision occurred!');
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();