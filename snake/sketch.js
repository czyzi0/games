let scale_;
let translationX;
let translationY;

let COLOR;
let IMAGE;

const WIDTH = 1000;
const HEIGHT = 1000;

let gameOver;
let paused;

let board;
let snake;
let fruit;


function preload() {
  IMAGE = {
    FRUIT: {
      APPLE: loadImage('images/apple.png'),
      BANANA: loadImage('images/banana.png'),
      CHERRY: loadImage('images/cherry.png'),
      GARNET: loadImage('images/garnet.png'),
      GRAPE: loadImage('images/grape.png'),
      LEMON: loadImage('images/lemon.png'),
      PLUM: loadImage('images/plum.png'),
    }
  };
}


function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  COLOR = {
    BACKGROUND: color(250),
    UI_LIGHT: color(200),
    UI_DARK: color(81),
    SNAKE_LIGHT: color(50, 205, 50),
    SNAKE_DARK: color(0, 100, 0),
    WHITE: color(250),
    BLACK: color(0),
  };

  resetGame();
}


function update() {
  if (paused) {
    return;
  }

  if (dist(fruit.x, fruit.y, snake.headX, snake.headY) < 40) {
    resetFruit();
    snake.grow();
  }

  gameOver = snake.checkBitten() || snake.headX < 15 || snake.headX > 985 || snake.headY < 15 || snake.headY > 985;

  board.update();
  if (!gameOver) {
    snake.update();
  }
  fruit.update();
}


function draw() {
  scale_ = min(width / WIDTH, height / HEIGHT);
  translationX = (width - scale_ * WIDTH) / 2;
  translationY = (height - scale_ * HEIGHT) / 2;

  translate(translationX, translationY);
  scale(scale_);

  update();

  background(COLOR.BACKGROUND);

  board.draw();
  snake.draw();
  fruit.draw();

  noStroke();
  fill(COLOR.UI_DARK);
  textAlign(CENTER, CENTER);
  if (paused) {
    textSize(50);
    text('PAUSED', 0, 0, 1000, 600);
  }
  if (gameOver) {
    textSize(100);
    text('GAME OVER', 0, 0, 1000, 600);
    textSize(50);
    text(`SCORE: ${snake.length}`, 0, 600, 1000, 200);
  }
}


function keyPressed() {
  if (keyCode === 80 && !gameOver) {
    paused = !paused;
  }
  if (keyCode === ENTER && gameOver) {
    resetGame();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function resetGame() {
  gameOver = false;
  paused = false;

  board = new Board(0, 0, 1000);
  snake = new Snake(400, 500, 10, 50);
  resetFruit();
}


function resetFruit() {
  let x = random(50, 950);
  let y = random(50, 950);
  while (dist(x, y, snake.headX, snake.headY) < 150) {
    x = random(50, 950);
    y = random(50, 950);
  }
  fruit = new Fruit(x, y, 50);
}
