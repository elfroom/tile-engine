import { Player } from "./Player";

export class Monster {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  cameraPosition: { x: number; y: number };

  constructor(x: number, y: number, size: number, speed: number) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.speed = speed;
    this.cameraPosition = { x: 0, y: 0 };
  }

  update(player: Player) {
    // Implement logic for the monster to follow the player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const directionX = dx / distance;
    const directionY = dy / distance;
    this.x += directionX * this.speed;
    this.y += directionY * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Implement drawing logic for the monster
    const x = this.cameraPosition.x + this.x;
    const y = this.cameraPosition.y + this.y;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, this.width, this.height);
    ctx.fillText(
      "(" + Math.floor(this.x) + "," + Math.floor(this.y) + ")",
      x,
      y,
    );
  }
}
