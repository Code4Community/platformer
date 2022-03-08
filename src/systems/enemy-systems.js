import Phaser from "phaser";
import System from "./system.js";

import { createSpriteFromObject } from "../utils.js";
import { Enemy } from "../components/enemy-components.js";

class EnemySystem extends System {
  constructor(scene) {
    super(scene, [Enemy]);
  }

  createSprites() {
    const enemies = this.scene.map.filterObjects(
      "Interactables",
      (o) => o.type == "enemy"
    );

    enemies.forEach((enemy) => {
      const sprite = createSpriteFromObject(this.scene, enemy, "robot");
      this.scene.add.existing(sprite);
      this.scene.physics.add.existing(sprite);
      this.scene.addEntity(sprite, [Enemy]);
    });
  }

  create() {
    const spriteSheetName = "robot";

    this.forEnteredObjects((enemy) => {
      enemy.setDepth(1);
      enemy.body.setBounce(0.2);
      enemy.body.setCollideWorldBounds(true);
      enemy.body.setGravityY(300);

      this.scene.physics.add.collider(enemy, this.scene.layer);
    });
  }

  update() {
    this.forAllObjects((enemy) => {
      // if (enemy.body.velocity.x < 10) {
      //   enemy.anims.play("left", true);
      // } else if (enemy.body.velocity.x > 10) {
      //   enemy.anims.play("right", true);
      // } else {
      //   enemy.anims.play("turn");
      // }
    });
  }

  exit() {}
}

export { EnemySystem };
