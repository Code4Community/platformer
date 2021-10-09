import Phaser from 'phaser';

import TutorialScene from './scenes/tutorial-scene.js'
import HelloWorldScene from './scenes/hello-world-scene.js'
import UIScene from './scenes/ui-scene.js'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
	default: 'arcade',
	arcade: {
	    gravity: { y: 300 },
	    debug: false
	}
    },
    scene: [ HelloWorldScene,
             UIScene ]
};

export default new Phaser.Game(config);
