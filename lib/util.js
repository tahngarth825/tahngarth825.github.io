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
