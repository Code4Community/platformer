import Phaser from "phaser";
import System from "./system.js";
import eventsCenter from "../events-center.js";

import { Player } from "../components/player-components.js";
import { Enemy } from "../components/enemy-components.js";
import { Flag, Door, Button } from "../components/interactable-components.js";

function createSpriteFromObject(scene, obj, texture) {
  const sprite = new Phaser.GameObjects.Sprite(scene);
  sprite.setName(obj.name);
  sprite.setDepth(0);
  sprite.setTexture(texture, null);
  sprite.displayWidth = obj.width;
  sprite.displayHeight = obj.height;

  //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
  //  Do not offset objects with zero dimensions (e.g. points).
  var offset = {
    x: sprite.originX * obj.width,
    y: (sprite.originY - 1) * obj.height,
  };

  sprite.setPosition(obj.x + offset.x, obj.y + offset.y);

  //  Set properties the class may have, or setData those it doesn't
  if (Array.isArray(obj.properties)) {
    // Tiled objects custom properties format
    obj.properties.forEach(function (propData) {
      var key = propData["name"];
      if (sprite[key] !== undefined) {
        sprite[key] = propData["value"];
      } else {
        sprite.setData(key, propData["value"]);
      }
    });
  } else {
    for (var key in obj.properties) {
      if (sprite[key] !== undefined) {
        sprite[key] = obj.properties[key];
      } else {
        sprite.setData(key, obj.properties[key]);
      }
    }
  }

  return sprite;
}

class FlagSystem extends System {
  constructor(scene) {
    super(scene, [Flag]);
  }

  createSprites() {
    const flags = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "flag"
    );

    flags.forEach((flag) => {
      const sprite = createSpriteFromObject(this.scene, flag, "flag");
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.addEntity(sprite, [Flag]);
    });
  }

  create() {
    const playerGroup = this.getComponentSpriteGroup([Player]);

    this.forEnteredObjects((flag) => {
      const flagTouchCallback = (o1, o2) => {
        eventsCenter.emit("win");
      };

      this.scene.physics.add.overlap(playerGroup, flag, flagTouchCallback);
    });
  }

  update() {}

  exit() {}
}

const doorMap = new Map();

class DoorSystem extends System {
  constructor(scene) {
    super(scene, [Door]);
  }

  createSprites() {
    const doors = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "door"
    );

    doors.forEach((door) => {
      const sprite = createSpriteFromObject(this.scene, door, "door");
      doorMap.set(door.id, sprite);
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.addEntity(sprite, [Door]);
    });
  }

  create() {
    const spriteSheetName = "door";
    const playerGroup = this.getComponentSpriteGroup([Player]);

    this.scene.anims.create({
      key: "open",
      frames: [{ key: spriteSheetName, frame: 2 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "close",
      frames: [{ key: spriteSheetName, frame: 1 }],
      frameRate: 20,
    });

    this.forEnteredObjects((door) => {
      this.scene.physics.add.collider(playerGroup, door);
    });
  }

  update() {
    this.forAllObjects((door) => {
      if (door.state == 1) {
        door.anims.play("close");
        door.body.checkCollision.none = true;
      } else {
        door.anims.play("open");
        door.body.checkCollision.none = false;
      }
    });
  }

  exit() {}
}

class ButtonSystem extends System {
  constructor(scene) {
    super(scene, [Button]);
  }

  createSprites() {
    const buttons = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "button"
    );

    buttons.forEach((button) => {
      const sprite = createSpriteFromObject(this.scene, button, "button");
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.addEntity(sprite, [Button]);
    });
  }

  create() {
    this.enemyGroup = this.getComponentSpriteGroup([Enemy]);
    const spriteSheetName = "button";

    this.scene.anims.create({
      key: "down",
      frames: [{ key: spriteSheetName, frame: 1 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "up",
      frames: [{ key: spriteSheetName, frame: 2 }],
      frameRate: 20,
    });
  }

  update() {
    this.forAllObjects((button) => {
      const doorID = button.getData("door");
      const associatedDoor = doorMap.get(doorID);

      if (this.scene.physics.overlap(this.enemyGroup, button)) {
        button.anims.play("down");
        associatedDoor.state = 1;
      } else {
        button.anims.play("up");
        associatedDoor.state = 0;
      }
    });
  }

  exit() {}
}

export { FlagSystem, DoorSystem, ButtonSystem };
