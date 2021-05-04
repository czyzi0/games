let scale_;
let translationX;
let translationY;

let COLOR;
let IMAGES;

let scene;


function preload() {
  IMAGES = [
    loadImage('images/animals.jpg'),
    loadImage('images/bear.jpg'),
    loadImage('images/clouds.jpg'),
    loadImage('images/dinosaur.png'),
    loadImage('images/fox.png'),
    loadImage('images/trees.png'),
    loadImage('images/woman.jpg'),
  ];
}


function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  COLOR = {
    BACKGROUND: color(250),
    UI_LIGHT: color(200),
    UI_DARK: color(31),
  };

  scene = new GameScene();
}


function draw() {
  scale_ = min(width / scene.width, height / scene.height);
  translationX = (width - scale_ * scene.width) / 2;
  translationY = (height - scale_ * scene.height) / 2;

  translate(translationX, translationY);
  scale(scale_);

  if (scene.update()) {
    scene.draw();
  }

  scene = scene.nextScene;
}


function mouseClicked() {
  scene.handleClick((mouseX - translationX) / scale_, (mouseY - translationY) / scale_);
  scene.draw();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scene.draw();
}
