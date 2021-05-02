class GameScene {

  constructor() {
    this.width = 640;
    this.height = 640;

    this.nextScene = this;

    this.gameOver;

    this.imageIdx;
    this.tiles;

    this.resetGame();
  }

  update() {
    let updated = false;
    for (let tile of this.tiles) {
      if (tile.update()) {
        updated = true;
      }
    }
    return updated;
  }

  draw() {
    background(COLOR.BACKGROUND)

    stroke(COLOR.UI_LIGHT);
    strokeWeight(1);
    fill(COLOR.UI_LIGHT);
    square(0, 0, 640);

    for (let tile of this.tiles) {
      tile.draw();
    }
  }

  handleClick(clickX, clickY) {
    console.log(clickX, clickY);
  }

  resetGame() {
    this.gameOver = false;

    this.imageIdx = floor(random(IMAGES.length));

    this.tiles = [];
    for (let i = 0; i < 15; ++i) {
      this.tiles.push(new Tile(this.imageIdx, i % 4, floor(i / 4), i + 1, 160));
    }

    // TODO: Mix the tiles
  }
}
