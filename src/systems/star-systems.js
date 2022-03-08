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

  }
}
export { StarSystem };
