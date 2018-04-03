class Tile {

    constructor(x, y, size, ballColor, framed=true) {
        this.size = size;
        this.x = x;
        this.y = y;

        this.ballColor = ballColor;
        this.ballSize = 0;
        this.active = false;

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
        if(this.framed) {
            stroke(Color.UI);
            strokeWeight(0.04*this.size);
            if(this.active) {
                fill(Color.UI);
            } else {
                fill(Color.BACKGROUND);
            }
            rect(this.x, this.y, this.size, this.size);
        }
        // Draw ball
        if(this.ballColor !== Color.NONE) {
            noStroke();
            fill(this.ballColor);
            ellipse(this.x + this.size/2, this.y + this.size/2, this.ballSize, this.ballSize);
        }
    }
}
