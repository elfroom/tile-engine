import TileMap from "./TileMap.ts";
import EventHandler from "./EventHandler.ts";
import PhysicsEngine from "./PhysicsEngine.ts";
type Vector2D = { x: number; y: number };

class Monster {
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

class Player {
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

class Item {
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

export default class Game {
  width: number;
  height: number;
  tilemap: TileMap;
  player: Player;
  items: Item[];
  monster: Monster;
  eventHandler: EventHandler;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.tilemap = new TileMap();
    this.tilemap.tiles[55].isSolid = true;
    this.player = new Player(100, 120, this.width / 2, this.height / 2, 16);
    this.monster = new Monster(250, 250, 7, 3);
    this.items = [];
    this.items.push(new Item());

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;

    this.eventHandler = new EventHandler(this);
  }

  gameLoop() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    // draw tilemap
    const cameraPos = {
      x: this.player.screenX - this.player.x,
      y: this.player.screenY - this.player.y,
    };
    this.tilemap.cameraPosition = cameraPos;
    this.tilemap.draw(ctx);
    this.player.update();
    this.player.draw(ctx);
    this.monster.cameraPosition = cameraPos;
    this.monster.draw(ctx);
    this.monster.update(this.player);
    this.items[0].draw(cameraPos, ctx);

    // Check for collision between player and monster
    if (PhysicsEngine.detectCollision(this.player, this.monster)) {
      PhysicsEngine.handleCollision(this.monster, this.player);
    }

    // collisions for solid gilss
    this.tilemap.tiles.forEach((tile) => {
      if (!tile.isSolid) return;
      // for player
      if (PhysicsEngine.detectCollision(this.player, tile)) {
        PhysicsEngine.handleCollision(this.player, tile);
      }
      // for monster
      if (PhysicsEngine.detectCollision(this.monster, tile)) {
        PhysicsEngine.handleCollision(this.monster, tile);
      }
    });

    window.requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    const cameraPos = {
      x: this.player.screenX - this.player.x,
      y: this.player.screenY - this.player.y,
    };
    this.tilemap.cameraPosition = cameraPos;

    this.eventHandler.init();

    this.gameLoop();
  }
}

const game = new Game(400, 400);
game.start();
