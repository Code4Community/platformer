import C4C from "c4c-editor-and-interpreter";
import GameScene from "./scenes/game-scene.js";
import { defineMovementFunctions } from "./utils.js";

import { Player } from "./components/player-components.js";
import { Enemy } from "./components/enemy-components.js";
import { Hackable } from "./components/hackable-components.js";

import levelOneMap from "./assets/level-one.json";

class LevelOne extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelOne");
    this.tilemapPath = levelOneMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", "jump");
    defineMovementFunctions(enemy.object);

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Touch the blue square to win.",
      hasButton: true,
    });
  }
}

class LevelTwo extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelTwo");
    this.tilemapPath = levelOneMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", "jump");
    defineMovementFunctions(enemy.object);

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Now its level two.",
      hasButton: true,
    });
  }
}

const levels = [LevelOne, LevelTwo];
export default levels;
