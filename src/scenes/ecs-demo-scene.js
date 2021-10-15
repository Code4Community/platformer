import Phaser from 'phaser'
import {
    createWorld,
    addEntity,
    addComponent,
} from 'bitecs'

import Entity from '../entity.js'

import {
    Emitter,
    Sprite,
    Image
} from '../components/phaser-components.js'

import {
    createImageSystem,
    createEmitterSystem
} from '../systems/phaser-systems.js'

export default class ECSDemoScene extends Phaser.Scene
{
    globalEntityMap;

    constructor()
    {
	super('ecs-demo')
        this.globalEntityMap = new Map()
    }

    preload()
    {
        this.load.setBaseURL('http://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
    }

    create()
    {
        // The world for all bitECS entities
        this.world = createWorld()

        this.add.image(400, 300, 'sky')


        const particles = this.add.particles('red')

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        })

        // The entity for a bouncing logo
        const logo = new Entity(this.world, [Image, Emitter])

        this.imageSystem = createImageSystem(this, ['logo']);
        this.emitterSystem = createEmitterSystem(this, [emitter]);

        this.imageSystem(this.world)
        this.emitterSystem(this.world)

        // const logoObject = this.physics.add.image(400, 100, 'logo')
        const logoObject = this.globalEntityMap.get(logo.id)

        logoObject.setVelocity(200, 100)
        logoObject.setBounce(1, 1)
        logoObject.setCollideWorldBounds(true)
    }

    update()
    {
    }
}
