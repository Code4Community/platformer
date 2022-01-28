import Phaser from "phaser";
import System from "./system.js";

import { Player } from "../components/player-components.js";
import { Enemy } from "../components/enemy-components.js";
import { Flag, Door, Button } from "../components/interactable-components.js";

class FlagSystem extends System {
  constructor(scene) {
    super(scene, [Flag]);
  }

  create() {
    const playerGroup = this.getComponentSpriteGroup([Player]);
    const flags = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "flag"
    );

    flags.forEach((flag) => {
      const sprite = new Phaser.GameObjects.Sprite(this.scene);
      sprite.setName(flag.name);
      sprite.setPosition(flag.x, flag.y);
      sprite.setTexture("flag", null);
      sprite.displayWidth = flag.width;
      sprite.displayHeight = flag.height;

      //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
      //  Do not offset objects with zero dimensions (e.g. points).
      var offset = {
        x: sprite.originX * flag.width,
        y: (sprite.originY - 1) * flag.height,
      };

      sprite.x += offset.x;
      sprite.y += offset.y;
      sprite.state = 0;

      const flagTouchCallback = (o1, o2) => {
        o1.scene.win();
      };

      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.physics.add.overlap(playerGroup, sprite, flagTouchCallback);
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

  create() {
    const playerGroup = this.getComponentSpriteGroup([Player]);
    const doors = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "door"
    );

    doors.forEach((door) => {
      const sprite = new Phaser.GameObjects.Sprite(this.scene);
      sprite.setName(door.name);
      sprite.setPosition(door.x, door.y);
      sprite.setTexture("door", null);
      sprite.displayWidth = door.width;
      sprite.displayHeight = door.height;

      //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
      //  Do not offset objects with zero dimensions (e.g. points).
      var offset = {
        x: sprite.originX * door.width,
        y: (sprite.originY - 1) * door.height,
      };

      sprite.x += offset.x;
      sprite.y += offset.y;
      sprite.state = 0;

      doorMap.set(door.id, sprite);

      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.physics.add.collider(playerGroup, sprite);
    });
  }

  update() {}

  exit() {}
}

class ButtonSystem extends System {
  constructor(scene) {
    super(scene, [Button]);
  }

  create() {
    const enemyGroup = this.getComponentSpriteGroup([Enemy]);
    const buttons = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "button"
    );

    buttons.forEach((button) => {
      const sprite = new Phaser.GameObjects.Sprite(this.scene);
      sprite.setName(button.name);
      sprite.setPosition(button.x, button.y);
      sprite.setTexture("button", null);
      sprite.displayWidth = button.width;
      sprite.displayHeight = button.height;

      //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
      //  Do not offset objects with zero dimensions (e.g. points).
      var offset = {
        x: sprite.originX * button.width,
        y: (sprite.originY - 1) * button.height,
      };

      sprite.x += offset.x;
      sprite.y += offset.y;

      const doorID = button.properties.find((p) => p.name == "door").value;
      const associatedDoor = doorMap.get(doorID);

      const buttonPressedCallback = (o1, o2) => {
        if (associatedDoor.state == 0) {
          associatedDoor.state = 1;
          associatedDoor.body.checkCollision.none = true;
        }
      };

      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite, true);
      this.scene.physics.add.overlap(enemyGroup, sprite, buttonPressedCallback);
    });
  }

  update() {}

  exit() {}
}

export { FlagSystem, DoorSystem, ButtonSystem };
