class Tile {

  constructor(imageIdx, x, y, val, size) {
    this._size = size;
    this._x = x;
    this._y = y;

    this._imageIdx = imageIdx;
    this._val = val;
  }

  update() {
    return true;
  }

  draw() {
    let x = this._x * this._size;
    let y = this._y * this._size;

    image(
        IMAGES[this._imageIdx],
        x, y, this._size, this._size,
        x, y, this._size, this._size);
    stroke(COLOR.UI_DARK);
    strokeWeight(1);
    noFill();
    square(x, y, this._size);

    noStroke();
    fill(COLOR.UI_DARK);
    textAlign(CENTER, CENTER);
    textSize(30);
    text(`${this._val}`, x, y, this._size, this._size);
  }
}
