import C4C from "c4c-editor-and-interpreter";
import ECSScene from "./ecs-scene.js";

import skyImage from "../assets/sky.png";
import groundImage from "../assets/platform.png";
import starImage from "../assets/star.png";
import bombImage from "../assets/bomb.png";
import dudeSpriteSheet from "../assets/dude.png";
import doorSpriteSheet from "../assets/door.png";
import buttonSpriteSheet from "../assets/button.png";
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
import { DoorSystem, ButtonSystem } from "../systems/interactable-systems.js";

export default class HackingScene extends ECSScene {
  constructor() {
    super("hacking");
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

    this.load.spritesheet("door", doorSpriteSheet, {
      frameWidth: 16,
      frameHeight: 48,
    });

    this.load.spritesheet("button", buttonSpriteSheet, {
      frameWidth: 32,
      frameHeight: 16,
    });

    this.load.image("mario-tiles", marioTiles);
    this.load.tilemapTiledJSON("map", superMarioMap);
  }

  create() {
    // systems
    //this.spriteSystem = new SpriteSystem(this);
    this.playerSystem = new PlayerSystem(this);
    this.enemySystem = new EnemySystem(this);
    this.hackableSystem = new HackableSystem(this);
    this.doorSystem = new DoorSystem(this);
    this.buttonSystem = new ButtonSystem(this);

    this.setupMapAndCamera("SuperMarioBros-World1-1", "mario-tiles", "World1");
    this.setupUI();

    const player = this.physics.add.sprite(20, 150, "dude");
    const hackableEntity = this.physics.add.sprite(20, 20, "dude");

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

    this.addEntity(player, [Player]);
    this.addEntity(hackableEntity, [Enemy, Hackable]);

    // Create Everything
    // this.spriteSystem.create();

    // These two are currently responsible for making the door and button
    // game objects. If you had a hackable doors or buttons, these need to come
    // before the hackable system.
    this.doorSystem.create();
    this.buttonSystem.create();

    this.playerSystem.create();
    this.enemySystem.create();
    this.hackableSystem.create();
  }

  update() {
    this.playerSystem.update();
    this.hackableSystem.update();
  }
}
