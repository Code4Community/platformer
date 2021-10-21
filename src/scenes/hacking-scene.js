import Phaser from 'phaser'
import ECSScene from './ecs-scene.js'
import eventsCenter from '../events-center.js'
import Entity from '../entity.js'

import skyImage from '../assets/sky.png';
import groundImage from '../assets/platform.png';
import starImage from '../assets/star.png';
import bombImage from '../assets/bomb.png';
import dudeSpriteSheet from '../assets/dude.png';

import {
    Sprite
} from '../components/phaser-components.js'

import {
    Enemy
} from '../components/enemy-components.js'

import {
    Hackable
} from '../components/hackable-components.js'

import { SpriteSystem } from '../systems/phaser-systems.js'
import { EnemySystem } from '../systems/enemy-systems.js'
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

	// player
	this.player = this.physics.add.sprite(100, 450, 'dude');
	this.player.setBounce(0.2);
	this.player.setCollideWorldBounds(true);
	this.player.body.setGravityY(300);

	this.anims.create({
	    key: 'left',
	    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
	    frameRate: 10,
	    repeat: 1
	});

	this.anims.create({
	    key: 'turn',
	    frames: [ { key: 'dude', frame: 4 } ],
	    frameRate: 20
	});

	this.anims.create({
	    key: 'right',
	    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
	    frameRate: 10,
	    repeat: 1
	});

	// platform collisions
	this.physics.add.collider(this.player, this.platforms);

        this.hackableEntity = new Entity(this.world, [Sprite, Enemy, Hackable]);

        this.spriteSystem = new SpriteSystem(this);
        this.enemySystem = new EnemySystem(this);
        this.hackableSystem = new HackableSystem(this);

        this.spriteSystem.create(['dude'])
        this.enemySystem.create()
        this.hackableSystem.create()

	// hackable guy
	this.hackableGuy = this.globalEntityMap.get(this.hackableEntity.id);

	// input keys
	this.cursors = this.input.keyboard.createCursorKeys();

        // run ui-scene parallel to this one
        this.scene.run('ui-scene')
    }

    update()
    {
	if (this.cursors.left.isDown) {
	    this.player.setVelocityX(-160);
	    this.player.anims.play('left', true);
	} else if (this.cursors.right.isDown) {
	    this.player.setVelocityX(160);
	    this.player.anims.play('right', true);
	} else {
	    this.player.setVelocityX(0);
	    this.player.anims.play('turn');
	}

	if (this.cursors.up.isDown && this.player.body.touching.down) {
	    this.player.setVelocityY(-600);
	}

        // if the guy's ai says "run"
        // run to the left

        // Language.eval
        if ("ai" in this.hackableGuy.data.values.mutableData) {
            const ai = this.hackableGuy.data.values.mutableData.ai;
            // This is just evaluating raw javascript for testing.  The
            // javascript is evaluated inside the environment at this
            // point. Its just like having the code written here.
            eval(ai);
        }
    }
}
