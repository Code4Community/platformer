import Phaser from "phaser";
import { createWorld, addEntity, addComponent } from "bitecs";

export default class ECSScene extends Phaser.Scene {
  constructor(config) {
    super(config);

    // A Map between entity IDs and Phaser GameObjects
    this.globalEntityMap = new Map();
    this.world = createWorld();
  }

  setupMapAndCamera({
    tilesetName,
    key,
    layerID,
    collides,
    alpha,
    tileColor,
    collidingTileColor,
    faceColor,
    zoom,
  }) {
    // The following two strings are keys inside the json.
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(tilesetName, key);
    this.layer = map.createLayer(layerID, tileset, 0, 0);
    this.layer.setCollisionByProperty({ collides });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const debugGraphics = this.add.graphics().setAlpha(alpha);
    this.layer.renderDebug(debugGraphics, {
      tileColor, // Color of non-colliding tiles
      collidingTileColor, // Color of colliding tiles
      faceColor, // Color of colliding face edges
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(zoom);

    return [map, camera];
  }
}
