class GameScene {

    constructor() {
        this.width = 900;
        this.height = 1000;

        this.nextScene = this;

        this._gameOver;

        this._tiles;
        this._activeX;
        this._activeY;

        this._nextTiles;

        this._scoreCounter;
        this._topScore = 0;

        this._resetGame();
    }

    update() {
        let updated = false;
        for (let tile of this._tiles) {
            if(tile.update()) {
                updated = true;
            }
        }
        for (let tile of this._nextTiles) {
            if(tile.update()) {
                updated = true;
            }
        }
        if (this._scoreCounter.update()) {
            updated = true;
        }
        return updated;
    }

    draw() {
        background(COLOR.BACKGROUND);

        for (let tile of this._tiles) {
            tile.draw();
        }

        for (let tile of this._nextTiles) {
            tile.draw();
        }

        this._scoreCounter.draw();

        if (this._gameOver) {
            stroke(COLOR.UI_DARK);
            fill(COLOR.UI_DARK);
            textAlign(CENTER, CENTER);
            strokeWeight(4);

            textSize(100);
            text('GAME OVER', 0, 0, 900, 600);

            textSize(50);
            text(`TOP SCORE: ${this._topScore}`, 0, 600, 900, 200);
        }
    }

    handleClick(clickX, clickY) {
        if (this._gameOver) {
            if (clickX < 900 && clickX > 0 && clickY < 1000 && clickY > 0) {
                this._resetGame();
            }
        } else {
            let indexX = floor(clickX / 100);
            let indexY = floor(clickY / 100);

            // Click out of board
            if (indexX < 0 || indexY < 0 || indexX >= 9 || indexY >= 9) {
                return
            }
            // Click on tile with ball
            if (this._tiles[indexY * 9 + indexX].ballColor !== COLOR.NONE) {
                // Click on activated tile
                if (this._activeX === indexX && this._activeY === indexY) {
                    this._deactivateTile();
                }
                // Click on deactivated tile
                else {
                    this._deactivateTile();
                    this._activateTile(indexX, indexY);
                }
            }
            // Click on empty tile when some tile is active
            else if (this._activeX !== -1 && this._activeY !== -1) {
                if (this._existsPath(indexX, indexY)) {
                    this._tiles[indexY * 9 + indexX].ballColor =
                        this._tiles[this._activeY * 9 + this._activeX].ballColor;
                    this._tiles[this._activeY * 9 + this._activeX].ballColor = COLOR.NONE;
                    this._deactivateTile();

                    let nRemoved = this._removeTiles();
                    if (nRemoved === 0) {
                        this._putNextTiles();
                        this._setNewNextTiles();
                        nRemoved += this._removeTiles();
                        // Check if lost
                        let emptyTiles = this._tiles.filter(tile => tile.ballColor === COLOR.NONE);
                        if (emptyTiles.length === 0) {
                            this._endGame();
                        }
                    }
                    // Update score
                    this._scoreCounter.value += max(0, 50 + (nRemoved - 5) * 20);
                } else {
                    this._deactivateTile();
                }
            }
        }
    }

    _resetGame() {
        this._gameOver = false;

        this._scoreCounter = new Counter(0, 300, 900, 600, 100, 60);

        this._nextTiles = [];
        for (let i = 0; i < 3; ++i) {
            this._nextTiles.push(new Tile(COLOR.NONE, 10 + i * 100, 910, 80, false));
        }
        this._setNewNextTiles();

        this._tiles = [];
        for (let indexY = 0; indexY < 9; ++indexY) {
            for (let indexX = 0; indexX < 9; ++indexX) {
                this._tiles.push(new Tile(COLOR.NONE, indexX * 100, indexY * 100, 100));
            }
        }
        this._activeX = -1;
        this._activeY = -1;
        this._putNextTiles();
        this._setNewNextTiles();

        if (typeof(Storage) !== 'undefined' && localStorage['superballs.topScore']) {
            this._topScore = JSON.parse(localStorage['superballs.topScore']);
        }
    }

    _endGame() {
        this._gameOver = true;

        this._topScore = (this._scoreCounter.value > this._topScore)? this._scoreCounter.value : this._topScore;
        if (typeof(Storage) !== 'undefined') {
            localStorage['superballs.topScore'] = JSON.stringify(this._topScore);
        }
    }

    _setNewNextTiles() {
        for (let i = 0; i < 3; ++i) {
            let color_ = random([COLOR.RED, COLOR.YELLOW, COLOR.BLUE, COLOR.GREEN, COLOR.PURPLE, COLOR.ORANGE]);
            this._nextTiles[i].ballColor = color_;
        }
    }

    _putNextTiles() {
        for (let nextTile of this._nextTiles) {
            let emptyTiles = this._tiles.filter(tile => tile.ballColor === COLOR.NONE);
            // Check if lost
            if (emptyTiles.length === 0) {
                this._endGame();
                break;
            } else {
                random(emptyTiles).ballColor = nextTile.ballColor;
            }
        }
    }

    _removeTiles() {
        let toRemoveTiles = new Array(81).fill(false);
        for (let indexY = 0; indexY < 9; ++indexY) {
            for (let indexX = 0; indexX < 9; ++indexX) {
                let currentColor = this._tiles[indexY * 9 + indexX].ballColor;
                if (currentColor !== COLOR.NONE) {
                    // Horizontal check
                    let x = indexX;
                    while (x < 9 && this._tiles[indexY*9 + x].ballColor === currentColor) {
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
                    while (y < 9 && this._tiles[y * 9 + indexX].ballColor === currentColor) {
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
                    while (x < 9 && y < 9 && this._tiles[y * 9 + x].ballColor === currentColor) {
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
                    while (x < 9 && y >= 0 && this._tiles[y * 9 + x].ballColor === currentColor) {
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
                this._tiles[i].ballColor = COLOR.NONE;
                ++nRemoved;
            }
        }
        return nRemoved;
    }

    _existsPath(indexX, indexY) {
        let visitedTiles = new Array(81).fill(false);
        let x = this._activeX;
        let y = this._activeY;
        let bfsQueue = [x, y];

        visitedTiles[y * 9 + x] = true;

        while (bfsQueue.length !== 0 && (x !== indexX || y !== indexY)) {
            x = bfsQueue.shift();
            y = bfsQueue.shift();
            // Up
            if(y > 0 && this._tiles[(y - 1) * 9 + x].ballColor === COLOR.NONE && !visitedTiles[(y - 1) * 9 + x]) {
                visitedTiles[(y - 1) * 9 + x] = true;
                bfsQueue.push(x);
                bfsQueue.push(y - 1);
            }
            // Right
            if(x < 8 && this._tiles[y * 9 + x + 1].ballColor === COLOR.NONE && !visitedTiles[y * 9 + x + 1]) {
                visitedTiles[y * 9 + x + 1] = true;
                bfsQueue.push(x + 1);
                bfsQueue.push(y);
            }
            // Down
            if(y < 8 && this._tiles[(y + 1) * 9 + x].ballColor === COLOR.NONE && !visitedTiles[(y + 1) * 9 + x]) {
                visitedTiles[(y + 1) * 9 + x] = true;
                bfsQueue.push(x);
                bfsQueue.push(y + 1);
            }
            // Left
            if(x > 0 && this._tiles[y * 9 + x - 1].ballColor === COLOR.NONE && !visitedTiles[y * 9 + x - 1]) {
                visitedTiles[y * 9 + x - 1] = true;
                bfsQueue.push(x - 1);
                bfsQueue.push(y);
            }
        }
        return visitedTiles[indexY * 9 + indexX];
    }

    _activateTile(indexX, indexY) {
        this._tiles[indexY * 9 + indexX].active = true;
        this._activeX = indexX;
        this._activeY = indexY;
    }

    _deactivateTile() {
        if(this._activeX !== -1 && this._activeY !== -1) {
            this._tiles[this._activeY * 9 + this._activeX].active = false;
            this._activeX = -1;
            this._activeY = -1;
        }
    }
}
