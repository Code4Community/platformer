import { defineComponent, Types } from "bitecs";

const Vector2 = {
  x: Types.f32,
  y: Types.f32,
};

const Position = defineComponent(Vector2);
const Velocity = defineComponent(Vector2);
const Rotation = defineComponent({
  angle: Types.f32,
});

const Emitter = defineComponent({
  emitterID: Types.ui8,
});

const Sprite = defineComponent({
  // A 16 character string.
  sheetKey: [Types.ui8, 16],
});

const Image = defineComponent({
  imageKey: [Types.ui8, 16],
});

export { Position, Velocity, Rotation, Emitter, Sprite, Image };
