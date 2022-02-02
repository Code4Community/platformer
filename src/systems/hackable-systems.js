import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";

import { Hackable } from "../components/hackable-components.js";

let hasError = false;
let normalTarget = null;

function toggleHacking() {
  if (this.getData("hacked")) {
    stopHacking(this);
    this.setData("hacked", false);
  } else {
    startHacking(this);
    this.setData("hacked", true);
  }
}

function startHacking(entity) {
  const cam = entity.scene.cameras.main;
  cam.stopFollow();
  cam.pan(entity.x, entity.y, 1000, "Power2");
  cam.zoomTo(12, 1000);

  entity.scene.input.keyboard.disableGlobalCapture();
  C4C.Editor.Window.open();

  if ("ai" in entity.getData("hackable").properties) {
    const ai = entity.getData("hackable").properties.ai;
    C4C.Editor.setText(ai);
  }
}

function stopHacking(entity) {
  const cam = entity.scene.cameras.main;
  cam.pan(0, 0, 1000, "Power2", false, (cam, status) => {
    if (status == 1.0) {
      cam.startFollow(normalTarget, false, 0.1, 0.1);
    }
  });
  cam.zoomTo(2.5, 1000);

  entity.scene.input.keyboard.enableGlobalCapture();
  C4C.Editor.Window.close();

  entity.data.values.hackable.properties.ai = C4C.Editor.getText();
  hasError = false;
}

class HackableSystem extends System {
  constructor(scene) {
    super(scene, [Hackable]);
  }

  create() {
    // This relies on the camera already being set to follow someone. Not the
    // best.
    normalTarget = this.scene.cameras.main._follow;

    this.forEnteredObjects((o) => {
      o.setInteractive({
        useHandCursor: true,
      });
      o.on("pointerdown", toggleHacking);
      o.setData("hacked", false);
    });
  }

  update() {
    this.forAllObjects((o) => {
      // Could be replaced with a map.
      const updateFunc = o.getData("hackable").update;
      const ai = o.getData("hackable").properties.ai;

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
