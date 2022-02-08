import C4C from "c4c-editor-and-interpreter";

function createSpriteFromObject(scene, obj, texture) {
  const sprite = new Phaser.GameObjects.Sprite(scene);
  sprite.setName(obj.name);
  sprite.setDepth(0);
  sprite.setTexture(texture, null);
  sprite.displayWidth = obj.width;
  sprite.displayHeight = obj.height;

  //  Origin is (0, 1) in Tiled, so find the offset that matches the Sprites origin.
  //  Do not offset objects with zero dimensions (e.g. points).
  var offset = {
    x: sprite.originX * obj.width,
    y: (sprite.originY - 1) * obj.height,
  };

  sprite.setPosition(obj.x + offset.x, obj.y + offset.y);

  //  Set properties the class may have, or setData those it doesn't
  if (Array.isArray(obj.properties)) {
    // Tiled objects custom properties format
    obj.properties.forEach(function (propData) {
      var key = propData["name"];
      if (sprite[key] !== undefined) {
        sprite[key] = propData["value"];
      } else {
        sprite.setData(key, propData["value"]);
      }
    });
  } else {
    for (var key in obj.properties) {
      if (sprite[key] !== undefined) {
        sprite[key] = obj.properties[key];
      } else {
        sprite.setData(key, obj.properties[key]);
      }
    }
  }

  return sprite;
}

function defineMovementFunctions(entity) {
  C4C.Interpreter.define("moveLeft", function () {
    entity.body.setVelocityX(-40);
  });

  C4C.Interpreter.define("moveRight", function () {
    entity.body.setVelocityX(40);
  });

  C4C.Interpreter.define("jump", function () {
    if (entity.body.blocked.down) {
      entity.body.setVelocityY(-300);
    }
  });

  C4C.Interpreter.define("isOnGround", function () {
    return entity.body.blocked.down;
  });
}

export { createSpriteFromObject, defineMovementFunctions };
