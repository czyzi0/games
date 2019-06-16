class GameScene {

    constructor() {
        this.width = 1000;
        this.height = 1100;

        this.nextScene = this;

        this.gameOver;

        this.board;
        this.snake;
        this.fruit;

        this.resetGame();
    }

    update() {
        this.board.update();
        if (!this.gameOver) {
            this.snake.update();
        }
        this.fruit.update();

        return true;
    }

    draw() {
        background(COLOR.BACKGROUND);

        this.board.draw();
        this.snake.draw();
        this.fruit.draw();
    }

    resetGame() {
        this.gameOver = false;

        this.board = new Board(0, 0, 1000);
        this.snake = new Snake(400, 500, 10, 45);
        this.fruit = new Fruit(200, 200, 35);
    }
}
