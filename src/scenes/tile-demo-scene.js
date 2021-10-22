import Phaser from 'phaser'

import marioTiles from '../assets/mario-tiles.png';
import superMarioMap from '../assets/super-mario-map.json';

export default class TileDemoScene extends Phaser.Scene
{
    constructor()
    {
	super('tile-demo')
    }

    preload()
    {
        this.load.image('mario-tiles', marioTiles);
        this.load.tilemapTiledJSON('map', superMarioMap);
    }

    create()
    {
        // Not sure how best to do this...
        this.physics.world.setBounds(0, 0, 3392, 240);

        var map = this.make.tilemap({ key: 'map' });
        // The following two strings are keys inside the json.
        var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
        var layer = map.createLayer('World1', tileset, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);

        this.cameras.main.setZoom(4);
    }

    update()
    {
        this.ship.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.ship.setAngle(-90).setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setAngle(90).setVelocityX(200);
        }

        if (this.cursors.up.isDown)
        {
            this.ship.setVelocityY(-200);
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.setVelocityY(200);
        }
    }
}
