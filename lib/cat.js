const MovingObject = require("./movingObject");
const Util = require("./util");
const Constants = require("./constants.js");

const Cat = function (options) {
  this.type = "Cat";
  this.game = options.game;
  options.vel = [0, 0];
  options.img = new Image;

  let START = [];
  START.push(Constants.START_POS[0]);
  START.push(Constants.START_POS[1]);
  options.pos = START;

  options.img.src = "./img/pusheen_right.png";

  //functions defined here since it's wiped as a prototype
  this.trot = function (movement) {
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

  this.restart = function () {
    let START2 = [];
    START2.push(Constants.START_POS[0]);
    START2.push(Constants.START_POS[1]);

    this.pos = START2;
  };

  MovingObject.call(this, options);
};

Util.inherits(Cat, MovingObject);

module.exports = Cat;
