const Util = require("./util");
const MovingObject = require("./movingObject");
const Cat = require("./cat");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
	SPEED: 4
};

const Dog = function (options = {}) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};


Dog.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Cat") {
		//TODO SET UP GAME-OVER SCREEN
    otherObject.restart();
  }
};

Util.inherits(Dog, MovingObject);

Dog.prototype.type = "Dog";

module.exports = Dog;
