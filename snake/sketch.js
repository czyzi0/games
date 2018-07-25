let scale_;
let translationX;
let translationY;

let gameOver;

let board;
let boardImage;
let boardWidth;
let boardHeight;

let fruit;

let head;
let body;

let dir;
let nextDir;

let fruitImages = [];
let grassImages = [];
let treeImage;


function preload() {
    for (let i = 0; i < 7; ++i) {
        fruitImages.push(loadImage(`images/fruit-${i}.png`));
    }

    for (let i = 0; i < 4; ++i) {
        grassImages.push(loadImage(`images/grass-${i}.png`));
    }

    treeImage = loadImage('images/tree.png');
}


function setup() {
    frameRate(10);
    createCanvas(windowWidth, windowHeight);

    resetGame();
}


function draw() {
    scale_ = min(width / (boardWidth * 100), height / (boardHeight * 100));
    translationX = (width - scale_ * boardWidth * 100) / 2;
    translationY = (height - scale_ * boardHeight * 100) / 2;

    translate(translationX, translationY);
    scale(scale_);

    // Update
    if (!gameOver) {
        update();
    }

    // Draw
    background(250);

    drawBoard();
    drawFruit();
    drawSnake();

    // Draw game over message
    if (gameOver) {
        noStroke();
        fill(51);
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

    // Reset board
    board = random(BOARDS);
    boardWidth = board[0].length;
    boardHeight = board.length;
    boardImage = createGraphics(boardWidth * 100, boardHeight * 100);
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if(board[y][x]) {
                boardImage.image(treeImage, x * 100, y * 100, 100, 100);
            } else {
                boardImage.image(random(grassImages), x * 100, y * 100, 100, 100);
            }
        }
    }

    // Reset fruit
    setNewFruit();

    // Reset snake
    let middleX = floor(boardWidth / 2);
    let middleY = floor(boardHeight / 2);
    head = createVector(middleX, middleY);
    body = [createVector(middleX + 1, middleY), createVector(middleX + 2, middleY)];

    dir = createVector(-1, 0);
    nextDir = createVector(-1, 0);
}


function endGame() {
    gameOver = true;
}


function update() {
    dir = createVector(nextDir.x, nextDir.y);
    let newHead = p5.Vector.add(head, dir);
    newHead.x = (newHead.x + boardWidth) % boardWidth;
    newHead.y = (newHead.y + boardHeight) % boardHeight;

    // Check if snake ate
    let ate = false;
    if (newHead.x === fruit.pos.x && newHead.y === fruit.pos.y) {
        ate = true;
        setNewFruit();
    }

    // Move snake
    if (!ate) {
        body.pop();
    }
    body.unshift(head);
    head = newHead;

    // Check for collisions
    if (board[head.y][head.x] === 1) {
        endGame();
    }
    for (let element of body) {
        if (head.x === element.x && head.y === element.y) {
            endGame();
            break;
        }
    }
}


function setNewFruit() {
    // TODO: Fruit can appear on snake or on wall
    let x = floor(random(boardWidth));
    let y = floor(random(boardHeight));

    fruit = {pos: createVector(x, y), image: random(fruitImages)};
}


function drawBoard() {
    image(boardImage, 0, 0, boardWidth * 100, boardHeight * 100);
}


function drawFruit() {
    image(fruit.image, 5 + fruit.pos.x * 100, 5 + fruit.pos.y * 100, 90, 90);
}


function drawSnake() {
    noStroke();
    // Draw body
    fill(0, 127, 0);
    for (let element of body) {
        rect(10 + 100 * element.x, 10 + 100 * element.y, 80, 80);
    }
    // Draw head
    fill(255, 0, 0);
    rect(10 + 100 * head.x, 10 + 100 * head.y, 80, 80);
}
