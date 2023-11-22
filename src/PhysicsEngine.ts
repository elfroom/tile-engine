interface Vector2 {
  x: number;
  y: number;
}
export default class PhysicsEngine {
  static detectCollision(entity1: { x: number; y: number; width: number; height: number }, entity2: { x: number; y: number; width: number; height: number }): boolean {
    return (
      entity1.x < entity2.x + entity2.width &&
      entity1.x + entity1.width > entity2.x &&
      entity1.y < entity2.y + entity2.height &&
      entity1.y + entity1.height > entity2.y
    );
  }

  static handleCollision(entity1: { x: number; y: number; width: number; height: number }, entity2: { x: number; y: number; width: number; height: number }) {
    const dx = (entity1.x + entity1.width / 2) - (entity2.x + entity2.width / 2);
    const dy = (entity1.y + entity1.height / 2) - (entity2.y + entity2.height / 2);
    const width = (entity1.width + entity2.width) / 2;
    const height = (entity1.height + entity2.height) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        if (crossWidth > -crossHeight) {
          entity1.y = entity2.y + entity2.height;
        } else {
          entity1.x = entity2.x - entity1.width;
        }
      } else {
        if (crossWidth > -crossHeight) {
          entity1.x = entity2.x + entity2.width;
        } else {
          entity1.y = entity2.y - entity1.height;
        }
      }
    }
  }
}