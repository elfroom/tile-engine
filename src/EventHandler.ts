import Game from "./main";
import PhysicsEngine from "./PhysicsEngine";
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
      (e) => {
        e.preventDefault();
      },
      false,
    );
    this.game.canvas.addEventListener(
      "pointerdown",
      this.handleTouchStart.bind(this),
      false,
    );
    //comma
    this.game.canvas.addEventListener(
      "pointerup",
      this.handleTouchEnd.bind(this),
      false,
    );
    window.addEventListener(
      "pointermove",
      this.handleTouchMove.bind(this),
      false,
    );
    window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
    window.addEventListener("keyup", this.handleKeyUp.bind(this), false);
  }

  handleOneTouch(touchX: number, touchY: number): void {
    const dx = touchX - this.game.player.screenX;
    const dy = touchY - this.game.player.screenY;

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
  handleTouchDown(e: PointerEvent) {
    const touchX = e.x;
    const touchY = e.y;

    setTimeout(() => {
      if (!this.touchDown) {
        // touch was less than 250ms
        const worldX = Math.floor(touchX - this.game.tilemap.cameraPosition.x);
        const worldY = Math.floor(touchY - this.game.tilemap.cameraPosition.y);

        // creating rect around mouse to detect collision // would rather use physics
        // or create a bounding box around the player to detect attack
        const touchBoundary = {
          x: this.game.player.x - 40,
          y: this.game.player.y - 40,
          width: 80,
          height: 80,
        };
        this.game.monsters.forEach((monster) => {
          if (PhysicsEngine.detectCollision(monster, touchBoundary)) {
            monster.x -= monster.moveVector.x * 120;
            monster.y -= monster.moveVector.y * 120;
            monster.health -= 1;
            if (monster.health < 0) {
              monster.x = -10;
              monster.y = -10;
            }
            console.log("hit");
          }
        });

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
        this.handleOneTouch(touchX, touchY);
      }
    }, 100);
  }
  handleTouchStart(e: PointerEvent) {
    this.touchDown = true;
    this.handleTouchDown(e);
  }

  handleTouchMove(e: PointerEvent) {
    const touchX = e.x;
    const touchY = e.y;
    if (this.touchDown) {
      this.handleOneTouch(touchX, touchY);
    }
  }

  handleTouchEnd(e: PointerEvent) {
    this.game.player.movementVector = { x: 0, y: 0 };
    this.touchDown = false;
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
