class GameScene {

  constructor() {
    this.width = 900;
    this.height = 1000;

    this.nextScene = this;

    this.gameOver;

    this.tiles;
    this.activeX;
    this.activeY;

    this.nextTiles;

    this.scoreCounter;
    this.topScore = 0;

    this.resetGame();
  }

  update() {
    let updated = false;
    for (let tile of this.tiles) {
      if(tile.update()) {
        updated = true;
      }
    }
    for (let tile of this.nextTiles) {
      if(tile.update()) {
        updated = true;
      }
    }
    if (this.scoreCounter.update()) {
      updated = true;
    }
    return updated;
  }

  draw() {
    background(COLOR.BACKGROUND);

    for (let tile of this.tiles) {
      tile.draw();
    }

    for (let tile of this.nextTiles) {
      tile.draw();
    }

    this.scoreCounter.draw();

    if (this.gameOver) {
      noStroke();
      fill(COLOR.UI_DARK);
      textAlign(CENTER, CENTER);

      textSize(100);
      text('GAME OVER', 0, 0, 900, 600);

      textSize(50);
      text(`TOP SCORE: ${this.topScore}`, 0, 600, 900, 200);
    }
  }

  handleClick(clickX, clickY) {
    if (this.gameOver) {
      if (clickX < 900 && clickX > 0 && clickY < 1000 && clickY > 0) {
        this.resetGame();
      }
    } else {
      let indexX = floor(clickX / 100);
      let indexY = floor(clickY / 100);

      // Click out of board
      if (indexX < 0 || indexY < 0 || indexX >= 9 || indexY >= 9) {
        return
      }
      // Click on tile with ball
      if (this.tiles[indexY * 9 + indexX].ballColor !== COLOR.NONE) {
        // Click on activated tile
        if (this.activeX === indexX && this.activeY === indexY) {
          this.deactivateTile();
        }
        // Click on deactivated tile
        else {
          this.deactivateTile();
          this.activateTile(indexX, indexY);
        }
      }
      // Click on empty tile when some tile is active
      else if (this.activeX !== -1 && this.activeY !== -1) {
        if (this.existsPath(indexX, indexY)) {
          this.tiles[indexY * 9 + indexX].ballColor =
            this.tiles[this.activeY * 9 + this.activeX].ballColor;
          this.tiles[this.activeY * 9 + this.activeX].ballColor = COLOR.NONE;
          this.deactivateTile();

          let nRemoved = this.removeTiles();
          if (nRemoved === 0) {
            this.putNextTiles();
            this.setNewNextTiles();
            nRemoved += this.removeTiles();
            // Check if lost
            let emptyTiles = this.tiles.filter(tile => tile.ballColor === COLOR.NONE);
            if (emptyTiles.length === 0) {
              this.endGame();
            }
          }
          // Update score
          this.scoreCounter.value += max(0, 50 + (nRemoved - 5) * 20);
        } else {
          this.deactivateTile();
        }
      }
    }
  }

  resetGame() {
    this.gameOver = false;

    this.scoreCounter = new Counter(0, 300, 900, 600, 100, 60);

    this.nextTiles = [];
    for (let i = 0; i < 3; ++i) {
      this.nextTiles.push(new Tile(COLOR.NONE, 10 + i * 100, 910, 80, false));
    }
    this.setNewNextTiles();

    this.tiles = [];
    for (let indexY = 0; indexY < 9; ++indexY) {
      for (let indexX = 0; indexX < 9; ++indexX) {
        this.tiles.push(new Tile(COLOR.NONE, indexX * 100, indexY * 100, 100));
      }
    }
    this.activeX = -1;
    this.activeY = -1;
    this.putNextTiles();
    this.setNewNextTiles();

    if (typeof(Storage) !== 'undefined' && localStorage['superballs.topScore']) {
      this.topScore = JSON.parse(localStorage['superballs.topScore']);
    }
  }

  endGame() {
    this.gameOver = true;

    this.topScore = (this.scoreCounter.value > this.topScore) ? this.scoreCounter.value : this.topScore;
    if (typeof(Storage) !== 'undefined') {
      localStorage['superballs.topScore'] = JSON.stringify(this.topScore);
    }
  }

  setNewNextTiles() {
    for (let i = 0; i < 3; ++i) {
      let color_ = random([COLOR.RED, COLOR.YELLOW, COLOR.BLUE, COLOR.GREEN, COLOR.PURPLE, COLOR.ORANGE]);
      this.nextTiles[i].ballColor = color_;
    }
  }

  putNextTiles() {
    for (let nextTile of this.nextTiles) {
      let emptyTiles = this.tiles.filter(tile => tile.ballColor === COLOR.NONE);
      // Check if lost
      if (emptyTiles.length === 0) {
        this.endGame();
        break;
      } else {
        random(emptyTiles).ballColor = nextTile.ballColor;
      }
    }
  }

  removeTiles() {
    let toRemoveTiles = new Array(81).fill(false);
    for (let indexY = 0; indexY < 9; ++indexY) {
      for (let indexX = 0; indexX < 9; ++indexX) {
        let currentColor = this.tiles[indexY * 9 + indexX].ballColor;
        if (currentColor !== COLOR.NONE) {
          // Horizontal check
          let x = indexX;
          while (x < 9 && this.tiles[indexY*9 + x].ballColor === currentColor) {
            ++x;
          }
          if (x - indexX >= 5) {
            while (x > indexX){
              --x;
              toRemoveTiles[indexY * 9 + x] = true;
            }
          }
          // Vertical check
          let y = indexY;
          while (y < 9 && this.tiles[y * 9 + indexX].ballColor === currentColor) {
            ++y;
          }
          if (y - indexY >= 5) {
            while (y > indexY){
              --y;
              toRemoveTiles[y * 9 + indexX] = true;
            }
          }
          // Diagonal check (\)
          x = indexX;
          y = indexY;
          while (x < 9 && y < 9 && this.tiles[y * 9 + x].ballColor === currentColor) {
            ++x;
            ++y;
          }
          if (x - indexX >= 5 && y - indexY >= 5) {
            while (x > indexX && y > indexY) {
              --x;
              --y;
              toRemoveTiles[y * 9 + x] = true;
            }
          }
          // Diagonal check (/)
          x = indexX;
          y = indexY;
          while (x < 9 && y >= 0 && this.tiles[y * 9 + x].ballColor === currentColor) {
            ++x;
            --y;
          }
          if (x - indexX >= 5 && indexY - y >= 5) {
            while (x > indexX && y < indexY) {
              --x;
              ++y;
              toRemoveTiles[y * 9 + x] = true;
            }
          }
        }
      }
    }
    let nRemoved = 0;
    for (let i = 0; i < 81; ++i) {
      if (toRemoveTiles[i]) {
        this.tiles[i].ballColor = COLOR.NONE;
        ++nRemoved;
      }
    }
    return nRemoved;
  }

  existsPath(indexX, indexY) {
    let visitedTiles = new Array(81).fill(false);
    let x = this.activeX;
    let y = this.activeY;
    let bfsQueue = [x, y];

    visitedTiles[y * 9 + x] = true;

    while (bfsQueue.length !== 0 && (x !== indexX || y !== indexY)) {
      x = bfsQueue.shift();
      y = bfsQueue.shift();
      // Up
      if(y > 0 && this.tiles[(y - 1) * 9 + x].ballColor === COLOR.NONE && !visitedTiles[(y - 1) * 9 + x]) {
        visitedTiles[(y - 1) * 9 + x] = true;
        bfsQueue.push(x);
        bfsQueue.push(y - 1);
      }
      // Right
      if(x < 8 && this.tiles[y * 9 + x + 1].ballColor === COLOR.NONE && !visitedTiles[y * 9 + x + 1]) {
        visitedTiles[y * 9 + x + 1] = true;
        bfsQueue.push(x + 1);
        bfsQueue.push(y);
      }
      // Down
      if(y < 8 && this.tiles[(y + 1) * 9 + x].ballColor === COLOR.NONE && !visitedTiles[(y + 1) * 9 + x]) {
        visitedTiles[(y + 1) * 9 + x] = true;
        bfsQueue.push(x);
        bfsQueue.push(y + 1);
      }
      // Left
      if(x > 0 && this.tiles[y * 9 + x - 1].ballColor === COLOR.NONE && !visitedTiles[y * 9 + x - 1]) {
        visitedTiles[y * 9 + x - 1] = true;
        bfsQueue.push(x - 1);
        bfsQueue.push(y);
      }
    }
    return visitedTiles[indexY * 9 + indexX];
  }

  activateTile(indexX, indexY) {
    this.tiles[indexY * 9 + indexX].active = true;
    this.activeX = indexX;
    this.activeY = indexY;
  }

  deactivateTile() {
    if(this.activeX !== -1 && this.activeY !== -1) {
      this.tiles[this.activeY * 9 + this.activeX].active = false;
      this.activeX = -1;
      this.activeY = -1;
    }
  }
}
