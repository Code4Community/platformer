import C4C from "c4c-editor-and-interpreter";
import GameScene from "./scenes/game-scene.js";

import { Player } from "./components/player-components.js";
import { Enemy } from "./components/enemy-components.js";
import { Hackable } from "./components/hackable-components.js";

function defineMovementFunctions(entity) {
  C4C.Interpreter.define("moveLeft", function () {
    entity.setVelocityX(-40);
  });

  C4C.Interpreter.define("moveRight", function () {
    entity.setVelocityX(40);
  });

  C4C.Interpreter.define("jump", function () {
    if (entity.body.blocked.down) {
      entity.setVelocityY(-200);
    }
  });

  C4C.Interpreter.define("isOnGround", function () {
    return entity.body.blocked.down;
  });
}

class LevelOne extends GameScene {
  constructor() {
    // Right now this string must be identical to the class name. That could be
    // fixed but this is simplest for now.
    super("LevelOne");
  }

  levelCreate() {
    const player = this.physics.add.sprite(40, 150, "dude");
    const hackableEntity = this.physics.add.sprite(70, 40, "robot");

    this.addEntity(player, [Player]);
    this.addEntity(hackableEntity, [Enemy, Hackable]);

    hackableEntity.setDataEnabled();
    hackableEntity.setData("ai", "jump");
    hackableEntity.setData("update-function", function (ai) {
      C4C.Interpreter.run(ai);
    });

    defineMovementFunctions(hackableEntity);

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
  }

  levelCreate() {
    const player = this.physics.add.sprite(40, 150, "dude");
    const hackableEntity = this.physics.add.sprite(70, 40, "robot");

    this.addEntity(player, [Player]);
    this.addEntity(hackableEntity, [Enemy, Hackable]);

    hackableEntity.setDataEnabled();
    hackableEntity.setData("ai", "jump");
    hackableEntity.setData("update-function", function (ai) {
      C4C.Interpreter.run(ai);
    });

    defineMovementFunctions(hackableEntity);

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
