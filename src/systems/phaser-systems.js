import Phaser from 'phaser'
import System from './system.js'

import {
    Emitter,
    Sprite,
    Image
} from '../components/phaser-components.js'

class SpriteSystem extends System {
    constructor(scene)
    {
        super(scene, [Sprite])

        // There are two things at play here: Phaser GameObjects and bitECS
        // entities. The bitECS entities are just numbers. In order to have access
        // to all the complex data available from the Phaser side, we need to
        // associate those numbers (IDs) with Phaser Gameobjects. Then whenever this
        // system needs to read an entities X position or something, it can just
        // lookup the Phaser GameObject in this map and poke around.

        // This can't be used to access an entity's corresponding gameobject outside
        // of this system. To do that, we need another map local to the scene. When
        // an entity enters, that map is also updated. This sort of makes the
        // assumption that an entity is associated with only one game object, which
        // I think is a safe assumption. Hopefully I'm not wrong about that.
        this.localSpriteMap = new Map();
    }

    create(textures)
    {
        const entered = this.getEntered(this.world)

        entered.forEach((entityID) => {
	    const tid = Sprite.textureID[entityID]
	    const textureName = textures[tid]
            const sprite = scene.physics.add.sprite(0, 0, textureName)

	    this.localSpriteMap.set(entityID, sprite)
            this.scene.globalEntityMap.set(entityID, sprite)
        })
    }

    update()
    {
    }

    exit()
    {
    }
}

class ImageSystem extends System {
    constructor(scene)
    {
        super(scene, [Image])
        this.localImageMap = new Map();
    }

    create(textures)
    {
        const entered = this.getEntered(this.world)

        entered.forEach((entityID) => {
	    const tid = Image.textureID[entityID]
	    const textureName = textures[tid]
            const image = this.scene.physics.add.image(0, 0, textureName)

	    this.localImageMap.set(entityID, image)
            this.scene.globalEntityMap.set(entityID, image)
        })
    }

    update()
    {
    }

    exit()
    {
    }
}

class EmitterSystem extends System {
    constructor(scene)
    {
        super(scene, [Emitter])
    }

    create(emitters)
    {
        const entered = this.getEntered(this.world)

        entered.forEach((entityID) => {
	    const eid = Emitter.emitterID[entityID]
	    const emitter = emitters[eid]
            const entityObject = this.scene.globalEntityMap.get(entityID)
            emitter.startFollow(entityObject)
        })
    }

    update(world)
    {
    }

    exit(world)
    {
    }
}

export { SpriteSystem, ImageSystem, EmitterSystem }
