import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";

import { Hackable } from "../components/hackable-components.js";

function toggleHacking() {
  let entity = this;

  if (entity.getData("hacked")) {
    stopHacking(entity);
    entity.setData("hacked", false);
  } else {
    startHacking(entity);
    entity.setData("hacked", true);
  }
}

function startHacking(entity) {
  entity.scene.input.keyboard.disableGlobalCapture();
  C4C.Editor.Window.open();

  if ("ai" in entity.getData("hackable").properties) {
    const ai = entity.getData("hackable").properties.ai;
    C4C.Editor.setText(ai);
  }
}

function stopHacking(entity) {
  entity.scene.input.keyboard.enableGlobalCapture();
  C4C.Editor.Window.close();

  entity.data.values.hackable.properties.ai = C4C.Editor.getText();
}

class HackableSystem extends System {
  constructor(scene) {
    super(scene, [Hackable]);
  }

  create() {
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
      updateFunc(ai);
    });
  }

  exit() {}
}

export { HackableSystem };
