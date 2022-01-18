import Phaser from "phaser";

import MainMenuScene from "./scenes/main-menu-scene.js";
import LevelSelectScene from "./scenes/level-select-scene.js";
import HackingScene from "./scenes/hacking-scene.js";
import UIScene from "./scenes/ui-scene.js";

import "./css/style.css";

const config = {
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
  audio: {
    disableWebAudio: false,
  },
  scene: [MainMenuScene, LevelSelectScene, HackingScene, UIScene],
};

export default new Phaser.Game(config);
