import Phaser from "phaser";

import skyImage from "../assets/sky.png";
import levelMap from "../levels.js";
import { levelsDefeated } from "./game-scene.js";
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
    /*  Manage auth to select levels only after defeating previous level */
    let currentLevel = 0;
    Object.keys(levelMap).forEach((levelKey) => {
      if (currentLevel <= levelsDefeated.size) {
        const levelText = this.add.text(0, 0, levelKey, {
          fontSize: "32px",
          fill: "#fff",
        });
        levelText.setInteractive();
        levelText.on("pointerdown", () => {
          this.scene.start(levelKey);
        });
        levelButtonGroup.add(levelText);
      } else {
        const levelText = this.add.text(0, 0, levelKey, {
          fontSize: "32px",
          fill: "#aaa",
        });
        levelButtonGroup.add(levelText);
      }
      currentLevel += 1;
    });
    /*
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
    */
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
