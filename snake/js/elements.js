class Board {

    constructor(boardNumber, x, y, tileSize) {
        this._x = x;
        this._y = y;

        this._tileSize = tileSize;

        this._board = BOARDS[boardNumber];

        this._w = this._board[0].length;
        this._h = this._board.length;
    }

    update() {}

    draw() {
        noStroke();
        fill(200);
        rect(this._x, this._y, this._w * this._tileSize, this._h * this._tileSize);

        fill(150,25,14);
        for (let y = 0; y < this._h; ++y) {
            for (let x = 0; x < this._w; ++x) {
                if (this._board[y][x]) {
                    rect(this._x + x * this._tileSize, this._y + y * this._tileSize, this._tileSize, this._tileSize);
                }
            }
        }
    }
}


class Snake {

    constructor() {

    }

    update(board) {
        return true;
    }

    draw() {

    }
}


class Counter {

    constructor(value, x, y, w, h, size, animationDuration=30) {
        this._size = size;
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this._value = value;
        this._displayedValue = value;
        this._step = 0;

        this._animationDuration = animationDuration;
    }

    update() {
        if (this._displayedValue < this._value) {
            this._displayedValue = min(this._value, this._displayedValue + this._step);
        } else if (this._displayedValue > this._value) {
            this._displayedValue = max(this._value, this._displayedValue + this._step);
        } else {
            this._step = 0;
        }
    }

    draw() {
        stroke(81);
        strokeWeight(2);
        fill(81);
        textSize(this._size);
        textAlign(RIGHT, CENTER);
        text(int(this._displayedValue), this._x, this._y, this._w, this._h);
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
        this._step = (this._value - this._displayedValue) / this._animationDuration;
    }
}
