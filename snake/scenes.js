class GameScene {

  constructor() {
    this.width = 1000;
    this.height = 1000;

    this.nextScene = this;

    this.gameOver;
    this.paused;

    this.board;
    this.snake;
    this.fruit;

    this.topLength = 0;

    this.resetGame();
  }

  update() {
    if (this.paused) {
      return;
    }

    if (dist(this.fruit.x, this.fruit.y, this.snake.headX, this.snake.headY) < 40) {
      this.resetFruit();
      this.snake.grow();
    }

    if (!this.gameOver && (this.checkOutOfBoard() || this.snake.checkBitten())) {
      this.gameOver = true;

      this.topLength = (this.snake.length > this.topLength) ? this.snake.length : this.topLength;
      if (typeof(Storage) !== 'undefined') {
        localStorage['snake.topLength'] = JSON.stringify(this.topLength);
      }
    }

    this.board.update();
    if (!this.gameOver) {
      this.snake.update();
    }
    this.fruit.update();
  }

  draw() {
    background(COLOR.BACKGROUND);

    this.board.draw();
    this.snake.draw();
    this.fruit.draw();

    if (this.paused) {
      noStroke();
      fill(color(21));
      textAlign(CENTER, CENTER);

      textSize(50);
      text('PAUSED', 0, 0, 1000, 600);
    }

    if (this.gameOver) {
      noStroke();
      fill(color(21));
      textAlign(CENTER, CENTER);

      textSize(100);
      text('GAME OVER', 0, 0, 1000, 600);

      textSize(50);
      text(`TOP LENGTH: ${this.topLength}`, 0, 600, 1000, 75);
      textSize(30);
      text('PRESS ENTER', 0, 675, 1000, 75);
    }
  }

  handleKeyPressed(keyCode) {
    if (keyCode === 80) {
      this.paused = !this.paused;
    }
    if (keyCode === ENTER && this.gameOver) {
      this.resetGame();
    }
  }

  resetGame() {
    this.paused = false;
    this.gameOver = false;

    if (typeof(Storage) !== 'undefined' && localStorage['snake.topLength']) {
      this.topLength = JSON.parse(localStorage['snake.topLength']);
    }

    this.board = new Board(0, 0, 1000);
    this.snake = new Snake(400, 500, 10, 50);
    this.resetFruit();
  }

  resetFruit() {
    let x = random(50, 950);
    let y = random(50, 950);
    while (dist(x, y, this.snake.headX, this.snake.headY) < 150) {
      x = random(50, 950);
      y = random(50, 950);
    }
    this.fruit = new Fruit(x, y, 50);
  }

  checkOutOfBoard() {
    if (this.snake.headX < 15 || this.snake.headX > 985 || this.snake.headY < 15 || this.snake.headY > 985) {
      return true;
    }
    return false;
  }
}
