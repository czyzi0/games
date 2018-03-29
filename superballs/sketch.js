let Color;

let scene;

let scale_;
let translationX;
let translationY;


function setup() {
    frameRate(30);
    createCanvas(800, 600);

    Color = {
        NONE: color(0, 0, 0),
        RED: color(255, 0, 0),
        YELLOW: color(255, 255, 0),
        BLUE: color(0, 128, 255),
        GREEN: color(0, 0, 153),
        PURPLE: color(127, 0, 255),
        ORANGE: color(255, 128, 0)
    }

    scene = new GameScene();
}


function draw() {
    scale_ = min(width/scene.width, height/scene.height);
    translationX = (width - scale_*scene.width) / 2;
    translationY = 0;

    translate(translationX, translationY);
    scale(scale_);

    if(scene.update()) {
        scene.draw();
    }

    scene = scene.nextScene;
}


function mouseClicked() {
    scene.handleClick((mouseX-translationX) / scale_, (mouseY-translationY) / scale_);
    scene.draw();
}
