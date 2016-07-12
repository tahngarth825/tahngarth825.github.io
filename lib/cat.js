const Cat = require("./cat");
const MovingObject = require("./movingObject");
const Util = require("./util");

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

Cat.prototype.move = function (movement) {
  this.vel[0] += movement[0];
  this.vel[1] += movement[1];
};

const Cat = function (options) {
  options.radius = Cat.RADIUS;
  options.vel = [0, 0];
  options.color = options.color || randomColor();

  MovingObject.call(this, options);
};

Cat.prototype.type = "Cat";

Cat.RADIUS = 15;

Util.inherits(Cat, MovingObject);

Cat.prototype.restart = function () {
  this.pos = [0, 0];
};

module.exports = Cat;
