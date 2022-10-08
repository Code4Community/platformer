import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import System from "./system.js";
import eventsCenter from "../events-center.js";

import { Hackable } from "../components/hackable-components.js";

let hasError = false;

var isPaused = false;
var pauseTime = 0.0;
var length = 1000.0;
var result = [];
var location = [];

function pause(time) {
  isPaused = true;
  pauseTime = time;
}

function checkPause(time) {
  if (time - pauseTime > length) {
    isPaused = false;
  }
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
        entity.setData("hacked", false);
        hasError = false;
        location = [];
      }
    });
  }

  update() {
    this.forAllObjects((o) => {
      // Could be replaced with a map.
      const ai = o.getData("ai");
      const ast = C4C.Interpreter.iRead(ai);
      const localEnv = o.getData("namespace");

      if (!hasError) {
        try {
          const time = this.scene.time.now;

          if (isPaused) {
            checkPause(time);
          } else {
            [result, location] = C4C.Interpreter.stepRunInNamespace(
              localEnv,
              ai,
              location
            );

            pause(time);
          }
        } catch (err) {
          console.log(err);
          alert(err + " Oops.");
          hasError = true;

          o.body.setVelocityX(0);
          o.body.setVelocityY(0);
        }
      }
    });
  }

  exit() {}
}

export { HackableSystem };
