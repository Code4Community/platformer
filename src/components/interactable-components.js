import { defineComponent, Types } from "bitecs";

const Door = defineComponent({
  doorID: Types.ui8,
});

const Button = defineComponent();

export { Door, Button };
