import Phaser from "phaser";
import System from "./system.js";

import { Enemy } from "../components/enemy-components.js";

class EnemySystem extends System {
  constructor(scene) {
    super(scene, [Enemy]);
  }

  create() {
    this.forEnteredObjects((enemy) => {
      enemy.setBounce(0.2);
      enemy.setCollideWorldBounds(true);
      enemy.body.setGravityY(300);

      this.scene.physics.add.collider(enemy, this.scene.layer);
    });
  }

  update(cursors) {}

  exit() {}
}

export { EnemySystem };
