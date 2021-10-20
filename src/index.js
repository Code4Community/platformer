import Phaser from 'phaser';

import ECSDemoScene from './scenes/ecs-demo-scene.js'
import HelloWorldScene from './scenes/hello-world-scene.js'
import HackingScene from './scenes/hacking-scene.js'
import UIScene from './scenes/ui-scene.js'

import style from './css/style.css'
import './editor.js'

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
    scene: [ HackingScene,
             UIScene ]
};

export default new Phaser.Game(config);
