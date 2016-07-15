const Util = require("./util");
const Constants = require("./constants.js");

const MovingObject = function (options) {
  this.pos = options.pos; //top-left corner of object
  this.vel = options.vel; //pusheen has instantaneous velocity
  this.img = options.img;
  this.game = options.game;
};

//draws objects of size 50x50
MovingObject.prototype.draw = function (ctx) {
  ctx.drawImage(this.img, this.pos[0], this.pos[1], 50, 50);
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  if (Util.checkCollide(this.pos, otherObject.pos)){
    return true;
  } else {
    return false;
  }
};

const NORMAL_FRAME_TIME_DELTA = 1000/60;

MovingObject.prototype.move = function (timeDelta) {
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  //this is overriden for the Cat so that it is not removed
  //checks both top-left and bottom-right corner are off-screen
  if (this.game.isOutOfBounds(this.pos) &&
  this.game.isOutOfBounds([this.pos[0]+50, this.pos[1]+50])) {
    this.remove(this);
  }
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
