import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";

import { Hackable } from "../components/hackable-components.js";

function toggleHacking() {
  let entity = this;

  if (entity.data.get("hacked")) {
    stopHacking(entity);
    entity.data.set("hacked", false);
  } else {
    startHacking(entity);
    entity.data.set("hacked", true);
  }
}

function startHacking(entity) {
  C4C.Editor.Window.open();

  if ("ai" in entity.data.get("hackable").properties) {
    const ai = entity.data.get("hackable").properties.ai;
    C4C.Editor.setText(ai);
  }
}

function stopHacking(entity) {
  const ai = C4C.Editor.getText();
  entity.data.values.hackable.properties.ai = ai;
}

class HackableSystem extends System {
  constructor(scene) {
    super(scene, [Hackable]);
  }

  create() {
    this.forEnteredObjects((o) => {
      o.setInteractive();
      o.on("pointerdown", toggleHacking);
      o.data.set("hacked", false);
    });
  }

  update() {
    this.forAllObjects((o) => {
      // Could be replaced with a map.
      const updateFunc = o.data.get("hackable").update;
      const ai = o.data.get("hackable").properties.ai;
      updateFunc(ai);
    });
  }

  exit() {}
}

export { HackableSystem };
