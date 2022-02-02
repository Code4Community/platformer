import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";
import eventsCenter from "../events-center.js";

import { Hackable } from "../components/hackable-components.js";

let hasError = false;

class HackableSystem extends System {
  constructor(scene) {
    super(scene, [Hackable]);
  }

  create() {
    this.forEnteredObjects((o) => {
      o.setInteractive({
        useHandCursor: true,
      });

      o.setData("hacked", false);

      o.on("pointerdown", () => {
        if (!o.getData("hacked")) {
          eventsCenter.emit("enterHackingMode", o, o.scene);
          o.setData("hacked", true);
        }
      });
    });

    eventsCenter.on("exitHackingMode", (entity, scene) => {
      if (entity.getData("hacked")) {
        entity.setData("ai", C4C.Editor.getText());
        hasError = false;
      }
    });
  }

  update() {
    this.forAllObjects((o) => {
      // Could be replaced with a map.
      const updateFunc = o.getData("update-function");
      const ai = o.getData("ai");

      if (!hasError) {
        try {
          updateFunc(ai);
        } catch (err) {
          alert(err + " Oops.");
          hasError = true;

          o.setVelocityX(0);
          o.setVelocityY(0);
        }
      }
    });
  }

  exit() {}
}

export { HackableSystem };
