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
	const GameView = __webpack_require__(8);
	const Constants = __webpack_require__(5);
	
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
	const Cat = __webpack_require__(6);
	const Board = __webpack_require__(7);
	const Constants = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Cat = __webpack_require__(6);
	const Constants = __webpack_require__(5);
	
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
	const Constants = __webpack_require__(5);
	
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
	  BACKGROUND: "#000000",
	  DIM_X: 550,
	  DIM_Y: 750,
	  FPS: 32,
	  NUM_CARS: 10,
	  MAX_LVL: 3,
	
	  //leave space for header
	  BOARD_LIMIT: 200,
	
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
	
	  START_POS: [250,700],
	  REWARD_POS: [250,200],
	  REWARD: ["can food", "cake", "home"],
	  REWARD_URL: ["./img/can_food", "./img/cake", "./img/home"],
	  WIN_URL: "./img/pusheen_with_mom.jpg"
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(3);
	const Constants = __webpack_require__(5);
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(5);
	
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
	
	  renderReward(ctx,this.game.level);
	};
	
	function paintRow(ctx,img, cols, row){
	  for (let i = 0; i < cols; i++) {
	    ctx.drawImage(img, i*50, Constants.DIM_Y - ((row+1)*50));
	  }
	}
	
	function renderReward(ctx,level){
	  let img = new Image();
	
	  img.src = Constants.REWARD_URL[level-1];
	
	  ctx.drawImage(img, Constants.REWARD_POS[0], Constants.REWARD_POS[1]);
	}
	
	module.exports = Board;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Cat = __webpack_require__(6);
	const Constants = __webpack_require__(5);
	
	const GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.win = false;
	};
	
	GameView.MOVES = {
	  "w": [ 0, -50],
	  "a": [-50,  0],
	  "s": [ 0,  50],
	  "d": [ 50,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  const cat = this.game.cat;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    const move = GameView.MOVES[k];
	    key(k, function () { cat.trot(move); }); //keymaster
	  });
	};
	
	GameView.prototype.checkWin = function () {
	  if (this.game.cat.pos[0] === Constants.REWARD_POS[0] &&
	  this.game.cat.pos[1] === Constants.REWARD_POS[1]){
	    if (this.game.level < Constants.MAX_LVL){
	      this.renderReward();
	    } else {
	      this.win = true;
	    }
	  }
	};
	
	GameView.prototype.renderReward = function () {
	  alert(`Pusheen has found ${Constants.REWARD[this.game.level-1]}! Nom nom nom!`);
	  this.game.level += 1;
	  this.game.resetCars();
	  this.game.cat.restart();
	};
	
	GameView.prototype.triggerWin = function () {
	  let winImg = new Image();
	  winImg.src = Constants.WIN_URL;
	
	  const that = this;
	
	  winImg.addEventListener("load", function() {
	    that.ctx.drawImage(winImg, 200, 200, 235, 252);
	
	    alert("Pusheen has arrived home to his mother! Yay!");
	  });
	  //replace this with a restart menu later
	  // this.game.level = 1;
	  // this.game.resetCars();
	  // this.game.cat.restart();
	};
	
	GameView.prototype.gameOver = function () {
	  alert("Pusheen got run over! :( Game will reset.")
	  this.game.level = 1;
	  this.game.resetCars();
	  this.game.cat.restart();
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
	  const that = this;
	
	  this.game.step(timeDelta, this.gameOver.bind(this));
	  this.game.draw(this.ctx);
	  //ensure he sits on his reward first!
	  window.setTimeout(this.checkWin.bind(this), 100);
	  this.lastTime = time;
	  //every call to animate requests causes another call to animate
	  if (this.win === false) {
	    requestAnimationFrame(this.animate.bind(this));
	  } else {
	    that.triggerWin();
	  }
	};
	
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map