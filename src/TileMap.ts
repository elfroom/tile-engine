import Tile from "./Tile.ts"

export default class TileMap {
  tiles: Tile[];
  tileSize = 40;
  rows: number;
  cols: number;
  cameraPosition: {x:number,y:number};

  constructor() {
    this.tiles = [];
    this.rows = 20;
    this.cols = 20;
    this.cameraPosition = { x: 0, y: 0 };

    // fill with none solid rows and col hard codes
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        // If border tile
        if (
          row === 0 ||
          col === 0 ||
          row == this.rows - 1 ||
          col == this.cols - 1
        ) {
          this.tiles.push(
            new Tile(row, col, this.tileSize, this.tileSize, true),
          );
        } else {
          this.tiles.push(
            new Tile(row, col, this.tileSize, this.tileSize, false),
          );
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].draw(this.cameraPosition, ctx);
    }
  }
  
  getCollision(x:number,y:number,width:number,height:number){
     const collidedTiles = this.tiles.filter((tile) => {
      const tileLeft = tile.x * this.tileSize;
      const tileRight = (tile.x + 1) * this.tileSize;
      const tileTop = tile.y * this.tileSize;
      const tileBottom = (tile.y + 1) * this.tileSize;
      
      const playerLeft = x;
      const playerRight = x + width;
      const playerTop = y;
      const playerBottom = y + height;
      
      return (
      tile.isSolid &&
      playerLeft < tileRight &&
      playerRight > tileLeft &&
      playerTop < tileBottom &&
      playerBottom > tileTop
      );
    });
    return collidedTiles;
  }
}
