import Phaser from "phaser";
import ECSScene from "./ecs-scene.js";
import eventsCenter from "../events-center.js";
import Entity from "../entity.js";

import skyImage from "../assets/sky.png";
import groundImage from "../assets/platform.png";
import starImage from "../assets/star.png";
import bombImage from "../assets/bomb.png";
import dudeSpriteSheet from "../assets/dude.png";
import marioTiles from "../assets/mario-tiles.png";
import superMarioMap from "../assets/super-mario-map.json";

import { Enemy } from "../components/enemy-components.js";
import { Player } from "../components/player-components.js";
import { Sprite } from "../components/phaser-components.js";
import { Hackable } from "../components/hackable-components.js";
import { EnemySystem } from "../systems/enemy-systems.js";
import { PlayerSystem } from "../systems/player-systems.js";
import { SpriteSystem } from "../systems/phaser-systems.js";
import { HackableSystem } from "../systems/hackable-systems.js";

export default class HackingScene extends ECSScene {
  player;
  cursors;
  hackableGuy;
  layer;

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

    this.load.image("mario-tiles", marioTiles);
    this.load.tilemapTiledJSON("map", superMarioMap);
  }

  create() {
    // The following two strings are keys inside the json.
    var map = this.make.tilemap({ key: "map" });
    var tileset = map.addTilesetImage("SuperMarioBros-World1-1", "mario-tiles");
    this.layer = map.createLayer("World1", tileset, 0, 0);
    this.layer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.layer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2.5);

    // entities
    const player = new Entity(this, [Sprite, Player]);
    const hackableEntity = new Entity(this, [Sprite, Enemy, Hackable]);

    player.set(Sprite, "sheetKey", "dude");
    hackableEntity.set(Sprite, "sheetKey", "dude");

    // systems
    this.enemySystem = new EnemySystem(this);
    this.playerSystem = new PlayerSystem(this);
    this.spriteSystem = new SpriteSystem(this);
    this.hackableSystem = new HackableSystem(this);

    this.spriteSystem.create();
    this.playerSystem.create("dude");
    this.enemySystem.create();
    this.hackableSystem.create();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.scene.run("ui-scene");

    hackableEntity.getObject().x = 0;
    hackableEntity.getObject().y = 0;

    camera.startFollow(player.getObject());
  }

  update() {
    this.playerSystem.update(this.cursors);
    this.hackableSystem.update();
  }
}
