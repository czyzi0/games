class Tile {

  constructor(ballColor, x, y, size, framed=true) {
    this._size = size;
    this._x = x;
    this._y = y;

    this.active = false;
    this._ballColor = ballColor;
    this._ballSize = 0;

    this._framed = framed;
  }

  update() {
    if (this._ballSize < 0.7 * this._size) {
      this._ballSize = lerp(this._ballSize, 0.7 * this._size, 0.15);
      return true;
    } else {
      return false;
    }
  }

  draw() {
    // Draw tile
    if (this._framed) {
      stroke(COLOR.UI_LIGHT);
      strokeWeight(0.04 * this._size);
      if (this.active) {
        fill(COLOR.UI_LIGHT);
      } else {
        fill(COLOR.BACKGROUND);
      }
      rect(this._x, this._y, this._size, this._size);
    }
    // Draw ball
    if (this._ballColor !== COLOR.NONE) {
      noStroke();
      fill(this._ballColor);
      ellipse(this._x + this._size / 2, this._y + this._size / 2, this._ballSize, this._ballSize);
    }
  }

  get ballColor() {
    return this._ballColor;
  }

  set ballColor(newBallColor) {
    this._ballColor = newBallColor;
    this._ballSize = 0;
  }
}


class Counter {

  constructor(value, x, y, w, h, size, animationDuration=15) {
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
      return true;
    } else if (this._displayedValue > this._value) {
      this._displayedValue = max(this._value, this._displayedValue + this._step);
      return true;
    } else {
      this._step = 0;
      return false;
    }
  }

  draw() {
    noStroke();
    fill(COLOR.UI_DARK);
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
