import { addEntity, addComponent } from "bitecs";

export default class Entity {
  world;
  scene;
  id;
  object;

  constructor(scene, object, components) {
    this.scene = scene;
    this.world = scene.world;
    this.object = object;
    this.id = addEntity(this.world);

    components.forEach((c) => {
      addComponent(this.world, c, this.id);
    });

    this.scene.globalEntityMap.set(this.id, this);
  }

  addComponent(c) {
    addComponent(this.world, c, this.id);
  }

  get(component, key) {
    return component[key][this.eid];
  }

  set(component, key, value) {
    const length = component[key][this.id].length;

    if (typeof value == "string") {
      value = Uint8Array.from(value, (x) => x.charCodeAt(0));
    }

    component[key][this.id] = value;
    return value;
  }
}
