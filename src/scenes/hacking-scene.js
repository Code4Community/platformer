import Phaser from "phaser";
import ECSScene from "./ecs-scene.js";
import eventsCenter from "../events-center.js";
import Entity from "../entity.js";

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

export default class HackingScene extends ECSScene {
  player;
  cursors;
  hackableGuy;
  layer;
  door;
  playerDoorCollider;

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
    camera.setZoom(2);

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

    // Create Everything
    this.spriteSystem.create();
    this.playerSystem.create("dude");
    this.enemySystem.create();
    this.hackableSystem.create();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.scene.run("ui-scene");

    player.getObject().x = 20;
    player.getObject().y = 150;

    camera.startFollow(player.getObject());

    // getting the tiled objects
    var objectLayer = map.getObjectLayer("Interactables");
    var objects = objectLayer.objects;

    console.log(objects)

    var doors = objects.filter((object) => {
      return object.type == "door";
    });

    this.doorObjects = doors.map((d) => {
      var sprite = new Phaser.GameObjects.Sprite(this);
      sprite.setName(d.name);
      sprite.setPosition(d.x, d.y);
      sprite.setTexture("door", null);
      sprite.displayWidth = d.width;
      sprite.displayHeight = d.height;

      //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
      //  Do not offset objects with zero dimensions (e.g. points).
      var offset = {
        x: sprite.originX * d.width,
        y: (sprite.originY - 1) * d.height,
      };

      sprite.x += offset.x;
      sprite.y += offset.y;

      sprite.setDataEnabled();
      sprite.data.set("doorID", d.id);

      this.add.existing(sprite);
      this.physics.add.existing(sprite, true);
      this.playerDoorCollider = this.physics.add.collider(
        player.getObject(),
        sprite
      );

      return sprite;
    });

    // buttons
    var buttons = objects.filter((object) => {
      return object.type == "button";
    });

    var aButton;

    var buttonObjects = buttons.map((b) => {
      var sprite = new Phaser.GameObjects.Sprite(this);
      sprite.setName(b.name);
      sprite.setPosition(b.x, b.y);
      sprite.setTexture("button", null);
      sprite.displayWidth = b.width;
      sprite.displayHeight = b.height;

      //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
      //  Do not offset objects with zero dimensions (e.g. points).
      var offset = {
        x: sprite.originX * b.width,
        y: (sprite.originY - 1) * b.height,
      };

      sprite.x += offset.x;
      sprite.y += offset.y;

      sprite.setDataEnabled();

      b.properties.forEach((p) => {
        sprite.data.set(p.name, p.value);
      });

      this.add.existing(sprite);

      // get door based on door property
      const doorID = sprite.data.values.door;
      var associatedDoor = this.doorObjects.find((door) => {
        return door.data.values.doorID == doorID;
      });

      var buttonCallback = (ob1, ob2) => {
        console.log("hello");
      };

      this.physics.add.existing(sprite, true);

      var collisionCallback = (ob1, ob2) => {
        if (associatedDoor.state == 0) {
          associatedDoor.state = 1;
          console.log(associatedDoor.state);
        }
      };

      this.physics.add.overlap(
        hackableEntity.getObject(),
        sprite,
        collisionCallback
      );

      return sprite;
    });
  }

  update() {
    this.doorObjects.forEach((d) => {
      if (d.state == 0) {
        console.log("door closed");
      } else {
        console.log("door opened");
        this.physics.world.removeCollider(this.playerDoorCollider);
      }
    });

    this.playerSystem.update(this.cursors);
    this.hackableSystem.update();
  }
}
