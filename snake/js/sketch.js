let scale_;
let translationX;
let translationY;

const TILE_SIZE = 30;

let gameOver;

let board;
let boardWidth;
let boardHeight;

let topLength = 0;


function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    resetGame();
    endGame();
}


function draw() {
    scale_ = min(width / (boardWidth * TILE_SIZE), height / (boardHeight * TILE_SIZE));
    translationX = (width - scale_ * boardWidth * TILE_SIZE) / 2;
    translationY = (height - scale_ * boardHeight * TILE_SIZE) / 2;

    translate(translationX, translationY);
    scale(scale_);

    // Update

    // Draw
    background(250);

    // Draw board
    noStroke();
    fill(200);
    rect(0, 0, boardWidth * TILE_SIZE, boardHeight * TILE_SIZE);
    fill(150,25,14);
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (board[y][x]) {
                rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Draw game over message
    if (gameOver) {
        noStroke();
        fill(81);
        textAlign(CENTER, CENTER);

        let w = boardWidth * TILE_SIZE;
        let h = boardHeight * TILE_SIZE / 2
        textSize(60);
        text('GAME OVER', 0, 0, w, h);
        textSize(30);
        text(`TOP LENGTH: ${topLength}`, 0, h, w, h);
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function resetGame() {
    gameOver = false;

    board = random(BOARDS);
    boardWidth = board[0].length;
    boardHeight = board.length;

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
