import { defineComponent, Types } from 'bitecs'

const Vector2 = defineComponent({
    x: Types.f32,
    y: Types.f32
})

const Position = defineComponent(Vector2)
const Velocity = defineComponent(Vector2)
const Rotation = defineComponent({
    angle: Types.f32
})

const Emitter = defineComponent({
    emitterID: Types.ui8
})

const Sprite = defineComponent({
    textureID: Types.ui8
})

const Image = defineComponent({
    textureID: Types.ui8
})

export {
    Position,
    Velocity,
    Rotation,
    Emitter,
    Sprite,
    Image
}
