class Tile {
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
    this.isSolid = isSolid;
  }

  draw(offset: { x: number; y: number }, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "green";
    ctx.fillRect(offset.x + this.x, offset.y + this.y, this.width, this.height);
    ctx.strokeRect(
      offset.x + this.x,
      offset.y + this.y,
      this.width,
      this.height,
    );
  }
}

class TileMap {
  tiles: Tile[];
  tileSize = 32;
  offset: { x: number; y: number };

  constructor() {
    this.tiles = [];
    this.offset = { x: 100, y: 0 };

    // fill with none solid rows and col hard codes
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        this.tiles.push(
          new Tile(
            row * this.tileSize,
            col * this.tileSize,
            this.tileSize,
            this.tileSize,
            false,
          ),
        );
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].draw(this.offset, ctx);
    }
  }
}

class Player {
  x: number;
  y: number;
  size: number;
  movementVector: { x: number; y: number };

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.movementVector = { x: 0, y: 0 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update(): void {
    if (this.movementVector.x != 0 || this.movementVector.y != 0) {
      console.log("moving");
      this.x += this.movementVector.x;
      this.y += this.movementVector.y;
    }
  }
}

class Game {
  width: number;
  height: number;
  tilemap: TileMap;
  player: Player;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.tilemap = new TileMap();

    this.player = new Player(20, 20, 16);

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      // diff between touch xy and player xy
      const dx = touchX - this.player.x;
      const dy = touchY - this.player.y;

      //normalised vector
      const length = Math.sqrt(dx * dx + dy * dy);
      const normalizedDeltaX = dx / length;
      const normalizedDeltaY = dy / length;
      // Adjust the player's position based on the normalized vector
      this.player.movementVector = {
        x: normalizedDeltaX,
        y: normalizedDeltaY,
      };
      // move camera
    }
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      // diff between touch xy and player xy
      const dx = touchX - this.player.x;
      const dy = touchY - this.player.y;

      //normalised vector
      const length = Math.sqrt(dx * dx + dy * dy);
      const normalizedDeltaX = dx / length;
      const normalizedDeltaY = dy / length;
      // Adjust the player's position based on the normalized vector
      this.player.movementVector = {
        x: normalizedDeltaX,
        y: normalizedDeltaY,
      };
    }
  }

  handleTouchEnd(e: TouchEvent) {
    if (e.touches.length == 0) {
      this.player.movementVector = { x: 0, y: 0 };
    }
  }
  gameLoop() {
    this.tilemap.draw(this.ctx);
    this.player.update();
    this.player.draw(this.ctx);

    window.requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      false,
    );
    //comma
    this.canvas.addEventListener(
      "touchend",
      this.handleTouchEnd.bind(this),
      false,
    );
    this.canvas.addEventListener(
      "touchmove",
      this.handleTouchMove.bind(this),
      false,
    );
    this.gameLoop();
  }
}

const game = new Game(300, 300);
game.start();
