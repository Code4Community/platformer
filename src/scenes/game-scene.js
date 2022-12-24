import C4C from "c4c-lib";
import ECSScene from "./ecs-scene.js";
import eventsCenter from "../events-center.js";
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
import platformSpriteSheet from "../assets/platform.png";
import marioTiles from "../assets/mario-tiles.png";

import jumpMP3 from "../assets/jump.mp3";

import { Enemy } from "../components/enemy-components.js";
import { Player } from "../components/player-components.js";
import { Sprite } from "../components/phaser-components.js";
import { Hackable } from "../components/hackable-components.js";
import { Door, Button } from "../components/interactable-components.js";

import { EnemySystem } from "../systems/enemy-systems.js";
import { PlayerSystem } from "../systems/player-systems.js";
import { HackableSystem } from "../systems/hackable-systems.js";
import {
  FlagSystem,
  DoorSystem,
  ButtonSystem,
  PlatformSystem,
  StarSystem,
} from "../systems/interactable-systems.js";

const levelsDefeated = new Set();
export default class GameScene extends ECSScene {
  constructor(key) {
    super(key);

    this.flagSystem = new FlagSystem(this);
    this.playerSystem = new PlayerSystem(this);
    this.enemySystem = new EnemySystem(this);
    this.hackableSystem = new HackableSystem(this);
    this.doorSystem = new DoorSystem(this);
    this.buttonSystem = new ButtonSystem(this);
    this.platformSystem = new PlatformSystem(this);
    this.starSystem = new StarSystem(this);
  }

  preload() {
    this.load.image("sky", skyImage);
    this.load.image("ground", groundImage);
    this.load.image("star", starImage);
    this.load.image("bomb", bombImage);

    this.load.audio("jump", [jumpMP3]);

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

    this.load.spritesheet("platform", platformSpriteSheet, {
      frameWidth: 32,
      frameHeight: 16,
    });

    this.load.image("mario-tiles", marioTiles);
    this.load.tilemapTiledJSON(this.tilemapKey, this.tilemapPath);
  }

  create() {
    this.setupMapAndCamera();
    this.setupUI();

    eventsCenter.once("win", () => {
      levelsDefeated.add(this.scene.scene.constructor.name);
      C4C.UI.popup({
        mainScene: this,
        uiScene: this.scene.get("ui"),
        pausing: false,
        text: "You Win!",
        hasButton: false,
      });

      this.playerSystem.win();

      this.time.addEvent({
        delay: 2000,
        callback: this.exit,
        callbackScope: this,
      });
    });

    this.flagSystem.createSprites();
    this.doorSystem.createSprites();
    this.buttonSystem.createSprites();
    this.playerSystem.createSprites();
    this.enemySystem.createSprites();
    this.platformSystem.createSprites();
    this.starSystem.createSprites();

    this.levelCreate();

    this.flagSystem.create();
    this.doorSystem.create();
    this.buttonSystem.create();
    this.playerSystem.create();
    this.enemySystem.create();
    this.hackableSystem.create();
    this.platformSystem.create();
    this.starSystem.create();
  }

  update() {
    this.flagSystem.update();
    this.doorSystem.update();
    this.buttonSystem.update();
    this.playerSystem.update();
    this.enemySystem.update();
    this.hackableSystem.update();
    this.starSystem.update();
  }

  exit() {
    resetWorld(this.world);
    eventsCenter.destroy();
    this.scene.stop();
    this.scene.stop("ui");
    this.scene.start("LevelSelect");
  }
}
export { levelsDefeated };
