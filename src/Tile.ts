export default class Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  isSolid: boolean;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    isSolid: boolean,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x = this.width * this.x;
    this.y =  this.height * this.y;
    this.isSolid = isSolid;
  }

  draw(cameraPosition: {x:number,y:number}, ctx: CanvasRenderingContext2D): void {
    if (this.isSolid) ctx.fillStyle = "red";
    else ctx.fillStyle = "lightgreen";

    ctx.strokeStyle = "green";
    ctx.fillRect(
      cameraPosition.x + this.x,
      cameraPosition.y + this.y,
      this.width,
      this.height,
    );
    ctx.strokeRect(
      cameraPosition.x + this.x,
      cameraPosition.y + this.y,
      this.width,
      this.height,
    );
  }
}