import { defineQuery, enterQuery, exitQuery } from "bitecs";

export default class System {
  constructor(scene, components) {
    this.getAll = defineQuery(components);
    this.getEntered = enterQuery(this.getAll);
    this.getExited = exitQuery(this.getAll);
    this.world = scene.world;
    this.scene = scene;
  }
}
