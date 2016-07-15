const Cat = require("./cat.js");
const Constants = require("./constants.js");

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
