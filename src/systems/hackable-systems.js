import Phaser from "phaser";
import C4C from "c4c-lib";
import System from "./system.js";
import eventsCenter from "../events-center.js";

import { Hackable } from "../components/hackable-components.js";

let isPaused = false;
let isLocked = false;

let pauseTime = 0.0;
let length = 1000.0;
let location = [];
let result = [];

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
          isLocked = true;
        }
      });
    });

    eventsCenter.on("exitHackingMode", (entity, scene) => {
      if (entity.getData("hacked")) {
        entity.setData("ai", C4C.Editor.getText());
        entity.setData("hacked", false);
        isLocked = false;
        location = [];
      }
    });
  }

  update() {
    this.forAllObjects((o) => {
      const time = this.scene.time.now;
      // Could be replaced with a map.
      const ai = o.getData("ai");
      const localEnv = o.getData("namespace");

      if (isPaused) {
        if (!isLocked) {
          checkPause(time);
        } else {
          o.body.setVelocityX(0);
          o.body.setVelocityY(0);
        }
      } else {
        try {
          o.body.setVelocityX(0);
          o.body.setVelocityY(0);

          [result, location] = C4C.Interpreter.stepRunInNamespace(
            localEnv,
            ai,
            location
          );

          pause(time);
        } catch (err) {
          console.log(err);
          alert(err + " Oops.");
          isPaused = true;
          isLocked = true;

          o.body.setVelocityX(0);
          o.body.setVelocityY(0);
        }
      }
    });
  }

  exit() {}
}

export { HackableSystem };
