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

    // back button
    const backButton = this.add.text(600, 50, "Back", {
      fontSize: "24px",
      fill: "#fff",
    });
    backButton.setInteractive();
    backButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    const levelButtonGroup = this.add.group();
    /*  Manage auth to select levels only after defeating previous level */
    // developer mode: currentLevel should be 0
    let currentLevel = -10;
    Object.keys(levelMap).forEach((levelKey) => {
      if (currentLevel <= levelsDefeated.size) {
        // levels defeated/current level: white text
        const levelText = this.add.text(0, 0, getLevelText(levelKey, true), {
          fontSize: "32px", 
          fill: "#fff",
        });
        levelText.setInteractive();
        levelText.on("pointerdown", () => {
          this.scene.start(levelKey);
        });
        levelButtonGroup.add(levelText);
      } else {
        // levels not defeated: grey text
        const levelText = this.add.text(0, 0, getLevelText(levelKey, false), {
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
      width: 1,
      height: 6,
      cellWidth: 200,
      cellHeight: 80,
      x: 200,
      y: 100,
    });
  }

  update() {}
}

function getLevelText(key, isActive) {
  switch (key) {
    case "LevelOne":
      return isActive ? "Level 1: Genesis" : "Level 1";
    case "LevelTwo":
      return isActive ? "Level 2: Robots!" : "Level 2";
    case "LevelThree":
      return isActive ? "Level 3: Climb The Mountain" : "Level 3";
    case "LevelFour":
      return isActive ? "Level 4: Teamwork" : "Level 4";
    case "LevelFive":
      return isActive ? "Level 5: Magic Carpet" : "Level 5";
    case "LevelSix":
      return isActive ? "Level 6: Across The Gap" : "Level 6";
  }
}
