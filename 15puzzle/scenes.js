class GameScene {

  constructor() {
    this.width = 640;
    this.height = 640;

    this.nextScene = this;

    this.gameOver;

    this.imageIdx;
    this.tiles;
    this.emptyX;
    this.emptyY;

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

    if (this.gameOver) {
      image(IMAGES[this.imageIdx], 0, 0, 640, 640);
      return;
    }

    stroke(COLOR.UI_LIGHT);
    strokeWeight(1);
    fill(COLOR.UI_LIGHT);
    square(0, 0, 640);

    for (let tile of this.tiles) {
      tile.draw();
    }
  }

  handleClick(clickX, clickY) {
    if (this.gameOver) {
      this.resetGame();
      return;
    }

    clickX = floor(clickX / 160);
    clickY = floor(clickY / 160);

    // Click on the outside
    if (clickX < 0 || clickX >= 4 || clickY < 0 || clickY >= 4) {
      return;
    }
    // Click on the empty
    if (clickX == this.emptyX && clickY == this.emptyY) {
      return;
    }

    // Do the move
    for (let tile of this.tiles) {
      if (tile.x == clickX && tile.y == clickY) {
        // Move up
        if (tile.x == this.emptyX && tile.y - 1 == this.emptyY) {
          this.emptyY = tile.y;
          tile.y -= 1;
          break;
        }
        // Move right
        if (tile.x + 1 == this.emptyX && tile.y == this.emptyY) {
          this.emptyX = tile.x;
          tile.x += 1;
          break
        }
        // Move down
        if (tile.x == this.emptyX && tile.y + 1 == this.emptyY) {
          this.emptyY = tile.y;
          tile.y += 1;
          break;
        }
        // Move left
        if (tile.x - 1 == this.emptyX && tile.y == this.emptyY) {
          this.emptyX = tile.x;
          tile.x -= 1;
          break;
        }
      }
    }

    // Check win condition
    this.gameOver = true;
    for (let tile of this.tiles) {
      if (tile.y * 4 + tile.x != tile.value) {
        this.gameOver = false;
        break;
      }
    }
  }

  resetGame() {
    this.gameOver = false;
    this.imageIdx = floor(random(IMAGES.length));

    // Create puzzle by doing some random moves on tile values
    let vals = [];
    let ei = 15;
    for (let i = 0; i < 16; ++i) {
      vals.push(i);
    }
    for (let i = 0; i < 500; ++i) {
      const j = random();
      if (j < 0.25) {
        // Move up
        if (ei - 4 >= 0) {
          vals[ei] = vals[ei - 4];
          ei -= 4;
        }
      } else if (j < 0.5) {
        // Move right
        if (floor(ei / 4) == floor((ei + 1) / 4)) {
          vals[ei] = vals[ei + 1];
          ei += 1;
        }
      } else if (j < 0.75) {
        // Move down
        if (ei + 4 < 16) {
          vals[ei] = vals[ei + 4];
          ei += 4;
        }
      } else {
        // Move left
        if (floor(ei / 4) == floor((ei - 1) / 4)) {
          vals[ei] = vals[ei - 1];
          ei -= 1;
        }
      }
      vals[ei] = 15;
    }

    // Initialize tiles
    this.tiles = [];
    for (let i = 0; i < 16; ++i) {
      if (vals[i] == 15) {
        this.emptyX = i % 4;
        this.emptyY = floor(i / 4);
      } else {
        this.tiles.push(new Tile(this.imageIdx, i % 4, floor(i / 4), vals[i], 160, 4));
      }
    }
  }
}
