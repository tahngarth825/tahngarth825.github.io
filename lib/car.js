const Util = require("./util");
const MovingObject = require("./movingObject");
const Cat = require("./cat");
const Constants = require("./constants.js");

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
