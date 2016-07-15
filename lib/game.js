const Car = require("./car");
const Cat = require("./cat");
const Board = require("./board.js");
const Constants = require("./constants.js");

const Game = function () {
  this.cars = [];
  this.cat = new Cat({game: this});
  this.level = 1;
  this.gridSize = [11, 11];
  this.squareSize = 50; //In grid, size of square
  this.board = new Board(this);
  this.addCars();
};

Game.prototype.addCars = function () {
  for (let i = this.cars.length; i < Constants.NUM_CARS*this.level; i++) {
    this.cars.push(new Car({ game: this, carType: undefined }));
  }
};

Game.prototype.resetCars = function () {
  this.cars = [];
  this.addCars();
};

Game.prototype.allObjects = function () {
  if (this.cat !== undefined){
    return [this.cat].concat(this.cars);
  } else {
    return this.cars;
  }
};

Game.prototype.checkCollisions = function (callback) {
  const game = this;

  game.cars.forEach(function (car) {
    if (car.isCollidedWith(game.cat)){
      callback();
    }
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Constants.DIM_X, Constants.DIM_Y);
  ctx.fillStyle = Constants.BACKGROUND;
  ctx.fillRect(0, 0, Constants.DIM_X, Constants.DIM_Y);

  this.board.draw(ctx);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

//pos is top-left corner of object, so cannot be on bottom-right of game
Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < Constants.BOARD_LIMIT) ||
    (pos[0] >= Constants.DIM_X) || (pos[1] >= Constants.DIM_Y);
};

Game.prototype.moveCars = function (delta) {
  this.cars.forEach(function (car) {
    car.move(delta);
  });
};

Game.prototype.remove = function (object) {
  if (object.type === "Car") {
    const idx = this.cars.indexOf(object);
    this.cars[idx] = new Car({ game: this, carType: undefined });
  } else if (object.type === "Cat") {
    alert("Cat died!");
    this.cat = undefined;
  } else {
    throw "Invalid object type";
  }
};

Game.prototype.step = function (delta, callback) {
  this.moveCars(delta);
  this.checkCollisions(callback);
};

module.exports = Game;
