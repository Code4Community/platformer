import Phaser from "phaser";
import C4C from "c4c-editor-and-interpreter";
import eventsCenter from "../events-center.js";

function enterButtonHoverState(btn) {
  btn.setStyle({ fill: "#ff0" });
}

function enterButtonRestState(btn) {
  btn.setStyle({ fill: "#fff" });
}

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("ui");
  }

  create() {
    C4C.Editor.Window.init(this);

    // Editor Button
    const editorButton = this.add
      .text(500, 40, "Toggle Editor", { fill: "#fff", fontSize: "30px" })
      .setInteractive()
      .on("pointerdown", () => {
        C4C.Editor.Window.toggle();
      })
      .on("pointerover", () => enterButtonHoverState(editorButton))
      .on("pointerout", () => enterButtonRestState(editorButton));
  }
}
