import { defineSystem, defineQuery } from "bitecs";

import Position from "../components/position.js";

export default function createPositionDebugSystem() {
  const positionQuery = defineQuery([Position]);

  return (world) => {
    const entities = positionQuery(world);

    console.log(
      "Number of Entities with the Position Component: " + entities.length
    );

    return world;
  };
}
