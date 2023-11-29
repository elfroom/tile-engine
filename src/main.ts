import TileMap from "./TileMap";
import EventHandler from "./EventHandler";
import PhysicsEngine from "./PhysicsEngine";
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
  monsters: Monster[];
  eventHandler: EventHandler;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.tilemap = new TileMap();
    this.tilemap.tiles[55].isSolid = true;
    this.player = new Player(100, 120, this.width / 2, this.height / 2, 16);
    this.monsters = [];
    this.monsters.push(new Monster(250, 250, 7, 2));
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
    this.monsters.forEach((monster) => {
      monster.update(this.player);
      monster.cameraPosition = cameraPos;
      monster.draw(ctx);
    });

    this.items.forEach((item) => {
      item.draw(cameraPos, ctx);
    });

    // collision for player and items
    const itemIndex = this.items.findIndex((item) => {
      if (PhysicsEngine.detectCollision(this.player, item)) {
        return true;
      }
    });
    if (itemIndex !== -1) this.items.splice(itemIndex - 1, 1);
    // collisions for solid gilss
    this.tilemap.tiles.forEach((tile) => {
      if (!tile.isSolid) return;
      // for player
      if (PhysicsEngine.detectCollision(this.player, tile)) {
        PhysicsEngine.handleCollision(this.player, tile);
      }
      // for monster
      this.monsters.forEach((monster) => {
        if (PhysicsEngine.detectCollision(monster, tile)) {
          PhysicsEngine.handleCollision(monster, tile);
        }
      });
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
