let scale_;
let translationX;
let translationY;

let COLOR;
let IMAGE;

let scene;


function preload() {
    IMAGE = {
        FRUIT: {
            APPLE: loadImage('assets/apple.png'),
            BANANA: loadImage('assets/banana.png'),
            GRAPE: loadImage('assets/grape.png'),
            LEMON: loadImage('assets/lemon.png')
        }
    };
}


function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    COLOR = {
        BACKGROUND: color(250),
        BOARD: color(121),
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

    if (scene.update()) {
        scene.draw();
    }

    scene = scene.nextScene;
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
