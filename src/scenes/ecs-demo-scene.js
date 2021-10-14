import Phaser from 'phaser'
import {
    createWorld,
    addEntity,
    addComponent,
} from 'bitecs'

import eventsCenter from '../events-center.js'
import Entity from '../entity.js'

import Position from '../components/position.js'

import createPositionDebugSystem from '../systems/position-debug.js'

export default class ECSDemoScene extends Phaser.Scene
{
    constructor()
    {
	super('ecs-demo')
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
        this.add.image(400, 300, 'sky')

        const particles = this.add.particles('red')

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        })

        const logo = this.physics.add.image(400, 100, 'logo')

        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)

        emitter.startFollow(logo)

        // ECS Additions
        this.world = createWorld()

        const entity = new Entity(this.world, [Position])

        entity.set(Position, "x", 65)
        entity.get(Position, "x")

        // Systems
        this.positionDebugSystem = createPositionDebugSystem()
    }

    update()
    {
        this.positionDebugSystem(this.world)
    }
}
