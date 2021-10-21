import Phaser from 'phaser'
import ECSScene from './ecs-scene.js'
import eventsCenter from '../events-center.js'
import Entity from '../entity.js'

import skyImage from '../assets/sky.png';
import groundImage from '../assets/platform.png';
import starImage from '../assets/star.png';
import bombImage from '../assets/bomb.png';
import dudeSpriteSheet from '../assets/dude.png';

import { Enemy } from '../components/enemy-components.js'
import { Player } from '../components/player-components.js'
import { Sprite } from '../components/phaser-components.js'
import { Hackable } from '../components/hackable-components.js'
import { EnemySystem } from '../systems/enemy-systems.js'
import { PlayerSystem } from '../systems/player-systems.js'
import { SpriteSystem } from '../systems/phaser-systems.js'
import { HackableSystem } from '../systems/hackable-systems.js'

export default class HackingScene extends ECSScene
{
    player;
    platforms;
    cursors;
    hackableGuy;

    constructor()
    {
	super('hacking')
    }

    preload()
    {
	this.load.image('sky', skyImage);
	this.load.image('ground', groundImage);
	this.load.image('star', starImage);
	this.load.image('bomb', bombImage);
	this.load.spritesheet('dude', dudeSpriteSheet,
			      { frameWidth: 32, frameHeight: 48 }
			     );
    }

    create()
    {
	this.add.image(400, 300, 'sky');

	this.platforms = this.physics.add.staticGroup();
	this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	this.platforms.create(600, 400, 'ground');
	this.platforms.create(50, 250, 'ground');
	this.platforms.create(750, 220, 'ground');

	// entities
        const player = new Entity(this.world, [Sprite, Player]);
        const hackableEntity = new Entity(this.world, [Sprite, Enemy, Hackable]);

        // systems
        this.enemySystem = new EnemySystem(this);
        this.playerSystem = new PlayerSystem(this);
        this.spriteSystem = new SpriteSystem(this);
        this.hackableSystem = new HackableSystem(this);

        this.spriteSystem.create(['dude'])
        this.playerSystem.create('dude')
        this.enemySystem.create()
        this.hackableSystem.create()

	// hackable guy
	this.hackableGuy = this.globalEntityMap.get(hackableEntity.id);
	this.cursors = this.input.keyboard.createCursorKeys();
        this.scene.run('ui-scene')
    }

    update()
    {
        this.playerSystem.update(this.cursors);
        this.hackableSystem.update();
    }
}
