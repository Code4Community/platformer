import Phaser from "phaser";
import System from "./system.js";

import { Emitter, Sprite, Image } from "../components/phaser-components.js";

class SpriteSystem extends System {
  constructor(scene) {
    super(scene, [Sprite]);

    // There are two things at play here: Phaser GameObjects and bitECS
    // entities. The bitECS entities are just numbers. In order to have
    // access to all the complex data available from the Phaser side, we
    // need to associate those numbers (IDs) with Phaser Gameobjects. Then
    // whenever this system needs to read an entities X position or
    // something, it can just lookup the Phaser GameObject in this scene's
    // global entity map and poke around.
  }

  create() {
    const entered = this.getEntered(this.world);

    entered.forEach((entityID) => {
      const textureByteString = Sprite.sheetKey[entityID];
      const textureKey = String.fromCharCode(...textureByteString);
      const sprite = this.scene.physics.add.sprite(0, 0, textureKey);

      this.scene.globalEntityMap.set(entityID, sprite);
    });
  }

  update() {}

  exit() {}
}

class ImageSystem extends System {
  constructor(scene) {
    super(scene, [Image]);
  }

  create() {
    const entered = this.getEntered(this.world);

    entered.forEach((entityID) => {
      const imageByteString = Image.imageKey[entityID];
      const imageKey = String.fromCharCode(...imageByteString);
      const image = this.scene.physics.add.image(0, 0, imageKey);

      this.scene.globalEntityMap.set(entityID, image);
    });
  }

  update() {}

  exit() {}
}

class EmitterSystem extends System {
  constructor(scene) {
    super(scene, [Emitter]);
  }

  create(emitters) {
    const entered = this.getEntered(this.world);

    entered.forEach((entityID) => {
      const eid = Emitter.emitterID[entityID];
      const emitter = emitters[eid];
      const entityObject = this.scene.globalEntityMap.get(entityID);

      emitter.startFollow(entityObject);
    });
  }

  update(world) {}

  exit(world) {}
}

export { SpriteSystem, ImageSystem, EmitterSystem };
