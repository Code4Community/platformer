import Phaser from "phaser";
import { createWorld, addEntity, addComponent } from "bitecs";

export default class ECSScene extends Phaser.Scene {
  constructor(config) {
    super(config);

    // A Map between entity IDs and Phaser GameObjects
    this.globalEntityMap = new Map();
    this.world = createWorld();
  }

  setUpMap() {
    // The following two strings are keys inside the json.
    var map = this.make.tilemap({ key: "map" });
    var tileset = map.addTilesetImage("SuperMarioBros-World1-1", "mario-tiles");
    this.layer = map.createLayer("World1", tileset, 0, 0);
    this.layer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.layer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

    

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2.5);


  }
}
