import Phaser from "phaser";

import marioTiles from "../assets/mario-tiles.png";
import superMarioMap from "../assets/super-mario-map.json";

export default class TileDemoScene extends Phaser.Scene {
  constructor() {
    super("tile-demo");
  }

  preload() {
    this.load.image("mario-tiles", marioTiles);
    this.load.tilemapTiledJSON("map", superMarioMap);
  }

  create() {
    var map = this.make.tilemap({ key: "map" });
    // The following two strings are keys inside the json.
    var tileset = map.addTilesetImage("SuperMarioBros-World1-1", "mario-tiles");
    var layer = map.createLayer("World1", tileset, 0, 0);

    const camera = this.cameras.main;
    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    });

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(4);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);
  }

  update(time, delta) {
    this.controls.update(delta);
  }
}
