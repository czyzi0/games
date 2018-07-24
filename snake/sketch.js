let scale_;
let translationX;
let translationY;

let board;
let boardWidth;
let boardHeight;

let gameOver;

let head;
let body;
let tail;

let dir;
let nextDir;

let fruitImages = [];


function preload() {
    fruitImages.push(loadImage('images/apple.png'));
    fruitImages.push(loadImage('images/banana.png'));
    fruitImages.push(loadImage('images/cherry.png'));
    fruitImages.push(loadImage('images/grape.png'));
    fruitImages.push(loadImage('images/lemon.png'));
    fruitImages.push(loadImage('images/pear.png'));
    fruitImages.push(loadImage('images/plum.png'));
    fruitImages.push(loadImage('images/watermelon.png'));
}


function setup() {
    frameRate(10);
    createCanvas(windowWidth, windowHeight);

    resetGame();
    // endGame();
}


function draw() {
    scale_ = min(width / (boardWidth * 100), height / (boardHeight * 100));
    translationX = (width - scale_ * boardWidth * 100) / 2;
    translationY = (height - scale_ * boardHeight * 100) / 2;

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

    // image(fruitImages[7], 15, 15, 70, 70);

    // Draw game over message
    if (gameOver) {
        noStroke();
        fill(81);
        textAlign(CENTER, CENTER);

        let w = boardWidth * 100;
        let h = boardHeight * 100 / 2;
        textSize(150);
        text('GAME OVER', 0, 0, w, h);
        textSize(90);
        text('<message>', 0, h, w, h);
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
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


function resetGame() {
    gameOver = false;

    board = random(BOARDS);
    boardWidth = board[0].length;
    boardHeight = board.length;

    middleX = floor(boardWidth / 2);
    middleY = floor(boardHeight / 2);
    head = createVector(middleX, middleY);
    body = [createVector(middleX + 1, middleY)];
    tail = createVector(middleX + 2, middleY);

    dir = createVector(-1, 0);
    nextDir = createVector(-1, 0);
}


function endGame() {
    gameOver = true;
}


function updateSnake() {
    dir = createVector(nextDir.x, nextDir.y);
    let newHead = p5.Vector.add(head, dir);
    newHead.x = (newHead.x + boardWidth) % boardWidth;
    newHead.y = (newHead.y + boardHeight) % boardHeight;

    // Check if ate
    let ate = false;

    // Move
    if (!ate) {
        tail = body.pop();
    }
    body.unshift(head);
    head = newHead;

    // Check for collision
    if (board[head.y][head.x] === 1 || (head.x === tail.x && head.y === tail.y)) {
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
    rect(0, 0, boardWidth * 100, boardHeight * 100);
    fill(51);
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (board[y][x]) {
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
