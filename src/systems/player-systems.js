import Phaser from "phaser";
import System from "./system.js";

import { createSpriteFromObject } from "../utils.js";
import { Player } from "../components/player-components.js";

class PlayerSystem extends System {
  constructor(scene) {
    super(scene, [Player]);
  }

  createSprites() {
    const players = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "player"
    );

    players.forEach((player) => {
      const sprite = createSpriteFromObject(this.scene, player, "dude");
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite);
      this.scene.addEntity(sprite, [Player]);
    });
  }

  create() {
    const spriteSheetName = "dude";

    // Register animations with the scene's animation manager
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers(spriteSheetName, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: spriteSheetName, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers(spriteSheetName, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: 1,
    });

    this.forEnteredObjects((player) => {
      player.setDepth(1);
      player.body.setBounce(0.2);
      player.body.setCollideWorldBounds(true);
      player.body.setGravityY(300);
      player.anims.play("turn");

      this.scene.physics.add.collider(player, this.scene.layer);
      this.scene.cameras.main.startFollow(player, false, 0.1, 0.1);
    });

    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    this.forAllObjects((player) => {
      if (player.getData("celebrating")) {
        player.body.setVelocityX(0);
        player.anims.play("turn");
        if (player.body.blocked.down) {
          player.body.setVelocityY(-250);
        }
      } else {
        if (this.cursors.left.isDown) {
          player.body.setVelocityX(-160);
          player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
          player.body.setVelocityX(160);
          player.anims.play("right", true);
        } else {
          player.body.setVelocityX(0);
          player.anims.play("turn");
        }
        if (this.cursors.up.isDown && player.body.blocked.down) {
          player.body.setVelocityY(-350);
        }
      }
    });
  }

  win() {
    this.forAllObjects((player) => {
      player.setData("celebrating", true);
    });
  }
}

export { PlayerSystem };
