const UP = {x: 0, y: -1};
const RIGHT = {x: 1, y: 0};
const DOWN = {x: 0, y: 1};
const LEFT = {x: -1, y: 0};

let scale_;
let translationX;
let translationY;

let gameOver;

let boardConf;

let board;
let boardWidth;
let boardHeight;

let fruit;

let snakeSegments;
let direction;
let nextDirection;

let font;

let fruitConf;
let snakeConf;

let grassImage;
let treeImage;
let fruitImage;
let snakeImage;


function preload() {
    boardConf = loadJSON('assets/board.json');

    font = loadFont('assets/font.ttf');

    fruitConf = loadJSON('assets/fruit.json');
    snakeConf = loadJSON('assets/snake.json');

    grassImage = loadImage('assets/grass.png');
    treeImage = loadImage('assets/tree.png');
    fruitImage = loadImage('assets/fruit.png');
    snakeImage = loadImage('assets/snake.png');
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    resetGame();
    endGame();
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

    if (gameOver) {
        drawTitle();
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function keyPressed() {
    if (keyCode === UP_ARROW && direction.y !== 1) {
        nextDirection = UP;
    } else if (keyCode === RIGHT_ARROW && direction.x !== -1) {
        nextDirection = RIGHT;
    } else if (keyCode === DOWN_ARROW && direction.y !== -1) {
        nextDirection = DOWN;
    } else if (keyCode === LEFT_ARROW && direction.x !== 1) {
        nextDirection = LEFT;
    } else if (keyCode === ENTER && gameOver) {
        resetGame();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function resetGame() {
    gameOver = false;

    // Reset board
    frameRate(boardConf.speed);
    board = boardConf.board;
    boardWidth = board[0].length;
    boardHeight = board.length;

    // Reset snake
    let middleX = floor(boardWidth / 2);
    let middleY = floor(boardHeight / 2);
    snakeSegments = [
        {x: middleX, y: middleY},
        {x: middleX + 1, y: middleY},
        {x: middleX + 2, y: middleY}
    ];
    direction = {x: -1, y: 0};
    nextDirection = {x: -1, y: 0};

    // Reset fruit
    setNewFruit();
}


function endGame() {
    gameOver = true;
}


function update() {
    direction = nextDirection;
    let newHead = add(snakeSegments[0], direction);

    // Check if snake ate
    let ate = false;
    if (newHead.x === fruit.pos.x && newHead.y === fruit.pos.y) {
        ate = true;
        setNewFruit();
    }

    // Move snake
    if (!ate) {
        snakeSegments.pop();
    }
    snakeSegments.unshift(newHead);

    // Check for collisions
    if (board[snakeSegments[0].y][snakeSegments[0].x] === 1) {
        endGame();
    }
    for (let i = 1; i < snakeSegments.length; ++i) {
        if (snakeSegments[0].x === snakeSegments[i].x && snakeSegments[0].y === snakeSegments[i].y) {
            endGame();
            break;
        }
    }
}


function setNewFruit() {
    let posChoices = [];
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (!board[y][x]) {
                let empty = true;
                for (let i = 0; i < snakeSegments.length; ++i) {
                    if (equal(snakeSegments[i], {x: x, y: y})) {
                        empty = false;
                    }
                }
                if (empty) {
                    posChoices.push({x: x, y: y});
                }
            }
        }
    }

    fruit = {
        pos: random(posChoices),
        type: random(Object.keys(fruitConf.fruits))
    };
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Drawing
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawBoard() {
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if(board[y][x]) {
                image(treeImage, x * 100, y * 100, 100, 100);
            } else {
                image(grassImage, x * 100, y * 100, 100, 100);
            }
        }
    }
}


function drawFruit() {
    image(
        fruitImage,
        fruit.pos.x * 100,
        fruit.pos.y * 100,
        100,
        100,
        fruitConf.fruits[fruit.type].x,
        fruitConf.fruits[fruit.type].y,
        fruitConf.size,
        fruitConf.size
    );
}


function drawSnake() {
    let segmentKey;

    let previous;
    let next;

    // Draw tail
    let tail = snakeSegments[snakeSegments.length - 1];
    previous = snakeSegments[snakeSegments.length - 2];

    if (equal(add(tail, UP), previous)) {
        segmentKey = 'tail_up';
    } else if (equal(add(tail, RIGHT), previous)) {
        segmentKey = 'tail_right';
    } else if (equal(add(tail, DOWN), previous)) {
        segmentKey = 'tail_down';
    } else if (equal(add(tail, LEFT), previous)) {
        segmentKey = 'tail_left';
    }

    image(
        snakeImage,
        tail.x * 100,
        tail.y * 100,
        100,
        100,
        snakeConf.segments[segmentKey].x,
        snakeConf.segments[segmentKey].y,
        snakeConf.size,
        snakeConf.size
    );

    // Draw body
    function checkSegmentsLocation(current, previous, next, dir1, dir2) {
        return (
            equal(add(current, dir1), previous) && equal(add(current, dir2), next) ||
            equal(add(current, dir2), previous) && equal(add(current, dir1), next)
        );
    }

    for (let i = 1; i < snakeSegments.length - 1; ++i) {
        previous = snakeSegments[i - 1];
        let current = snakeSegments[i];
        next = snakeSegments[i + 1];

        if (checkSegmentsLocation(current, previous, next, RIGHT, LEFT)) {
            segmentKey = 'body_right_left';
        } else if (checkSegmentsLocation(current, previous, next, UP, DOWN)) {
            segmentKey = 'body_up_down';
        } else if (checkSegmentsLocation(current, previous, next, UP, RIGHT)) {
            segmentKey = 'body_up_right';
        } else if (checkSegmentsLocation(current, previous, next, DOWN, RIGHT)) {
            segmentKey = 'body_down_right';
        } else if (checkSegmentsLocation(current, previous, next, DOWN, LEFT)) {
            segmentKey = 'body_down_left';
        } else if (checkSegmentsLocation(current, previous, next, UP, LEFT)) {
            segmentKey = 'body_up_left';
        }

        image(
            snakeImage,
            current.x * 100,
            current.y * 100,
            100,
            100,
            snakeConf.segments[segmentKey].x,
            snakeConf.segments[segmentKey].y,
            snakeConf.size,
            snakeConf.size
        );
    }

    // Draw head
    let head = snakeSegments[0];
    next = snakeSegments[1];

    if (equal(add(head, DOWN), next)) {
        segmentKey = 'head_up';
    } else if (equal(add(head, LEFT), next)) {
        segmentKey = 'head_right';
    } else if (equal(add(head, UP), next)) {
        segmentKey = 'head_down';
    } else if (equal(add(head, RIGHT), next)) {
        segmentKey = 'head_left';
    }

    image(
        snakeImage,
        head.x * 100,
        head.y * 100,
        100,
        100,
        snakeConf.segments[segmentKey].x,
        snakeConf.segments[segmentKey].y,
        snakeConf.size,
        snakeConf.size
    );
}


function drawTitle() {
    fill(21);
    textFont(font);
    textAlign(CENTER, CENTER);

    let w = boardWidth * 100;
    let h = boardHeight * 100 / 2;
    textSize(200);
    text('SNAKE', 0, 0, w, h);
    textSize(130);
    text('press ENTER to start', 0, h, w, h);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function add(vec1, vec2) {
    let sum = {x: vec1.x + vec2.x, y: vec1.y + vec2.y};
    sum.x = (sum.x + boardWidth) % boardWidth;
    sum.y = (sum.y + boardHeight) % boardHeight;
    return sum;
}


function equal(vec1, vec2) {
    return vec1.x === vec2.x && vec1.y === vec2.y;
}
