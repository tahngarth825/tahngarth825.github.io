const Car = require("./car");
const Cat = require("./cat");
const Board = require("./board.js");
const Constants = require("./constants.js");

const Game = function () {
  this.cars = [];
  this.cats = [];
  this.level = 1;
  this.gridSize = [11, 11];
  this.squareSize = 50; //In grid, size of square
  this.board = new Board(this);
  this.addCars();
};

Game.prototype.revivePusheen = function (){
  if (this.cats.length === 0) {
    this.addCat();
  }
};

Game.prototype.gameOver = function () {
  alert("Pusheen got run over! :( Game will reset.")
  this.level = 1;
};

Game.prototype.checkWin = function () {
  if (this.cats[0].pos[0] === Constants.REWARD_POS[0] &&
  this.cats[0].pos[1] === Constants.REWARD_POS[1]){
    if (this.level < Constants.MAX_LVL){
      this.renderReward();
    } else {
      this.triggerWin();
    }
  }
};

Game.prototype.renderReward = function () {
  alert(`Pusheen has found ${Constants.REWARD[this.level-1]}! Nom nom nom!`);
  this.remove(this.cats[0]);
  this.level += 1;
};

Game.prototype.triggerWin = function () {
  alert("Pusheen has arrived home to his mother! Yay!");
};

Game.prototype.add = function (object) {
  if (object.type === "Car") {
    this.cars.push(object);
  } else if (object.type === "Cat") {
    this.cats.push(object);
  } else {
    throw "Invalid object type";
  }
};

Game.prototype.addCars = function () {
  for (let i = this.cars.length; i < Constants.NUM_CARS*this.level; i++) {
    this.add(new Car({ game: this, carType: undefined }));
  }
};

Game.prototype.addCat = function () {
  const cat = new Cat({
    game: this
  });
  this.add(cat);

  return cat;
};

Game.prototype.allObjects = function () {
  return [].concat(this.cats, this.cars);
};

Game.prototype.checkCollisions = function () {
  const game = this;

  this.cats.forEach(function (cat) {
    game.cars.forEach(function (car) {
      if (car.isCollidedWith(cat)){
        game.gameOver();
      }
    });
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
    this.cars[idx] = new Car({ game: this });
  } else if (object.type === "Cat") {
    this.cats.splice(this.cats.indexOf(object), 1);
  } else {
    //Somethin' dun gone wrong
    throw "Invalid object type";
  }
};

Game.prototype.step = function (delta) {
  this.revivePusheen();
  this.checkWin();
  this.moveCars(delta);
  this.checkCollisions();
};

module.exports = Game;
