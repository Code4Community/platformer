import Phaser from "phaser";
import System from "./system.js";

import { Star } from "../components/star-components.js";


class StarSystem extends System {
  constructor(scene) {
    super(scene, [star]);
  }

  createSprites() {
    const stars = this.scene.map.filterObjects(
      "Stars",
      (o) => o.type == "star"
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
}
export { StarSystem };
