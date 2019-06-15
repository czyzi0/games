class Board {

    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
    }

    update() {}

    draw() {
        noStroke();
        fill(COLOR.BOARD);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}


class Snake {

    constructor(x, y, segments, size) {

        this.Segment = class {

            constructor(x, y, length, angle) {
                this.dir = p5.Vector.fromAngle(angle).setMag(length);
                this.pos = createVector(x, y);
            }

            update(target) {
                this.dir = p5.Vector.sub(target, this.pos).setMag(this.dir.mag());
                this.pos = p5.Vector.sub(target, this.dir);
            }

            draw() {
                stroke(0);
                strokeWeight(4);
                let v = p5.Vector.add(this.pos, this.dir)
                line(this.pos.x, this.pos.y, v.x, v.y);
        
                strokeWeight(16);
                point(this.pos.x, this.pos.y);
            }
        }

        this.Head = class extends this.Segment {
        
            update() {
                this.pos.add(this.dir.copy().setMag(8));
            }

            rotate(angle) {
                this.dir.rotate(angle);
            }
        }

        this.head = new this.Head(x, y, size, 0);
        this.body = new Array(segments).fill().map(() => new this.Segment(0, y, size, 0));
    }

    update() {
        if (keyIsDown(RIGHT_ARROW)) {
            this.head.rotate(0.08);
        } else if (keyIsDown(LEFT_ARROW)) {
            this.head.rotate(-0.08);
        }

        this.head.update();
        let prev = this.head;
        for (let seg of this.body) {
            seg.update(prev.pos);
            prev = seg;
        }
    }

    draw() {
        this.head.draw();
        for (let seg of this.body) {
            seg.draw();
        }
    }
}


class Fruit {

    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
        this.type = random(Object.keys(IMAGE.FRUIT));

        this.sizeDisplayed = 0;
        this.sizeTarget = 1.2 * this.size;
    }

    update() {
        if (this.sizeTarget > this.size && this.sizeDisplayed > this.sizeTarget - 1) {
            this.sizeTarget = 0.8 * this.size;
        } else if (this.sizeTarget < this.size && this.sizeDisplayed < this.sizeTarget + 1) {
            this.sizeTarget = 1.2 * this.size;
        }

        this.sizeDisplayed = lerp(this.sizeDisplayed, this.sizeTarget, 0.15);
        return true;
    }

    draw() {
        imageMode(CENTER);
        image(
            IMAGE.FRUIT[this.type], this.pos.x, this.pos.y, this.sizeDisplayed, this.sizeDisplayed);
    }
}
