let scene;

let scale_;
let translationX;
let translationY;


function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    scene = new GameScene();
}


function draw() {
    scale_ = min(width/scene.width, height/scene.height);
    translationX = (width - scale_*scene.width) / 2;
    translationY = (height - scale_*scene.height) / 2;

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


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
