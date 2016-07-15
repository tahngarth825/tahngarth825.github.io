const Constants = require("./constants.js");

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

  ctx.drawImage(img, Constants.REWARD_POS[0], Constants.REWARD_POS[1])
}

module.exports = Board;
