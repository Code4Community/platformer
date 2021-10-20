import Phaser from 'phaser'
import System from './system.js'

import {
    Player
} from '../components/player-components.js'

class PlayerSystem extends System {
    constructor(scene)
    {
        super(scene, [Player])
    }

    create(spriteSheetName)
    {
        // Register animations with the scene's animation manager
        this.scene.anims.create({
	    key: 'left',
	    frames: this.scene.anims.generateFrameNumbers(spriteSheetName, { start: 0, end: 3 }),
	    frameRate: 10,
	    repeat: 1
	});

	this.scene.anims.create({
	    key: 'turn',
	    frames: [ { key: spriteSheetName, frame: 4 } ],
	    frameRate: 20
	});

	this.scene.anims.create({
	    key: 'right',
	    frames: this.scene.anims.generateFrameNumbers(spriteSheetName, { start: 5, end: 8 }),
	    frameRate: 10,
	    repeat: 1
	});

        const entered = this.getEntered(this.world);

        entered.forEach((entityID) => {
            const player = this.scene.globalEntityMap.get(entityID);

            player.setBounce(0.2);
	    player.setCollideWorldBounds(true);
	    player.body.setGravityY(300);

            this.scene.physics.add.collider(player, this.scene.platforms);
        });
    }

    update(cursors)
    {
        const all = this.getAll(this.world)

        all.forEach((entityID) => {
            const player = this.scene.globalEntityMap.get(entityID)

            if (cursors.left.isDown) {
	        player.setVelocityX(-160);
	        player.anims.play('left', true);
	    } else if (cursors.right.isDown) {
	        player.setVelocityX(160);
	        player.anims.play('right', true);
	    } else {
	        player.setVelocityX(0);
	        player.anims.play('turn');
	    }

	    if (cursors.up.isDown && player.body.touching.down) {
	        player.setVelocityY(-600);
	    }
        })
    }

    exit()
    {
    }
}

export { PlayerSystem }
