import Phaser from "phaser";

import skyImage from "../assets/sky.png";
import levelMap from "../levels.js";

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelect");
  }

  preload() {
    this.load.image("sky", skyImage);
  }

  create() {
    this.add.image(400, 300, "sky");

    const levelButtonGroup = this.add.group();

    Object.keys(levelMap).forEach((levelKey) => {
      const levelText = this.add.text(0, 0, levelKey, {
        fontSize: "32px",
        fill: "#fff",
      });

      levelText.setInteractive();
      levelText.on("pointerdown", () => {
        this.scene.start(levelKey);
      });

      levelButtonGroup.add(levelText);
    });

    Phaser.Actions.GridAlign(levelButtonGroup.getChildren(), {
      width: 3,
      height: 2,
      cellWidth: 200,
      cellHeight: 100,
      x: 200,
      y: 200,
    });
  }

  update() {}
}
