let scale_;
let translationX;
let translationY;

let scene;


function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    scene = new GameScene();
}


function draw() {
    scale_ = min(width / scene.width, height / scene.height);
    translationX = (width - scale_ * scene.width) / 2;
    translationY = (height - scale_ * scene.height) / 2;

    translate(translationX, translationY);
    scale(scale_);

    scene.update()
    scene.draw();

    scene = scene.nextScene;
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
