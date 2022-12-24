import C4C from "c4c-lib";
import GameScene from "./scenes/game-scene.js";
import { defineMovementFunctions } from "./utils.js";

import { Player } from "./components/player-components.js";
import { Enemy } from "./components/enemy-components.js";
import { Hackable } from "./components/hackable-components.js";

import levelOneMap from "./assets/levels/level-one.json";
import levelTwoMap from "./assets/levels/level-two.json";
import levelThreeMap from "./assets/levels/level-three.json";
import levelFourMap from "./assets/levels/level-four.json";
import levelFiveMap from "./assets/levels/level-five.json";
import levelSixMap from "./assets/levels/level-six.json";

class LevelOne extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelOne");
    this.tilemapKey = "map1";
    this.tilemapPath = levelOneMap;
  }

  levelCreate() {
    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Move right. Touch the star to win.",
      hasButton: true,
    });
  }
}

class LevelTwo extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelTwo");
    this.tilemapKey = "map2";
    this.tilemapPath = levelTwoMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData(
      "ai",
      `forever times
  jump
end`
    );
    defineMovementFunctions(enemy.object);

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Buttons control doors. You control robots.",
      hasButton: true,
    });
  }
}

class LevelThree extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelThree");
    this.tilemapKey = "map3";
    this.tilemapPath = levelThreeMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", ``);
    defineMovementFunctions(enemy.object);

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Try to 'jumpRight'!",
      hasButton: true,
    });
  }
}

class LevelFour extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelFour");
    this.tilemapKey = "map4";
    this.tilemapPath = levelFourMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", ``);
    defineMovementFunctions(enemy.object);

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "You can open doors too!",
      hasButton: true,
    });
  }
}

class LevelFive extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelFive");
    this.tilemapKey = "map5";
    this.tilemapPath = levelFiveMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", ``);
    defineMovementFunctions(enemy.object);
  }
}

class LevelSix extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelSix");
    this.tilemapKey = "map6";
    this.tilemapPath = levelSixMap;
  }

  levelCreate() {
    const enemy = this.getByName("enemy1");
    enemy.addComponent(Hackable);
    enemy.object.setData("ai", ``);
    defineMovementFunctions(enemy.object);
  }
}
// I know... too much boilerplate
const levelMap = {
  // "1": LevelOne,
  // "2": LevelTwo,
  // "3": LevelThree,
  // "4": LevelFour,
  // "5": LevelFive,
  // "6": LevelSix,
  LevelOne: LevelOne,
  LevelTwo: LevelTwo,
  LevelThree: LevelThree,
  LevelFour: LevelFour,
  LevelFive: LevelFive,
  LevelSix: LevelSix,
};

export default levelMap;
