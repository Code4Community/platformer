import Phaser from "phaser";
import { createWorld, addEntity, addComponent } from "bitecs";

export default class ECSScene extends Phaser.Scene {
  constructor(config) {
    super(config);

    // A Map between entity IDs and Phaser GameObjects
    this.globalEntityMap = new Map();
    this.world = createWorld();
  }
}
