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

  setupMapAndCamera() {
    const map = this.make.tilemap({ key: this.tilemapKey });
    // The following two strings are keys inside the json.
    const tileset = map.addTilesetImage("smb-tileset", "mario-tiles");

    this.layer = map.createLayer("world", tileset, 0, 0);
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

  getByName(name) {
    var result = null;

    this.globalEntityMap.forEach((e) => {
      if (e.object.name == name) {
        result = e;
      }
    });

    return result;
  }
}
