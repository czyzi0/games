class Board {

  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size;
  }

  update() {}

  draw() {
    noStroke();
    fill(COLOR.GRASS);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}


class Snake {

  constructor(x, y, segments, size) {

    this.Segment = class {

      constructor(x, y, size, angle) {
        this.dir = p5.Vector.fromAngle(angle).setMag(size / 4);
        this.pos = createVector(x, y);

        this.size = size;

        this.img = createGraphics(this.size, this.size);
        this.img.noStroke();
        let color_ = COLOR.SNAKE_DARK;
        for (let d = this.size; d > 0; --d) {
          this.img.fill(color_);
          this.img.ellipse(this.size / 2, this.size / 2, d);
          color_ = lerpColor(color_, COLOR.SNAKE_LIGHT, 0.08);
        }
      }

      update(target) {
        this.dir = p5.Vector.sub(target, this.pos).setMag(this.dir.mag());
        this.pos = p5.Vector.sub(target, this.dir);
      }

      draw() {
        image(this.img, this.pos.x, this.pos.y);
      }

      get angle() {
        return this.dir.heading();
      }
    }

    this.Head = class extends this.Segment {

      update() {
        this.pos.add(this.dir.copy().setMag(8));
      }

      draw() {
        super.draw();
        let v = this.dir.copy().rotate(PI/2);
        let x = this.pos.x + this.dir.x;
        let y = this.pos.y + this.dir.y;
        // Right eye
        fill(COLOR.SNAKE_EYE_OUT);
        ellipse(x + v.x, y + v.y, this.size / 3);
        fill(COLOR.SNAKE_EYE_IN);
        ellipse(x + v.x, y + v.y, this.size / 5);
        // Left eye
        fill(COLOR.SNAKE_EYE_OUT);
        ellipse(x - v.x, y - v.y, this.size / 3);
        fill(COLOR.SNAKE_EYE_IN);
        ellipse(x - v.x, y - v.y, this.size / 5);
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
      this.head.rotate(0.13);
    } else if (keyIsDown(LEFT_ARROW)) {
      this.head.rotate(-0.13);
    }

    this.head.update();
    let prev = this.head;
    for (let seg of this.body) {
      seg.update(prev.pos);
      prev = seg;
    }
  }

  draw() {
    for (let i = this.body.length - 1; i >= 0; --i) {
      this.body[i].draw();
    }
    this.head.draw();
  }

  get headX() {
    return this.head.pos.x;
  }

  get headY() {
    return this.head.pos.y;
  }

  get length() {
    return this.body.length;
  }

  grow() {
    let last = this.body[this.body.length - 1];
    this.body.push(new this.Segment(last.x, last.y, last.size, last.angle));
    this.body.push(new this.Segment(last.x, last.y, last.size, last.angle));
  }

  checkBitten() {
    for (let i = 5; i < this.body.length; i += 2) {
      if (
          dist(this.body[i].pos.x, this.body[i].pos.y, this.head.pos.x, this.head.pos.y)
          < 0.75 * this.head.size) {
        return true;
      }
    }
    return false;
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
    image(IMAGE.FRUIT[this.type], this.pos.x, this.pos.y, this.sizeDisplayed, this.sizeDisplayed);
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
