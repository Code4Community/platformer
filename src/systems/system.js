import { defineQuery, enterQuery, exitQuery } from "bitecs";

export default class System {
  constructor(scene, components) {
    this.getAll = defineQuery(components);
    this.getEntered = enterQuery(this.getAll);
    this.getExited = exitQuery(this.getAll);
    this.world = scene.world;
    this.scene = scene;
  }

  getComponentSpriteGroup(components) {
    const entityQuery = defineQuery(components);
    const entities = entityQuery(this.world);
    const objects = entities.map((id) => {
      return this.scene.globalEntityMap.get(id).object;
    });
    return new Phaser.GameObjects.Group(this.scene, objects);
  }

  // This requires entered objects to be registered in the scene's global entity
  // map.
  forEnteredObjects(f) {
    const entered = this.getEntered(this.world);

    entered.forEach((entityID) => {
      const object = this.scene.globalEntityMap.get(entityID).object;
      f(object);
    });
  }

  // This requires entered objects to be registered in the scene's global entity
  // map.
  forAllObjects(f) {
    const entered = this.getAll(this.world);

    entered.forEach((entityID) => {
      const object = this.scene.globalEntityMap.get(entityID).object;
      f(object);
    });
  }
}
