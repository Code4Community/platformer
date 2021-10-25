import Phaser from 'phaser'

import skyImage from '../assets/sky.png';
import groundImage from '../assets/platform.png';
import starImage from '../assets/star.png';
import bombImage from '../assets/bomb.png';
import dudeSpriteSheet from '../assets/dude.png';

export default class TutorialScene extends Phaser.Scene
{
    player;
    stars;
    platforms;
    cursors;
    score = 0;
    scoreText;
    debugText;
    gameOver;

    constructor()
    {
	super('tutorial')
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

	// input keys
	this.cursors = this.input.keyboard.createCursorKeys();

	// stars
	this.stars = this.physics.add.group({
	    key: 'star',
	    repeat: 11,
	    setXY: { x: 12, y: 0, stepX: 70 }
	});

	this.stars.children.iterate(function (child) {
	    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});

	// on player picking up star
	this.physics.add.collider(this.stars, this.platforms);
	this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

	// score
	this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	this.debugText = this.add.text(16, 48, 'test', { fontSize: '32px', fill: '#000' });

	// bombs
	this.bombs = this.physics.add.group();
	this.physics.add.collider(this.bombs, this.platforms);
	this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        // ui
        this.scene.launch('ui');
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

	this.debugText.setText('down: ' + this.player.body.touching.down);

	if (this.cursors.up.isDown && this.player.body.touching.down) {
	    this.player.setVelocityY(-600);
	}
    }

    collectStar (player, star)
    {
	star.disableBody(true, true);

	this.score += 10;
	this.scoreText.setText('Score: ' + this.score);

	if (this.stars.countActive(true) === 0) {
	    this.stars.children.iterate(function (child) {
		child.enableBody(true, child.x, 0, true, true);
	    });

	    var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

	    var bomb = this.bombs.create(x, 16, 'bomb');
	    bomb.setBounce(1);
	    bomb.setCollideWorldBounds(true);
	    bomb.setVelocity(Phaser.Math.Between(200, 200), 20);
	}
    }

    hitBomb (player, bomb)
    {
	this.physics.pause();
	this.player.setTint(0xff0000);
	this.player.anims.play('turn');
	this.gameOver = true;
    }
}


