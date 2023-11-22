import TileMap from "./TileMap.ts";
type Vector2D = { x: number; y: number };

class Player {
  x: number;
  y: number;
  size: number;
  screenX: number;
  screenY: number;
  speed: number;
  movementVector: Vector2D;

  constructor(
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    size: number
  ) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.screenX = screenX;
    this.screenY = screenY;
    this.size = size;
    //this.cameraPosition = { x: 0, y: 0 };
    this.movementVector = { x: 0, y: 0 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.screenX, this.screenY, this.size, this.size);
  }

  update(collisionMap: TileMap): void {
    if (this.movementVector.x != 0 || this.movementVector.y != 0) {
      console.log("moving");
      const newX = this.x + this.movementVector.x * this.speed;
      const newY = this.y + this.movementVector.y * this.speed;

      // Check if the new position collides with solid tiles
      const tileSize = collisionMap.tileSize;
      const playerSize = this.size;
      const collidedTiles = collisionMap.tiles.filter((tile) => {
        const tileLeft = tile.x * tileSize;
        const tileRight = (tile.x + 1) * tileSize;
        const tileTop = tile.y * tileSize;
        const tileBottom = (tile.y + 1) * tileSize;

        const playerLeft = newX;
        const playerRight = newX + playerSize;
        const playerTop = newY;
        const playerBottom = newY + playerSize;

        return (
          tile.isSolid &&
          playerLeft < tileRight &&
          playerRight > tileLeft &&
          playerTop < tileBottom &&
          playerBottom > tileTop
        );
      });

      if (collidedTiles.length === 0) {
        this.x = newX;
        this.y = newY;
      } else {
        // Handle collision response by inverting the respective component of movementVector
        if (this.movementVector.y > 0) {
          this.movementVector.y = -this.movementVector.y;
        } else if (this.movementVector.y < 0) {
          this.movementVector.y = -this.movementVector.y;
        } else if (this.movementVector.x !== 0) {
          this.movementVector.x = -this.movementVector.x;
        }
      }
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
    this.tilemap.tiles[55].isSolid = true;
    this.player = new Player(100, 120, this.width / 2, this.height / 2, 16);

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;
  }

  updatePlayerAndCamera(touchX: number, touchY: number): void {
    // based on touch and player draw
    const dx = touchX - this.width / 2;
    const dy = touchY - this.height / 2;

    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedDeltaX = dx / length;
    const normalizedDeltaY = dy / length;
    this.player.movementVector = { x: normalizedDeltaX, y: normalizedDeltaY };
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      this.updatePlayerAndCamera(touchX, touchY);
    }
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      this.updatePlayerAndCamera(touchX, touchY);
    }
  }

  handleTouchEnd(e: TouchEvent) {
    if (e.touches.length == 0) {
      this.player.movementVector = { x: 0, y: 0 };
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    console.log("keydown");
    if (e.code === "KeyW") {
      this.player.movementVector.y = -1;
    } else if (e.code === "KeyS") {
      this.player.movementVector.y = 1;
    } else if (e.code === "KeyA") {
      this.player.movementVector.x = -1;
    } else if (e.code === "KeyD") {
      this.player.movementVector.x = 1;
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    if (e.code === "KeyW" || e.code === "KeyS") {
      this.player.movementVector.y = 0;
    } else if (e.code === "KeyA" || e.code === "KeyD") {
      this.player.movementVector.x = 0;
    }
  }
  gameLoop() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const cameraPos = {
      x: this.player.screenX - this.player.x,
      y: this.player.screenY - this.player.y,
    };
    this.tilemap.cameraPosition = cameraPos;
    this.tilemap.draw(this.ctx);
    this.player.update(this.tilemap);
    this.player.draw(this.ctx);

    window.requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    const cameraPos = {
      x: this.player.screenX - this.player.x,
      y: this.player.screenY - this.player.y,
    };
    this.tilemap.cameraPosition = cameraPos;
    this.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      false
    );
    //comma
    this.canvas.addEventListener(
      "touchend",
      this.handleTouchEnd.bind(this),
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      this.handleTouchMove.bind(this),
      false
    );
    window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
    window.addEventListener("keyup", this.handleKeyUp.bind(this), false);
    this.gameLoop();
  }
}

const game = new Game(400, 400);
game.start();
