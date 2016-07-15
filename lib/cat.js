const MovingObject = require("./movingObject");
const Util = require("./util");
const Constants = require("./constants.js");

const Cat = function (options) {
  this.type = "Cat";
  options.pos = Constants.START_POS;
  options.vel = [0, 0];
  options.img = new Image;

  options.img.src = "./img/pusheen_right.png";

  MovingObject.call(this, options);
};

Cat.prototype.trot = function (movement) {
  let x = this.pos[0] + movement[0];
  let y = this.pos[1] + movement[1];
  if (!this.game.isOutOfBounds([x,y])){
    this.pos[0] = x;
    this.pos[1] = y;

    if (movement[0] > 0) {
      this.img.src = "./img/pusheen_right.png";
    } else if (movement[0] < 0) {
      this.img.src = "./img/pusheen_left.png";
    }
  }
};

Cat.prototype.restart = function () {
  this.pos = Constants.START_POS;
};

Util.inherits(Cat, MovingObject);

module.exports = Cat;
