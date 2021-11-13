import Phaser from "phaser";
import ECSScene from "../scenes/ecs-scene.js";
import { createWorld, addEntity, addComponent } from "bitecs";

import Entity from "../entity.js";
import { Sprite } from "../components/phaser-components.js";
import { Player } from "../components/player-components.js";
import { SpriteSystem } from "../systems/phaser-systems.js";
import { PlayerSystem } from "../systems/player-systems.js";

import skyImage from "../assets/sky.png";
import groundImage from "../assets/platform.png";
import starImage from "../assets/star.png";
import bombImage from "../assets/bomb.png";
import dudeSpriteSheet from "../assets/dude.png";

export default class TutorialECSScene extends ECSScene {
  playerObject;
  stars;
  platforms;
  cursors;
  score = 0;
  scoreText;
  gameOver;

  constructor() {
    super("tutorial");
  }

  preload() {
    this.load.image("sky", skyImage);
    this.load.image("ground", groundImage);
    this.load.image("star", starImage);
    this.load.image("bomb", bombImage);
    this.load.spritesheet("dude", dudeSpriteSheet, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.spriteSystem = new SpriteSystem(this);
    this.playerSystem = new PlayerSystem(this);

    this.add.image(400, 300, "sky");

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    // player
    const player = new Entity(this, [Sprite, Player]);

    this.spriteSystem.create(["dude"]);
    this.playerSystem.create("dude");

    this.playerObject = this.globalEntityMap.get(player.id);

    // input keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // stars
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // on player picking up star
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.playerObject,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // score
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    // bombs
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.playerObject,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update() {
    this.playerSystem.update(this.cursors);
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        this.playerObject.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(200, 200), 20);
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.playerObject.setTint(0xff0000);
    this.playerObject.anims.play("turn");
    this.gameOver = true;
  }
}
