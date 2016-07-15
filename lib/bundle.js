/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(7);
	const Constants = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function(){
	  let canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Constants.DIM_X;
	  canvasEl.height = Constants.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Car = __webpack_require__(2);
	const Cat = __webpack_require__(5);
	const Board = __webpack_require__(8);
	const Constants = __webpack_require__(6);
	
	const Game = function () {
	  this.cars = [];
	  this.cats = [];
	  this.level = 1;
	  this.gridSize = [11, 11];
	  this.squareSize = 50; //In grid, size of square
	  this.board = new Board(this);
	  // this.addCars();
	};
	
	Game.prototype.nextLevel = function () {
	  //TODO (also do win screen)
	};
	
	Game.prototype.gameOver = function () {
	  alert("Game Over");
	   // TODO Show game over screen and offer start new game
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
	  for (let i = this.cars.length; i < Constants.NUM_CARS; i++) {
	    this.add(new Car({ game: this, carType: undefined }));
	  }
	};
	
	Game.prototype.addCat = function () {
	  const cat = new Cat({
	    game: this
	  });
	debugger
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
	  return (pos[0] < 0) || (pos[1] < 0) ||
	    (pos[0] >= Constants.DIM_X) || (pos[1] >= Constants.DIM_Y);
	};
	
	Game.prototype.moveCars = function (delta) {
	  this.cars.forEach(function (car) {
	    car.move(delta);
	  });
	};
	
	Game.prototype.remove = function (object) {
	  if (object instanceof Car) {
	    const idx = this.cars.indexOf(object);
	    this.cars[idx] = new Car({ game: this });
	  } else if (object instanceof Cat) {
	    this.cats.splice(this.cats.indexOf(object), 1);
	  } else {
	    //Somethin' dun gone wrong
	    throw "Invalid object type";
	  }
	};
	
	Game.prototype.step = function (delta) {
	  this.moveCars(delta);
	  this.checkCollisions();
	  // this.addCars();
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Cat = __webpack_require__(5);
	const Constants = __webpack_require__(6);
	
	const DIRECTIONS = [
		"LEFT",
		"RIGHT"
	];
	
	//Game has 11 rows; first is start, last is checkpoint/home
	//left number is left edge, right number is right edge
	//could be refactored to sync with game
	const LEFT = 0; //Could be buffered to center
	const RIGHT = 550;
	const TOP = 0;
	const BOTTOM = 750;
	
	function randomPosition(direction, level){
		const row = random(Constants.ROWS[level]);
		let x,y;
	
		if (direction[0] < 0) {
			x = RIGHT;
		} else {
			x = LEFT;
		}
	
		y = BOTTOM - 50*(row+1); //offset because first row is safe
		return [x,y];
	}
	
	//Gives random element/value of object or array
	function random(input){
		if (Array.isArray(input)){
			return (input[Math.floor(Math.random()*input.length)]);
		} else {
			return (input[random(Object.keys(input))]);
		}
	}
	
	const Car = function (options = {}) {
		this.type = "Car";
		this.carType = options.carType ? options.carType : random(Constants.TYPES);
		options.vel = [this.carType.SPEED, 0];
		options.img = new Image();
		if (random(DIRECTIONS) === "LEFT"){
			options.vel = [options.vel[0]*-1, options.vel[1]*-1];
			options.img.src = this.carType.LEFT_IMG;
		} else {
			options.img.src = this.carType.RIGHT_IMG;
		}
	
		options.pos = randomPosition(options.vel, options.game.level);
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Car, MovingObject);
	
	module.exports = Car;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    const norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a vector pointing left/right with the given length.
	  randomVec: function (length) {
	    const deg = Math.PI * (Math.floor(Math.random()*2));
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  //assumes objects are 50x50. Collide if x within 50, same y
	  checkCollide(pos1, pos2){
	    if (Math.abs(pos1[0] - pos2[0]) < 50 &&
	      pos1[1] === pos2[1]){
	
	      return true;
	    } else {
	      return false;
	    }
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
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
	    this.remove();
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(3);
	const Constants = __webpack_require__(6);
	
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  BACKGROUND: "#000000",
	  DIM_X: 550,
	  DIM_Y: 750,
	  FPS: 32,
	  NUM_CARS: 10,
	  //placed here so a car type can be made based on level
	  TYPES: {
	    CAR: {
	      LEFT_IMG: "./img/car_left.png",
	      RIGHT_IMG: "./img/car_right.png",
	      SPEED: 1
	    },
	    FAST_CAR: {
	      LEFT_IMG: "./img/car_fast_left.png",
	      RIGHT_IMG: "./img/car_fast_right.png",
	      SPEED: 2
	    },
	    SUPER_FAST_CAR: {
	      LEFT_IMG: "./img/car_superfast_left.png",
	      RIGHT_IMG: "./img/car_superfast_right.png",
	      SPEED: 3
	    }
	  },
	
	  //STREET rows
	  ROWS: {
	    1: [1,3,5,7,9],
	    2: [1,2,4,5,7,8,9],
	    3: [1,2,3,4,5,6,7,8,9]
	  },
	
	  START_POS: [250,700]
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Cat = __webpack_require__(5);
	
	const GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.cat = this.game.addCat();
	};
	
	GameView.MOVES = {
	  "w": [ 0, -50],
	  "a": [-50,  0],
	  "s": [ 0,  50],
	  "d": [ 50,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  const cat = this.cat;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    const move = GameView.MOVES[k];
	    key(k, function () { cat.trot(move); }); //keymaster
	  });
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	
	  //TODO SET UP RESTART LOGIC HERE; possibly setup a callback for winning
	};
	
	GameView.prototype.animate = function(time){
	  const timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(6);
	
	const Board = function (game) {
	  this.game = game;
	};
	
	Board.STREET = new Image();
	Board.STREET.src = "./img/grass.jpg";
	
	Board.GRASS = new Image();
	Board.GRASS.src = "./img/road.jpg";
	
	Board.prototype.draw = function (ctx) {
	  const rows = this.game.gridSize[1];
	  const cols = this.game.gridSize[0];
	
	  for (let i = 0; i < rows; i++) {
	    if (Constants.ROWS[this.game.level].indexOf(i) !== -1) {
	      paintRow(ctx,Board.GRASS, cols, i);
	    } else {
	      paintRow(ctx,Board.STREET, cols, i);
	    }
	  }
	};
	
	function paintRow(ctx,img, cols, row){
	  for (let i = 0; i < cols; i++) {
	    ctx.drawImage(img, i*50, Constants.DIM_Y - ((row+1)*50));
	  }
	}
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map