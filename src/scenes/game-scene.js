import C4C from "c4c-editor-and-interpreter";
import ECSScene from "./ecs-scene.js";
import { resetWorld } from "bitecs";

import skyImage from "../assets/sky.png";
import groundImage from "../assets/platform.png";
import starImage from "../assets/star.png";
import bombImage from "../assets/bomb.png";
import dudeSpriteSheet from "../assets/dude.png";
import robotSpriteSheet from "../assets/robot.png";
import doorSpriteSheet from "../assets/door.png";
import buttonSpriteSheet from "../assets/button.png";
import flagSpriteSheet from "../assets/flag.png";
import marioTiles from "../assets/mario-tiles.png";
import superMarioMap from "../assets/super-mario-map.json";

import { Enemy } from "../components/enemy-components.js";
import { Player } from "../components/player-components.js";
import { Sprite } from "../components/phaser-components.js";
import { Hackable } from "../components/hackable-components.js";
import { Door, Button } from "../components/interactable-components.js";

import { EnemySystem } from "../systems/enemy-systems.js";
import { PlayerSystem } from "../systems/player-systems.js";
import { SpriteSystem } from "../systems/phaser-systems.js";
import { HackableSystem } from "../systems/hackable-systems.js";
import {
  FlagSystem,
  DoorSystem,
  ButtonSystem,
} from "../systems/interactable-systems.js";

var willExit = false;

export default class GameScene extends ECSScene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("sky", skyImage);
    this.load.image("ground", groundImage);
    this.load.image("star", starImage);
    this.load.image("bomb", bombImage);
    this.load.spritesheet("dude", dudeSpriteSheet, {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet("robot", robotSpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("door", doorSpriteSheet, {
      frameWidth: 16,
      frameHeight: 48,
    });

    this.load.spritesheet("button", buttonSpriteSheet, {
      frameWidth: 32,
      frameHeight: 16,
    });

    this.load.spritesheet("flag", flagSpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("mario-tiles", marioTiles);
    this.load.tilemapTiledJSON("map", superMarioMap);
  }

  create() {
    willExit = false;

    // systems
    this.flagSystem = new FlagSystem(this);
    this.playerSystem = new PlayerSystem(this);
    this.enemySystem = new EnemySystem(this);
    this.hackableSystem = new HackableSystem(this);
    this.doorSystem = new DoorSystem(this);
    this.buttonSystem = new ButtonSystem(this);

    this.setupMapAndCamera("SuperMarioBros-World1-1", "mario-tiles", "World1");
    this.setupUI();

    const player = this.physics.add.sprite(20, 150, "dude");
    const hackableEntity = this.physics.add.sprite(20, 20, "robot");

    hackableEntity.setDataEnabled();
    hackableEntity.setData("hackable", {
      properties: {
        ai: "moveLeft()",
      },
      update: function (ai) {
        C4C.Interpreter.run(ai);
      },
    });

    C4C.Interpreter.define("moveLeft", function () {
      hackableEntity.setVelocityX(-40);
    });

    C4C.Interpreter.define("moveRight", function () {
      hackableEntity.setVelocityX(40);
    });

    C4C.Interpreter.define("jump", function () {
      if (hackableEntity.body.blocked.down) {
        hackableEntity.setVelocityY(-150);
      }
    });

    C4C.Interpreter.define("isOnGround", function () {
      return hackableEntity.body.blocked.down;
    });

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: true,
      text: "Touch the blue square to win.",
      hasButton: true,
    });

    this.addEntity(player, [Player]);
    this.addEntity(hackableEntity, [Enemy, Hackable]);

    this.events.on("shutdown", () => {
      resetWorld(this.world);
    });

    // These two are currently responsible for making the door and button game
    // objects. If you had a hackable doors or buttons, these need to come
    // before the hackable system. This will change when we abstract these into
    // ecs-scene.
    this.flagSystem.create();
    this.doorSystem.create();
    this.buttonSystem.create();
    this.playerSystem.create();
    this.enemySystem.create();
    this.hackableSystem.create();
  }

  update() {
    this.flagSystem.update();
    this.doorSystem.update();
    this.buttonSystem.update();
    this.playerSystem.update();
    this.enemySystem.update();
    this.hackableSystem.update();
  }

  exit() {
    this.scene.stop();
    this.scene.stop("ui");
    this.scene.start("level-select");
  }

  win() {
    if (!willExit) {
      this.time.addEvent({
        delay: 2000,
        callback: this.exit,
        callbackScope: this,
      });
      willExit = true;
    }

    C4C.UI.popup({
      mainScene: this,
      uiScene: this.scene.get("ui"),
      pausing: false,
      text: "You Win!",
      hasButton: false,
    });
    this.playerSystem.win();
  }
}
