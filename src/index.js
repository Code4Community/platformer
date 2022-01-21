import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";

import MainMenuScene from "./scenes/main-menu-scene.js";
import LevelSelectScene from "./scenes/level-select-scene.js";
import HackingScene from "./scenes/hacking-scene.js";
import UIScene from "./scenes/ui-scene.js";

import "./css/style.css";

C4C.Editor.create(document.body, true);

const config = {
  parent: "body",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [LevelSelectScene, HackingScene, UIScene],
};

export default new Phaser.Game(config);
