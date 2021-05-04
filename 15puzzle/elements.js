class Tile {

  constructor(imageIdx, x, y, val, size, n) {
    this._size = size;
    this._n = n;

    this._x = x;
    this._y = y;

    this._X = (n - 1) / 2;
    this._Y = (n - 1) / 2;

    this._imageIdx = imageIdx;
    this._val = val;
  }

  update() {
    let updated = false;
    if (this._X != this._x) {
      if (abs(this._x - this._X) < 0.01) {
        this._X = this._x;
      } else {
        this._X = lerp(this._X, this._x, 0.3);
      }
      updated = true;
    }
    if (this._Y != this._y) {
      if (abs(this._y - this._Y) < 0.01) {
        this._Y = this._y;
      } else {
        this._Y = lerp(this._Y, this._y, 0.3);
      }
      updated = true;
    }
    return updated;
  }

  draw() {
    let imX = (this._val % this._n) * this._size;
    let imY = floor(this._val / this._n) * this._size;
    let x = this._X * this._size;
    let y = this._Y * this._size;

    image(
        IMAGES[this._imageIdx],
        x, y, this._size, this._size,
        imX, imY, this._size, this._size);
    stroke(COLOR.UI_DARK);
    strokeWeight(1);
    noFill();
    square(x, y, this._size);

    noStroke();
    fill(COLOR.UI_DARK);
    textAlign(CENTER, CENTER);
    textSize(30);
    text(`${this._val + 1}`, x, y, this._size, this._size);
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._x = newX;
  }

  get y() {
    return this._y;
  }

  set y(newY) {
    this._y = newY;
  }

  get value() {
    return this._val;
  }
}
