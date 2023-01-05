import Phaser from "phaser";
import C4C from "c4c-lib";

import MainMenuScene from "./scenes/main-menu-scene.js";
import LevelSelectScene from "./scenes/level-select-scene.js";
import UIScene from "./scenes/ui-scene.js";
import levelMap from "./levels.js";

import "c4c-lib/src/styles/style.scss";

C4C.Editor.create(document.body, null, true);

const config = {
  parent: document.getElementById("game"),
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [MainMenuScene, LevelSelectScene, UIScene].concat(
    Object.values(levelMap)
  ),
  audio: {
    disableWebAudio: false,
  },
};

export default new Phaser.Game(config);
