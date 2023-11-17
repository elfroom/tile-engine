// src/Tilemap.ts
import { Tile } from './Tile';

export class Tilemap {
    width: number;
    height: number;
    tiles: Tile[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];
    }

    addTile(x: number, y: number, size: number, isSolid: boolean): void {
        const tile = new Tile(x, y, size, isSolid);
        this.tiles.push(tile);
    }

    checkCollisionWithTiles(playerX: number, playerY: number, playerSize: number): boolean {
        for (const tile of this.tiles) {
            if (tile.isSolid && tile.checkCollision(playerX, playerY, playerSize)) {
                return true; // Collision occurred
            }
        }
        return false; // No collision
    }
}