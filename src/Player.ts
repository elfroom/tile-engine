import { Vector2D } from "./main";

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  screenX: number;
  screenY: number;
  speed: number;
  movementVector: Vector2D;

  constructor(
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    size: number,
  ) {
    this.x = x;
    this.y = y;
    this.speed = 6;
    this.screenX = screenX;
    this.screenY = screenY;
    this.width = size;
    this.height = size;
    //this.cameraPosition = { x: 0, y: 0 };
    this.movementVector = { x: 0, y: 0 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.screenX, this.screenY, this.width, this.height);
    ctx.fillText(
      "(" + Math.floor(this.x) + "," + Math.floor(this.y) + ")",
      this.screenX,
      this.screenY,
    );
  }

  update(): void {
    if (this.movementVector.x != 0 || this.movementVector.y != 0) {
      // work out next coord
      this.x += this.movementVector.x * this.speed;
      this.y += this.movementVector.y * this.speed;
    }
  }
}
