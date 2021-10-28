import Phaser from "phaser";

import skyImage from "../assets/sky.png";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("main-menu");
  }

  preload() {
    this.load.image("sky", skyImage);
  }

  create() {
    this.add.image(400, 300, "sky");

    this.playText = this.add.text(200, 300, "click me to play game", {
      fontSize: "32px",
    });
    this.playText.setInteractive();
    this.playText.on("pointerdown", () => {
      this.scene.start("level-select");
    });
  }

  update() {}
}
