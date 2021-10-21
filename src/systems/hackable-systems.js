import Phaser from 'phaser';
import System from './system.js';

import { setEditorText, getEditorText, clearEditor } from '../editor.js'

import { Hackable } from '../components/hackable-components.js'

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
    if ("ai" in mutableData) {
        const ai = mutableData.ai;
        setEditorText(ai);
    }

    // eventsCenter.emit('start-hacking')

    // Pause the game
}

function stopHacking(mutableData) {
    const ai = getEditorText();
    clearEditor();

    mutableData.ai = ai;

    // eventsCenter.emit('stop-hacking')

    // Un-pause the game
}

class HackableSystem extends System {
    constructor(scene)
    {
        super(scene, [Hackable])
    }

    create()
    {
        const entered = this.getEntered(this.world)

        entered.forEach((entityID) => {
            const hackableObject = this.scene.globalEntityMap.get(entityID);

            hackableObject.setInteractive();
            hackableObject.on('pointerdown', toggleHacking);

            hackableObject.setDataEnabled();
            hackableObject.data.set('hacked', false);
            hackableObject.data.set('mutableData', { ai: `
this.hackableGuy.setVelocityX(-160);
if (this.hackableGuy.body.touching.down) {
    this.hackableGuy.setVelocityY(-400);
}
` });
        })
    }

    update()
    {
    }

    exit()
    {
    }
}

export { HackableSystem }
