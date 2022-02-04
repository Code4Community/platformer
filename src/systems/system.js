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
    const objects = entities.map((id) => this.scene.globalEntityMap.get(id));
    return new Phaser.GameObjects.Group(this.scene, objects);
  }

  // This requires entered objects to be registered in the scene's global entity
  // map.
  forEnteredObjects(f) {
    const entered = this.getEntered(this.world);

    entered.forEach((entityID) => {
      const object = this.scene.globalEntityMap.get(entityID);
      f(object);
    });
  }

  // This requires entered objects to be registered in the scene's global entity
  // map.
  forAllObjects(f) {
    const entered = this.getAll(this.world);

    entered.forEach((entityID) => {
      const object = this.scene.globalEntityMap.get(entityID);
      f(object);
    });
  }

  getByName(name) {
    return this.getAll(this.world)
      .map((id) => this.scene.globalEntityMap.get(id))
      .find((sprite) => sprite.name == name);
  }
}
