import Phaser from 'phaser'
import System from './system.js'

import {
    Star
} from '../components/star-components.js'

class StarSystem extends System {
    constructor(scene)
    {
        super(scene, [Star])
    }

    create()
    {
        const newStars = this.getEntered(this.world);

        newStars.forEach((starID) => {
            const star = this.scene.globalEntityMap.get(starID);
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            this.scene.physics.add.collider(star, this.scene.platforms);
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
