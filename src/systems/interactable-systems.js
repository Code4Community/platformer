import Phaser from "phaser";
import System from "./system.js";

// oiajwodij

import { Player } from "../components/player-components.js";
import { Door, Button } from "../components/interactable-components.js";

const doorMap = new Map();

class DoorSystem extends System {
  constructor(scene) {
    super(scene, [Door]);
  }

  createFromObject(doorObject) {
    const sprite = new Phaser.GameObjects.Sprite(this.scene);
    sprite.setName(doorObject.name);
    sprite.setPosition(doorObject.x, doorObject.y);
    sprite.setTexture("door", null);
    sprite.displayWidth = doorObject.width;
    sprite.displayHeight = doorObject.height;

    //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
    //  Do not offset objects with zero dimensions (e.g. points).
    var offset = {
      x: sprite.originX * doorObject.width,
      y: (sprite.originY - 1) * doorObject.height,
    };

    sprite.x += offset.x;
    sprite.y += offset.y;

    doorMap.set(doorObject.id, sprite);

    this.add.existing(sprite);
    this.physics.add.existing(sprite, true);
    this.playerDoorCollider = this.physics.add.collider(
      player.getObject(),
      sprite
    );
  }

  update() {}

  exit() {}
}

class ButtonSystem extends System {
  constructor(scene) {
    super(scene, [Button]);
  }

  create(spriteSheetName) {
    const getEnemies = defineQuery([Enemy]);
    const enemies = getEnemies(this.world);

    const getDoors = defineQuery([Door]);
    const doors = getDoors(this.world);

    const objectLayer = this.scene.map.getObjectLayer("Interactables");
    const objects = objectLayer.objects;
    const buttons = objects.filter((o) => o.type == "button");

    buttons.forEach((b) => {
      const buttonSprite = new Phaser.GameObjects.Sprite();
      buttonSprite.setName(b.name);
      buttonSprite.setPosition(b.x, b.y);
      buttonSprite.setTexture(spriteSheetName, null);
      buttonSprite.displayWidth = b.width;
      buttonSprite.displayHeight = b.height;

      var offset = {
        x: buttonSprite.originX * b.width,
        y: (buttonSprite.originY - 1) * b.height,
      };

      buttonSprite.x += offset.x;
      buttonSprite.y += offset.y;

      buttonSprite.setDataEnabled();

      b.properties.forEach((p) => {
        buttonSprite.data.set(p.name, p.value);
      });

      this.scene.add.existing(buttonSprite);
      this.scene.physics.add.existing(buttonSprite, true);

      // Button -> Door Interaction

      const buttonPressedCallback = (o1, o2) => {
        if (associatedDoor.state == 0) {
          associatedDoor.state = 1;
          console.log(associatedDoor.state);
        }
      };

      enemies.forEach((enemyID) => {
        const enemy = this.scene.globalEntityMap.get(enemyID);
        this.scene.physics.add.collider(player, buttonSprite);
      });
    });
  }

  update() {}

  exit() {}
}

export { DoorSystem, ButtonSystem };
