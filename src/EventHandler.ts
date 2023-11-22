import Game from "./main.ts";
import PhysicsEngine from "./PhysicsEngine.ts";
export default class EventHandler {
  game: Game;
  touchDown: boolean;
  touchVector: { x: number; y: number };
  constructor(game: Game) {
    this.game = game;
    this.touchDown = false;
    this.touchVector = { x: 0, y: 0 };
  }

  init() {
    this.game.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      false,
    );
    //comma
    this.game.canvas.addEventListener(
      "touchend",
      this.handleTouchEnd.bind(this),
      false,
    );
    window.addEventListener(
      "touchmove",
      this.handleTouchMove.bind(this),
      false,
    );
    window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
    window.addEventListener("keyup", this.handleKeyUp.bind(this), false);
  }

  handleOneTouch(touchX: number, touchY: number): void {
    const dx = touchX - this.game.width / 2;
    const dy = touchY - this.game.height / 2;

    // normalised vector from above code
    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedDeltaX = dx / length;
    const normalizedDeltaY = dy / length;
    this.touchVector = { x: normalizedDeltaX, y: normalizedDeltaY };
    this.game.player.movementVector = {
      x: normalizedDeltaX,
      y: normalizedDeltaY,
    };
  }
  handleTouchDown(e: TouchEvent) {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    setTimeout(() => {
      if (!this.touchDown) {
        // touch was less than 250ms
        const worldX = Math.floor(touchX - this.game.tilemap.cameraPosition.x);
        const worldY = Math.floor(touchY - this.game.tilemap.cameraPosition.y);

        const touchBoundary = {
          x: worldX - 20,
          y: worldY - 20,
          width: 40,
          height: 40,
        };
        if (PhysicsEngine.detectCollision(this.game.monster, touchBoundary)) {
          this.game.monster.x += this.touchVector.x * 20;
          this.game.monster.y += this.touchVector.y * 20;
          console.log("hit");
        }
        return;
        const tileIndex = this.game.tilemap.tiles.findIndex((tile) => {
          return (
            worldX >= tile.x &&
            worldX <= tile.x + tile.width &&
            worldY >= tile.y &&
            worldY <= tile.y + tile.height
          );
        });
        if (this.game.tilemap.tiles[tileIndex].isSolid) {
          this.game.tilemap.tiles[tileIndex].isSolid = false;
        } else {
          this.game.tilemap.tiles[tileIndex].isSolid = true;
        }
      } else {
        if (e.touches.length === 1) {
          this.handleOneTouch(touchX, touchY);
        }
      }
    }, 250);
  }
  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.touchDown = true;
    this.handleTouchDown(e);
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    if (e.touches.length === 1) {
      this.handleOneTouch(touchX, touchY);
    }
  }

  handleTouchEnd(e: TouchEvent) {
    if (e.touches.length == 0) {
      this.game.player.movementVector = { x: 0, y: 0 };
      this.touchDown = false;
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    console.log("keydown");
    const player = this.game.player;
    if (e.code === "KeyW") {
      player.movementVector.y = -1;
    } else if (e.code === "KeyS") {
      player.movementVector.y = 1;
    } else if (e.code === "KeyA") {
      player.movementVector.x = -1;
    } else if (e.code === "KeyD") {
      player.movementVector.x = 1;
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    if (e.code === "KeyW" || e.code === "KeyS") {
      this.game.player.movementVector.y = 0;
    } else if (e.code === "KeyA" || e.code === "KeyD") {
      this.game.player.movementVector.x = 0;
    }
  }
}
