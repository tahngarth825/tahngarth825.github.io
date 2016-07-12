var Dog = require("./dog");
var Cat = require("./cat");

var Game = function () {
  this.dogs = [];
  this.cats = [];

  this.addCats();
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_DOGS = 10;

Game.prototype.add = function (object) {
  if (object.type === "Dog") {
    this.dogs.push(object);
  } else if (object.type === "Cat") {
    this.cats.push(object);
  } else {
    //Somethin' dun gone wrong
    throw "wtf?";
  }
};

Game.prototype.addDogs = function () {
  for (var i = 0; i < Game.NUM_DOGS; i++) {
    this.add(new Dog({ game: this }));
  }
};

Game.prototype.addCat = function () {
  var cat = new Cat({
    pos: this.randomPosition(),
    game: this
  });

  this.add(cat);

  return cat;
};

Game.prototype.allObjects = function () {
  return [].concat(this.cats, this.dogs);
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 == obj2) {
        // don't allow self-collision
        return;
      } else if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.remove = function (object) {
  if (object instanceof Dog) {
    const idx = this.dogs.indexOf(object);
    this.dogs[idx] = new Dog({ game: this });
  } else if (object instanceof Cat) {
    this.cats.splice(this.cats.indexOf(object), 1);
  } else {
    //Somethin' dun gone wrong
    throw "wtf?";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.wrap = function (pos) {
  return [
    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
  ];

  function wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Game;
