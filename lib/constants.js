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
      SPEED: 10
    },
    FAST_CAR: {
      LEFT_IMG: "./img/car_fast_left.png",
      RIGHT_IMG: "./img/car_fast_right.png",
      SPEED: 20
    },
    SUPER_FAST_CAR: {
      LEFT_IMG: "./img/car_superfast_left.png",
      RIGHT_IMG: "./img/car_superfast_right.png",
      SPEED: 30
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
