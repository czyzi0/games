class GameScene {

    constructor() {
        this.width = 500;
        this.height = 500;

        this.nextScene = this;

        this._gameOver;

        this._scoreCounter;
        this._topScore = 0;

        this._resetGame();
    }

    update() {
        let updated = false;
        return updated;
    }

    draw() {
        background(55);
    }

    handleClick(clickX, clickY) {

    }

    _resetGame() {
        this._gameOver = false;
    }
}
