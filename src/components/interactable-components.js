import { defineComponent, Types } from "bitecs";

const Door = defineComponent({
  doorID: Types.ui8,
});

const Button = defineComponent();

const Flag = defineComponent();

const Platform = defineComponent();

export { Flag, Door, Button, Platform };
