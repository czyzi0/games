class Tile {

    constructor(ballColor, x, y, size, framed=true) {
        this.size = size;
        this.x = x;
        this.y = y;

        this.active = false;
        this.ballColor_ = ballColor;
        this.ballSize = 0;

        this.framed = framed;
    }

    update() {
        if (this.ballSize < 0.7 * this.size) {
            this.ballSize = lerp(this.ballSize, 0.7 * this.size, 0.15);
            return true;
        } else {
            return false;
        }
    }

    draw() {
        // Draw tile
        if (this.framed) {
            stroke(COLOR.UI_LIGHT);
            strokeWeight(0.04 * this.size);
            if (this.active) {
                fill(COLOR.UI_LIGHT);
            } else {
                fill(COLOR.BACKGROUND);
            }
            rect(this.x, this.y, this.size, this.size);
        }
        // Draw ball
        if (this.ballColor_ !== COLOR.NONE) {
            noStroke();
            fill(this.ballColor_);
            ellipse(this.x + this.size / 2, this.y + this.size / 2, this.ballSize, this.ballSize);
        }
    }

    get ballColor() {
        return this.ballColor_;
    }

    set ballColor(newBallColor) {
        this.ballColor_ = newBallColor;
        this.ballSize = 0;
    }
}


class Counter {

    constructor(value, x, y, w, h, size) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.value_ = value;
        this.valueDisplayed = value;
        this.step = 0;
    }

    update() {
        if (this.valueDisplayed < this.value_) {
            this.valueDisplayed = min(this.value_, this.valueDisplayed + this.step);
            return true;
        } else if (this.valueDisplayed > this.value_) {
            this.valueDisplayed = max(this.value_, this.valueDisplayed + this.step);
            return true;
        } else {
            this.step = 0;
            return false;
        }
    }

    draw() {
        stroke(COLOR.UI_DARK);
        strokeWeight(2);
        fill(COLOR.UI_DARK);
        textSize(this.size);
        textAlign(RIGHT, CENTER);
        text(int(this.valueDisplayed), this.x, this.y, this.w, this.h);
    }

    get value() {
        return this.value_;
    }

    set value(newValue) {
        this.value_ = newValue;
        this.step = (this.value_ - this.valueDisplayed) / 15;
    }
}
