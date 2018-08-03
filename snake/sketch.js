let scale_;
let translationX;
let translationY;

let gameOver;

let board;
let boardWidth;
let boardHeight;

let fruit;

let snakeSegments;
let direction;
let nextDirection;

let grassImage;
let treeImage;
let fruitImage;
let snakeImage;

let boardImage;


function preload() {
    grassImage = loadImage(`images/grass.png`);
    treeImage = loadImage('images/tree.png');
    fruitImage = loadImage(`images/fruit.png`);
    snakeImage = loadImage('images/snake.png')
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
        nextDirection = {x: 0, y: -1};
    } else if (keyCode === RIGHT_ARROW && direction.x !== -1) {
        nextDirection = {x: 1, y: 0};
    } else if (keyCode === DOWN_ARROW && direction.y !== -1) {
        nextDirection = {x: 0, y: 1};
    } else if (keyCode === LEFT_ARROW && direction.x !== 1) {
        nextDirection = {x: -1, y: 0};
    } else if (keyCode === ENTER && gameOver) {
        resetGame();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Logic functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function resetGame() {
    gameOver = false;

    // Reset board
    board = random(BOARDS);
    frameRate(board.speed);

    board = board.board;
    boardWidth = board[0].length;
    boardHeight = board.length;
    boardImage = createGraphics(boardWidth * 100, boardHeight * 100);
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if(board[y][x]) {
                boardImage.image(treeImage, x * 100, y * 100, 100, 100);
            } else {
                let tile = random(GRASS);
                boardImage.image(grassImage, x * 100, y * 100, 100, 100, tile.x * 128, tile.y * 128, 128, 128);
            }
        }
    }

    // Reset fruit
    setNewFruit();

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
    // TODO: Fruit can appear on snake or on wall
    fruit = {
        pos: {x: floor(random(boardWidth)), y: floor(random(boardHeight))},
        type: random(Object.keys(FRUITS))
    };
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawBoard() {
    image(boardImage, 0, 0, boardWidth * 100, boardHeight * 100);
}


function drawFruit() {
    let sourceX = FRUITS[fruit.type].x * 128;
    let sourceY = FRUITS[fruit.type].y * 128;
    image(fruitImage, fruit.pos.x * 100, fruit.pos.y * 100, 100, 100, sourceX, sourceY, 128, 128);
}


function drawSnake() {
    let sourceX;
    let sourceY;
    let segmentKey;

    let previous;
    let next;

    const up = {x: 0, y: -1};
    const right = {x: 1, y: 0};
    const down = {x: 0, y: 1};
    const left = {x: -1, y: 0};

    // Draw tail
    let tail = snakeSegments[snakeSegments.length - 1];
    previous = snakeSegments[snakeSegments.length - 2];

    if (equal(add(tail, up), previous)) {
        segmentKey = 'tail_up';
    } else if (equal(add(tail, right), previous)) {
        segmentKey = 'tail_right';
    } else if (equal(add(tail, down), previous)) {
        segmentKey = 'tail_down';
    } else if (equal(add(tail, left), previous)) {
        segmentKey = 'tail_left';
    }

    sourceX = SNAKE_SEGMENTS[segmentKey].x * 64;
    sourceY = SNAKE_SEGMENTS[segmentKey].y * 64;
    image(snakeImage, tail.x * 100, tail.y * 100, 100, 100, sourceX, sourceY, 64, 64);

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

        if (checkSegmentsLocation(current, previous, next, right, left)) {
            segmentKey = 'body_right_left';
        } else if (checkSegmentsLocation(current, previous, next, up, down)) {
            segmentKey = 'body_up_down';
        } else if (checkSegmentsLocation(current, previous, next, up, right)) {
            segmentKey = 'body_up_right';
        } else if (checkSegmentsLocation(current, previous, next, down, right)) {
            segmentKey = 'body_down_right';
        } else if (checkSegmentsLocation(current, previous, next, down, left)) {
            segmentKey = 'body_down_left';
        } else if (checkSegmentsLocation(current, previous, next, up, left)) {
            segmentKey = 'body_up_left';
        }

        sourceX = SNAKE_SEGMENTS[segmentKey].x * 64;
        sourceY = SNAKE_SEGMENTS[segmentKey].y * 64;
        image(snakeImage, current.x * 100, current.y * 100, 100, 100, sourceX, sourceY, 64, 64);
    }

    // Draw head
    let head = snakeSegments[0];
    next = snakeSegments[1];

    if (equal(add(head, down), next)) {
        segmentKey = 'head_up';
    } else if (equal(add(head, left), next)) {
        segmentKey = 'head_right';
    } else if (equal(add(head, up), next)) {
        segmentKey = 'head_down';
    } else if (equal(add(head, right), next)) {
        segmentKey = 'head_left';
    }

    sourceX = SNAKE_SEGMENTS[segmentKey].x * 64;
    sourceY = SNAKE_SEGMENTS[segmentKey].y * 64;
    image(snakeImage, head.x * 100, head.y * 100, 100, 100, sourceX, sourceY, 64, 64);
}


function drawTitle() {
    noStroke();
    fill(51);
    textAlign(CENTER, CENTER);

    let w = boardWidth * 100;
    let h = boardHeight * 100 / 2;
    textSize(150);
    text('SNAKE', 0, 0, w, h);
    textSize(90);
    text('press ENTER to start', 0, h, w, h);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions
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
