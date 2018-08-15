let scale_;
let translationX;
let translationY;

let COLOR;

let scene;


function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    COLOR = {
        BACKGROUND: color(250),
        UI_LIGHT: color(200),
        UI_DARK: color(81),
        NONE: color(0, 0),
        RED: color(255, 0, 0),
        YELLOW: color(255, 255, 0),
        BLUE: color(0, 128, 255),
        GREEN: color(0, 153, 0),
        PURPLE: color(200, 0, 255),
        ORANGE: color(255, 128, 0)
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
}
