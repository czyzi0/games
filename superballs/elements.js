class Tile {

    constructor(x, y, size, ballColor, framed=true) {
        this.size = size;
        this.x = x;
        this.y = y;

        this.ballColor = ballColor;
        this.ballSize = 0;
        this.chosen = false;

        this.framed = framed;
    }

    update() {
        if(this.ballSize < 0.7*this.size) {
            this.ballSize = min(0.7*this.size, this.ballSize+0.04*this.size);
            return true;
        } else {
            return false;
        }
    }

    draw() {
        // Draw tile
        stroke(180);
        strokeWeight(4);
        if(this.chosen) {
            fill(180);
        } else {
            fill(230);
        }
        rect(this.x, this.y, this.size, this.size);
        // Draw ball
        if(this.ballColor != Color.NONE) {
            noStroke();
            fill(this.ballColor);
            ellipse(this.x + this.size/2, this.y + this.size/2, this.ballSize, this.ballSize);
        }
    }
}
