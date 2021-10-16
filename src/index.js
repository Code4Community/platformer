import Phaser from 'phaser';

import TutorialScene from './scenes/tutorial-scene.js'
import ECSDemoScene from './scenes/ecs-demo-scene.js'
import HelloWorldScene from './scenes/hello-world-scene.js'
import UIScene from './scenes/ui-scene.js'

import style from './css/style.css'

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
    scene: [ ECSDemoScene,
             UIScene ]
};

export default new Phaser.Game(config);
