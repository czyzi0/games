let scale_;
let translationX;
let translationY;

const BOARD = [
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1]
]
const BOARD_W = BOARD[0].length;
const BOARD_H = BOARD.length;

let gameOver;

let topLength = 0;


function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    resetGame();
    // endGame();
}


function draw() {
    scale_ = min(width / (BOARD_W * 100), height / (BOARD_H * 100));
    translationX = (width - scale_ * BOARD_W * 100) / 2;
    translationY = (height - scale_ * BOARD_H * 100) / 2;

    translate(translationX, translationY);
    scale(scale_);

    // Update

    // Draw
    background(250);

    // Draw board
    noStroke();
    fill(200);
    rect(0, 0, BOARD_W * 100, BOARD_H * 100);
    fill(51);
    for (let y = 0; y < BOARD_H; ++y) {
        for (let x = 0; x < BOARD_W; ++x) {
            if (BOARD[y][x]) {
                rect(x * 100, y * 100, 100, 100);
            }
        }
    }

    // Draw game over message
    if (gameOver) {
        noStroke();
        fill(81);
        textAlign(CENTER, CENTER);

        let w = BOARD_W * 100;
        let h = BOARD_H * 100 / 2;
        textSize(150);
        text('GAME OVER', 0, 0, w, h);
        textSize(90);
        text(`TOP LENGTH: ${topLength}`, 0, h, w, h);
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function resetGame() {
    gameOver = false;

    if (typeof(Storage) !== 'undefined' && localStorage['snake.topLength']) {
        topLength = JSON.parse(localStorage['snake.topLength']);
    }
}


function endGame() {
    gameOver = true;

    length = 1;   // TODO: Implement finding current snake length
    topLength = (length > topLength)? length : topLength;
    if (typeof(Storage) !== 'undefined') {
        localStorage['snake.topLength'] = JSON.stringify(topLength);
    }
}
