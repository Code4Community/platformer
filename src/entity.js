import {
    addEntity,
    addComponent,
} from 'bitecs'

export default class Entity {
    id;

    constructor(world, components)
    {
        this.id = addEntity(world)

        components.forEach((c) => {
            addComponent(world, c, this.id)
        })
    }

    getID()
    {
        return this.id
    }

    get(component, key)
    {
        return component[key][this.eid]
    }

    set(component, key, value)
    {
        component[key][this.eid] = value
        return value
    }
}
