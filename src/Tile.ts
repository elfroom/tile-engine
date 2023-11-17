// src/Tile.ts
export class Tile {
    x: number;
    y: number;
    size: number;
    isSolid: boolean;

    constructor(x: number, y: number, size: number, isSolid: boolean) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isSolid = isSolid;
    }

    checkCollision(otherX: number, otherY: number, otherSize: number): boolean {
        return (
            this.x < otherX + otherSize &&
            this.x + this.size > otherX &&
            this.y < otherY + otherSize &&
            this.y + this.size > otherY
        );
    }
}