import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";

import { Hackable } from "../components/hackable-components.js";

function toggleHacking() {
  let entity = this;
  let entityData = entity.data.values;
  let mutableData = entityData.mutableData;

  if (entityData.hacked) {
    stopHacking(mutableData);
    entityData.hacked = false;
  } else {
    startHacking(mutableData);
    entityData.hacked = true;
  }
}

function startHacking(mutableData) {
  C4C.Editor.Window.open();

  if ("ai" in mutableData) {
    const ai = mutableData.ai;
    C4C.Editor.setText(ai);
  }

  // eventsCenter.emit('start-hacking')

  // Pause the game
}

function stopHacking(mutableData) {
  const ai = C4C.Editor.getText();
  C4C.Editor.Window.close();

  mutableData.ai = ai;

  // eventsCenter.emit('stop-hacking')

  // Un-pause the game
}

class HackableSystem extends System {
  constructor(scene) {
    super(scene, [Hackable]);
  }

  create() {
    this.forEnteredObjects((o) => {
      o.setInteractive();
      o.on("pointerdown", toggleHacking);

      o.setDataEnabled();
      o.data.set("hacked", false);
      o.data.set("mutableData", {
        ai: `
o.setVelocityX(0);
if (o.body.blocked.down) {
    o.setVelocityY(-150);
}
`,
      });
    });
  }

  update() {
    this.forAllObjects((o) => {
      if ("ai" in o.data.values.mutableData) {
        const ai = o.data.values.mutableData.ai;
        // This is just evaluating raw javascript for testing.  The
        // javascript is evaluated inside the environment at this
        // point. Its just like having the code written here.
        eval(ai);
      }
    });
  }

  exit() {}
}

export { HackableSystem };
