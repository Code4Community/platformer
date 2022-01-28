import Phaser from "phaser";
import Entity from "../entity.js";
import { createWorld, addEntity, addComponent } from "bitecs";

export default class ECSScene extends Phaser.Scene {
  constructor(config) {
    super(config);

    // A Map between entity IDs and Phaser GameObjects
    this.globalEntityMap = new Map();
    this.world = createWorld();
  }

  setupMapAndCamera(tilesetName, key, layerID) {
    // The following two strings are keys inside the json.
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(tilesetName, key);

    this.layer = map.createLayer(layerID, tileset, 0, 0);
    this.layer.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(2.5);

    this.map = map;
  }

  setupUI() {
    this.scene.launch("ui");
  }

  addEntity(gameobject, components) {
    return new Entity(this, gameobject, components);
  }
}
