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
    key(k, function () { cat.move(move); }); //keymaster
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
