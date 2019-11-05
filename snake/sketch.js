let scale_;
let translationX;
let translationY;

let COLOR;
let IMAGE;

let scene;


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
    GRASS: color(62, 126, 0),
    SNAKE_LIGHT: color(30, 144, 255),
    SNAKE_DARK: color(0,0,128),
    SNAKE_EYE_OUT: color(255),
    SNAKE_EYE_IN: color(0)
  };

  scene = new GameScene();
}


function draw() {
  scale_ = min(width / scene.width, height / scene.height);
  translationX = (width - scale_ * scene.width) / 2;
  translationY = (height - scale_ * scene.height) / 2;

  translate(translationX, translationY);
  scale(scale_);

  scene.update();
  scene.draw();
  scene = scene.nextScene;
}


function keyPressed() {
  scene.handleKeyPressed(keyCode);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
