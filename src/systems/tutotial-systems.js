
import Phaser from "phaser";
import System from "./system.js";
import eventsCenter from "../events-center.js";
import { createSpriteFromObject } from "../utils.js";

import {
  Flag,
  Door,
  Button,
  Platform,
  Text,
} from "../components/interactable-components.js";
class TutorialSystem extends System {
    constructor(scene) {
      super(scene, [Text]);
    }
  
    createSprites() {
      const Text = this.scene.map.filterObjects(
        "Interactables",
        (o) => o.type == "text"
      );
  console.log(text);
    }
  
    create() {
      
    }
  
    update() { }
  
    exit() { }
  }

  export {TutorialSystem};
