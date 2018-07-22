let scale_;
let translationX;
let translationY;

const BOARD = [
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1]
]
const BOARD_W = BOARD[0].length;
const BOARD_H = BOARD.length;

let head;
let body;
let tail;

let dir;
let nextDir;

let gameOver;

let topLength = 0;


function setup() {
    frameRate(10);
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
    if (!gameOver) {
        updateSnake();
    }

    // Draw
    background(250);

    drawBoard();
    drawSnake();

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

    head = createVector(17, 17);
    body = [createVector(18, 17)];
    tail = createVector(19, 17);

    dir = createVector(-1, 0);
    nextDir = createVector(-1, 0);

    if (typeof(Storage) !== 'undefined' && localStorage['snake.topLength']) {
        topLength = JSON.parse(localStorage['snake.topLength']);
    }
}


function endGame() {
    gameOver = true;

    length = 2 + body.length;
    topLength = (length > topLength)? length : topLength;
    if (typeof(Storage) !== 'undefined') {
        localStorage['snake.topLength'] = JSON.stringify(topLength);
    }
}


function keyPressed() {
    if (keyCode === UP_ARROW && dir.y !== 1) {
        nextDir = createVector(0, -1);
    } else if (keyCode === RIGHT_ARROW && dir.x !== -1) {
        nextDir = createVector(1, 0);
    } else if (keyCode === DOWN_ARROW && dir.y !== -1) {
        nextDir = createVector(0, 1);
    } else if (keyCode === LEFT_ARROW && dir.x !== 1) {
        nextDir = createVector(-1, 0);
    }
}


function updateSnake() {
    dir = createVector(nextDir.x, nextDir.y);
    let newHead = p5.Vector.add(head, dir);
    newHead.x = (newHead.x + BOARD_W) % BOARD_W;
    newHead.y = (newHead.y + BOARD_H) % BOARD_H;

    // Check if ate
    let ate = false;

    // Move
    if (!ate) {
        tail = body.pop();
    }
    body.unshift(head);
    head = newHead;

    // Check for collision
    if (BOARD[head.y][head.x] === 1 || (head.x === tail.x && head.y === tail.y)) {
        endGame();
    }
    for (let element of body) {
        if (head.x === element.x && head.y === element.y) {
            endGame();
            break;
        }
    }
}


function drawBoard() {
    noStroke();
    fill(200);
    rect(0, 0, BOARD_W * 100, BOARD_H * 100);
    fill(51);
    for (let y = 0; y < BOARD_H; ++y) {
        for (let x = 0; x < BOARD_W; ++x) {
            if (BOARD[y][x]) {
                rect(5 + x * 100, 5 + y * 100, 90, 90);
            }
        }
    }
}


function drawSnake() {
    noStroke();
    // Draw tail
    fill(0, 0, 127);
    rect(10 + 100 * tail.x, 10 + 100 * tail.y, 80, 80);
    // Draw body
    fill(0, 127, 0);
    for (let element of body) {
        rect(10 + 100 * element.x, 10 + 100 * element.y, 80, 80);
    }
    // Draw head
    fill(255, 0, 0);
    rect(10 + 100 * head.x, 10 + 100 * head.y, 80, 80);
}
