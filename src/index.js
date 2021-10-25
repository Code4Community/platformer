import Phaser from 'phaser';

import MainMenuScene from './scenes/main-menu-scene.js'
import LevelSelectScene from './scenes/level-select-scene.js'
import TutorialScene from './scenes/tutorial-scene.js'
import TileDemoScene from './scenes/tile-demo-scene.js'
import UIScene from './scenes/ui-scene.js'

import style from './css/style.css'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
	default: 'arcade',
	arcade: {
	    gravity: { y: 300 },
	    debug: false
	}
    },
    scene: [ MainMenuScene,
             LevelSelectScene,
             TutorialScene,
             TileDemoScene,
             UIScene ]
};

export default new Phaser.Game(config);
