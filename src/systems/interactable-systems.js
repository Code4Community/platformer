import Phaser from "phaser";
import System from "./system.js";
import eventsCenter from "../events-center.js";
import { createSpriteFromObject } from "../utils.js";

import { Player } from "../components/player-components.js";
import { Enemy } from "../components/enemy-components.js";
import {
  Flag,
  Door,
  Button,
  Platform,
} from "../components/interactable-components.js";

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
    const enemyGroup = this.getComponentSpriteGroup([Enemy]);

    this.scene.anims.create({
      key: "open",
      frames: [{ key: spriteSheetName, frame: 1 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "close",
      frames: [{ key: spriteSheetName, frame: 2 }],
      frameRate: 20,
    });

    this.forEnteredObjects((door) => {
      this.scene.physics.add.collider(playerGroup, door);
      this.scene.physics.add.collider(enemyGroup, door);
    });
  }

  update() {
    this.forAllObjects((door) => {
      if (door.state == 1) {
        door.anims.play("open");
        door.body.checkCollision.none = true;
      } else {
        door.anims.play("close");
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
    this.playerGroup = this.getComponentSpriteGroup([Player]);
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

      if (
        this.scene.physics.overlap(this.enemyGroup, button) ||
        this.scene.physics.overlap(this.playerGroup, button)
      ) {
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

class PlatformSystem extends System {
  constructor(scene) {
    super(scene, [Platform]);
  }

  createSprites() {
    const platforms = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "platform"
    );

    platforms.forEach((platform) => {
      const sprite = createSpriteFromObject(this.scene, platform, "platform");
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.addEntity(sprite, [Platform]);
    });
  }

  create() {
    const playerGroup = this.getComponentSpriteGroup([Player]);
    const enemyGroup = this.getComponentSpriteGroup([Enemy]);

    this.forEnteredObjects((platform) => {
      this.scene.physics.add.collider(playerGroup, platform);
      this.scene.physics.add.collider(enemyGroup, platform);

      this.scene.tweens.add({
        targets: platform,
        x: {
          value: 200,
          duration: 1000,
          ease: "Linear",
          yoyo: -1,
          repeat: -1,
        },
      });
    });
  }

  update() {}

  exit() {}
}

export { FlagSystem, DoorSystem, ButtonSystem, PlatformSystem };
