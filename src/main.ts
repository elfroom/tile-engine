import TileMap from "./TileMap.ts";
import EventHandler from "./EventHandler.ts";
import PhysicsEngine from "./PhysicsEngine.ts";
import { Player } from "./Player";
import { Monster } from "./Monster";
import { Item } from "./Item";
export type Vector2D = { x: number; y: number };

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
