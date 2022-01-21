import Phaser from "phaser";
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

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2.5);

    return map;
  }

  setupUI() {
    this.scene.launch("ui");
  }
}
