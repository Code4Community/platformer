import Phaser from "phaser";

import skyImage from "../assets/sky.png";

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("level-select");
  }

  preload() {
    this.load.image("sky", skyImage);
  }

  create() {
    this.add.image(400, 300, "sky");

    this.levelOneText = this.add.text(300, 100, "level one", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.levelOneText.setInteractive();
    this.levelOneText.on("pointerdown", () => {
      this.scene.start("hacking");
    });
  }

  update() {}
}
