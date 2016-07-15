const Game = require("./game");
const GameView = require("./gameView");
const Constants = require("./constants.js");

document.addEventListener("DOMContentLoaded", function(){
  let canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Constants.DIM_X;
  canvasEl.height = Constants.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});
