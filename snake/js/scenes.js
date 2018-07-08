class GameScene {

    constructor() {
        this.width = 900;
        this.height = 500;

        this.nextScene = this;

        this._gameOver;

        this._board;
        this._snake;

        this._scoreCounter;
        this._topScore = 0;

        this._resetGame();
    }

    update() {
        this._board.update();
        if (!this._snake.update(this._board)) {
            this._endGame();
        }
        this._scoreCounter.update();
    }

    draw() {
        background(250);

        this._board.draw();
        this._snake.draw();
        this._scoreCounter.draw();

        if (this._gameOver) {
            stroke(81);
            fill(81);
            textAlign(CENTER, CENTER);
            strokeWeight(4);

            textSize(100);
            text('GAME OVER', 0, 0, 900, 300);

            textSize(50);
            text(`TOP SCORE: ${this._topScore}`, 0, 300, 900, 100);
        }
    }

    _resetGame() {
        this._gameOver = false;

        this._board = new Board(floor(random(N_BOARDS)), 0, 0, 30);
        this._snake = new Snake();
        this._scoreCounter = new Counter(0, 0, 450, 900, 50, 40);

        if (typeof(Storage) !== 'undefined' && localStorage['topScore']) {
            this._topScore = JSON.parse(localStorage['topScore']);
        }
    }

    _endGame() {
        this._gameOver = true;

        this._topScore = (this._scoreCounter.value > this._topScore)? this._scoreCounter.value : this._topScore;
        if (typeof(Storage) !== 'undefined') {
            localStorage['topScore'] = JSON.stringify(this._topScore);
        }
    }
}
