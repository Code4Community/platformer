import Phaser from "phaser";

import skyImage from "../assets/sky.png";
import titleMP3 from "../assets/title.mp3";
//import titleOGG from "../assets/title.ogg";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("sky", skyImage);
    this.load.audio("title", [titleMP3]);
  }

  create() {
    this.sound.play("title", { loop: true });

    this.add.image(400, 300, "sky");

    this.title = this.add.text(200, 200, "🏃‍♂️🧅 vs. 🤖", {
      // fontFamily: "",
      fontSize: "64px",
    });

    this.playText = this.add.text(200, 300, "click me to play game", {
      fontSize: "32px",
    });
    this.playText.setInteractive();
    this.playText.on("pointerdown", () => {
      this.scene.start("LevelSelect");
    });
  }

  update() { }
}
