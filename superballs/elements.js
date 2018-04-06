class Tile {

    constructor(x, y, size, ballColor, framed=true) {
        this._size = size;
        this._x = x;
        this._y = y;

        this._ballColor = ballColor;
        this._ballSize = 0;
        this.active = false;

        this._framed = framed;
    }

    update() {
        if(this._ballSize < 0.7*this._size) {
            this._ballSize = min(0.7*this._size, this._ballSize+0.05*this._size);
            return true;
        } else {
            return false;
        }
    }

    draw() {
        // Draw tile
        if(this._framed) {
            stroke(Color.UI_LIGHT);
            strokeWeight(0.04*this._size);
            if(this.active) {
                fill(Color.UI_LIGHT);
            } else {
                fill(Color.BACKGROUND);
            }
            rect(this._x, this._y, this._size, this._size);
        }
        // Draw ball
        if(this._ballColor !== Color.NONE) {
            noStroke();
            fill(this._ballColor);
            ellipse(this._x + this._size/2, this._y + this._size/2, this._ballSize, this._ballSize);
        }
    }

    get ballColor() {
        return this._ballColor;
    }

    set ballColor(newBallColor) {
        this._ballSize = 0;
        this._ballColor = newBallColor;
    }
}


class Counter {

    constructor(x, y, w, h, size, value) {
        this._size = size;
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this._value = value;

        this._displayedValue = value;
        this._step = 0;
    }

    update() {
        if(this._displayedValue != this._value) {
            this._displayedValue = min(this._value, this._displayedValue + this._step);
            return true;
        } else {
            this._step = 0;
            return false;
        }
    }

    draw() {
        noStroke();
        fill(Color.UI_DARK);
        textSize(this._size);
        textAlign(RIGHT);
        text(int(this._displayedValue), this._x, this._y, this._w, this._h);
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
        this._step = (this._value - this._displayedValue) / 15;
    }
}
