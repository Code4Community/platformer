import Phaser from "phaser";

import skyImage from "../assets/sky.png";
import levels from "../levels.js";

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

    levels.forEach((level) => {
      const levelText = this.add.text(0, 0, level.name, {
        fontSize: "32px",
        fill: "#fff",
      });

      levelText.setInteractive();
      levelText.on("pointerdown", () => {
        this.scene.start(level.name);
      });

      levelButtonGroup.add(levelText);
    });

    Phaser.Actions.GridAlign(levelButtonGroup.getChildren(), {
      width: -1,
      height: -1,
      cellWidth: 200,
      cellHeight: 10,
      x: 200,
      y: 100,
    });
  }

  update() {}
}
