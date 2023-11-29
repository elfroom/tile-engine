import { Player } from "./Player";
import PhysicsEngine from "./PhysicsEngine";

export class Monster {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  cameraPosition: { x: number; y: number };
  moveVector: { x: number; y: number };

  constructor(x: number, y: number, size: number, speed: number) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.speed = speed;
    this.health = 10;
    this.cameraPosition = { x: 0, y: 0 };
    this.moveVector = { x: 0, y: 0 };
  }

  update(player: Player) {
    // Implement logic for the monster to follow the player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    this.moveVector.x = dx / distance;
    this.moveVector.y = dy / distance;
    this.x += this.moveVector.x * this.speed;
    this.y += this.moveVector.y * this.speed;

    if (PhysicsEngine.detectCollision(player, this)) {
      PhysicsEngine.handleCollision(this, player);
    }
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
