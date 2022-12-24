import Phaser from "phaser";
import C4C from "c4c-lib";
import eventsCenter from "../events-center.js";

function enterButtonHoverState(btn) {
  btn.setStyle({ fill: "#ff0" });
}

function enterButtonRestState(btn) {
  btn.setStyle({ fill: "#fff" });
}

var previousPosition = { x: 0, y: 0 };
var previousTarget = null;

function enableHackingUI(entity, mainScene, uiScene, button) {
  // Focus camera on entity.
  const cam = mainScene.cameras.main;
  previousPosition.x = cam.centerX + cam.scrollX;
  previousPosition.y = cam.centerY + cam.scrollY;
  previousTarget = cam._follow;

  cam.stopFollow();
  cam.pan(entity.x - 13, entity.y, 1000, "Power2");
  cam.zoomTo(12, 1000);

  // Handle Editor
  const ai = entity.getData("ai");
  C4C.Editor.setText(ai);

  mainScene.input.keyboard.disableGlobalCapture();
  C4C.Editor.Window.open();

  // Handle Button
  const inTween = uiScene.tweens.add({
    targets: button,
    x: {
      from: 800,
      to: 500,
    },
    delay: 0,
    duration: 500,
  });
}

function disableHackingUI(entity, mainScene, uiScene, button) {
  // Return camera to original state.
  const cam = mainScene.cameras.main;
  cam.zoomTo(2.5, 1000);
  cam.pan(
    previousPosition.x,
    previousPosition.y,
    1000,
    "Power2",
    false,
    (cam, status) => {
      if (status == 1.0) {
        cam.startFollow(previousTarget, false, 0.1, 0.1);
      }
    }
  );

  // Handle Editor
  mainScene.input.keyboard.enableGlobalCapture();
  C4C.Editor.Window.close();

  // Handle Button
  const outTween = uiScene.tweens.add({
    targets: button,
    x: {
      from: 500,
      to: 800,
    },
    delay: 0,
    duration: 500,
  });
}

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("ui");
  }

  create() {
    this.scene.bringToTop();

    C4C.Editor.Window.init(this);

    const saveButton = this.add
      .text(800, 40, "Save Changes", { fill: "#fff", fontSize: "30px" })
      .setInteractive()
      .on("pointerover", () => enterButtonHoverState(saveButton))
      .on("pointerout", () => enterButtonRestState(saveButton));

    eventsCenter.on("enterHackingMode", (entity, scene) => {
      enableHackingUI(entity, scene, this, saveButton);

      // Handle Button
      saveButton.on("pointerdown", () => {
        disableHackingUI(entity, scene, this, saveButton);
        eventsCenter.emit("exitHackingMode", entity, scene);
      });
    });
  }
}
