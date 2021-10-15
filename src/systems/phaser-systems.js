import Phaser from 'phaser'
import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery
} from 'bitecs'

import {
    Emitter,
    Sprite,
    Image
} from '../components/phaser-components.js'

function createSpriteSystem(scene, textures) {
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
    const localEntityMap = new Map()

    const getAll = defineQuery([Sprite])
    const getEntered = enterQuery(getAll)
    const getExited = exitQuery(getAll)

    return (world) => {
        const all = getAll(world)
        const entered = getEntered(world)
        const exited = getExited(world)

        entered.forEach((entityID) => {
	    const tid = Sprite.textureID[entityID]
	    const textureName = textures[tid]
            const sprite = scene.physics.add.sprite(0, 0, textureName)

	    localEntityMap.set(entityID, sprite)
            scene.globalEntityMap.set(entityID, sprite)
        })

        all.forEach((entityID) => {
        })

        exited.forEach((entityID) => {
        })

	return world
    }
}

function createImageSystem(scene, textures) {
    const localEntityMap = new Map()

    const getAll = defineQuery([Image])
    const getEntered = enterQuery(getAll)
    const getExited = exitQuery(getAll)

    return (world) => {
        const all = getAll(world)
        const entered = getEntered(world)
        const exited = getExited(world)

        entered.forEach((entityID) => {
	    const tid = Image.textureID[entityID]
	    const textureName = textures[tid]
            const image = scene.physics.add.image(0, 0, textureName)

	    localEntityMap.set(entityID, image)
            scene.globalEntityMap.set(entityID, image)
        })

        all.forEach((entityID) => {
        })

        exited.forEach((entityID) => {
        })

	return world
    }
}

function createEmitterSystem(scene, emitters) {
    const getAll = defineQuery([Emitter])
    const getEntered = enterQuery(getAll)
    const getExited = exitQuery(getAll)

    return (world) => {
        const all = getAll(world)
        const entered = getEntered(world)
        const exited = getExited(world)

        entered.forEach((entityID) => {
	    const eid = Emitter.emitterID[entityID]
	    const emitter = emitters[eid]
            const entityObject = scene.globalEntityMap.get(entityID)
            emitter.startFollow(entityObject)
        })

        all.forEach((entityID) => {
        })

        exited.forEach((entityID) => {
        })

	return world
    }
}

export { createSpriteSystem, createImageSystem, createEmitterSystem }
