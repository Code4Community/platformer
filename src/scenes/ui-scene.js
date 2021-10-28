import Phaser from "phaser";
import eventsCenter from "../events-center.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("ui");
  }

  create() {
    const pauseLabel = this.add.text(700, 100, "Pause", {
      fontSize: 32,
    });

    pauseLabel.setInteractive();
    pauseLabel.on("pointerdown", () => {
      if (this.scene.isPaused("tutorial")) {
        this.scene.resume("tutorial");
      } else {
        this.scene.pause("tutorial");
      }
    });
  }

  pauseGame() {
    this.scene.pause();
  }

  showPauseMenu() {
    this.unPauseLabel.setVisible(true);
  }
}
