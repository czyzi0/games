let scale_;
let translationX;
let translationY;

const UP = {x: 0, y: -1};
const RIGHT = {x: 1, y: 0};
const DOWN = {x: 0, y: 1};
const LEFT = {x: -1, y: 0};

let BOARD_CONFIG;
let FRUIT_CONFIG;
let SNAKE_CONFIG;

let FONT;

let GRASS_IMAGE;
let TREE_IMAGE;
let FRUIT_IMAGE;
let SNAKE_IMAGE;

let BOARD;
let BOARD_W;
let BOARD_H;

let gameOver;

let fruit;

let snakeSegments;
let direction;
let nextDirection;


function preload() {
    BOARD_CONFIG = loadJSON('assets/board.json');

    FONT = loadFont('assets/font.ttf');

    FRUIT_CONFIG = loadJSON('assets/fruit.json');
    SNAKE_CONFIG = loadJSON('assets/snake.json');

    GRASS_IMAGE = loadImage('assets/grass.png');
    TREE_IMAGE = loadImage('assets/tree.png');
    FRUIT_IMAGE = loadImage('assets/fruit.png');
    SNAKE_IMAGE = loadImage('assets/snake.png');
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(BOARD_CONFIG.speed);

    // Set board
    BOARD = BOARD_CONFIG.board;
    BOARD_W = BOARD[0].length;
    BOARD_H = BOARD.length;

    resetGame();
    endGame();
}


function draw() {
    scale_ = min(width / (BOARD_W * 100), height / (BOARD_H * 100));
    translationX = (width - scale_ * BOARD_W * 100) / 2;
    translationY = (height - scale_ * BOARD_H * 100) / 2;

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

    // Reset snake
    let middleX = floor(BOARD_W / 2);
    let middleY = floor(BOARD_H / 2);
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
    if (BOARD[snakeSegments[0].y][snakeSegments[0].x] === 1) {
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
    for (let y = 0; y < BOARD_H; ++y) {
        for (let x = 0; x < BOARD_W; ++x) {
            if (!BOARD[y][x]) {
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
        type: random(Object.keys(FRUIT_CONFIG.fruits))
    };
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Drawing
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawBoard() {
    for (let y = 0; y < BOARD_H; ++y) {
        for (let x = 0; x < BOARD_W; ++x) {
            if(BOARD[y][x]) {
                image(TREE_IMAGE, x * 100, y * 100, 100, 100);
            } else {
                image(GRASS_IMAGE, x * 100, y * 100, 100, 100);
            }
        }
    }
}


function drawFruit() {
    image(
        FRUIT_IMAGE,
        fruit.pos.x * 100,
        fruit.pos.y * 100,
        100,
        100,
        FRUIT_CONFIG.fruits[fruit.type].x,
        FRUIT_CONFIG.fruits[fruit.type].y,
        FRUIT_CONFIG.size,
        FRUIT_CONFIG.size
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
        SNAKE_IMAGE,
        tail.x * 100,
        tail.y * 100,
        100,
        100,
        SNAKE_CONFIG.segments[segmentKey].x,
        SNAKE_CONFIG.segments[segmentKey].y,
        SNAKE_CONFIG.size,
        SNAKE_CONFIG.size
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
            SNAKE_IMAGE,
            current.x * 100,
            current.y * 100,
            100,
            100,
            SNAKE_CONFIG.segments[segmentKey].x,
            SNAKE_CONFIG.segments[segmentKey].y,
            SNAKE_CONFIG.size,
            SNAKE_CONFIG.size
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
        SNAKE_IMAGE,
        head.x * 100,
        head.y * 100,
        100,
        100,
        SNAKE_CONFIG.segments[segmentKey].x,
        SNAKE_CONFIG.segments[segmentKey].y,
        SNAKE_CONFIG.size,
        SNAKE_CONFIG.size
    );
}


function drawTitle() {
    fill(21);
    textFont(FONT);
    textAlign(CENTER, CENTER);

    let w = BOARD_W * 100;
    let h = BOARD_H * 100 / 2;
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
    sum.x = (sum.x + BOARD_W) % BOARD_W;
    sum.y = (sum.y + BOARD_H) % BOARD_H;
    return sum;
}


function equal(vec1, vec2) {
    return vec1.x === vec2.x && vec1.y === vec2.y;
}
