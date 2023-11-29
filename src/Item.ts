export class Item {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 5;
    this.height = 5;
  }
  draw(camPos: { x: number; y: number }, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "pink";
    ctx.fillRect(camPos.x + this.x, camPos.y + this.y, this.width, this.height);
  }
}
