import Phaser from 'phaser';

import ECSDemoScene from './scenes/ecs-demo-scene.js'
import TutorialECSScene from './scenes/tutorial-ecs-scene.js'

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
    scene: [ TutorialECSScene ]
};

export default new Phaser.Game(config);
