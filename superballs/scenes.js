class GameScene {

    constructor() {
        this.width = 900;
        this.height = 1000;

        this.nextScene = this;

        this._lost;

        this._tiles;
        this._activeX;
        this._activeY;

        this._nextTiles;

        this._pointsCounter;

        this._resetGame();
    }

    update() {
        let updated = false;
        for(let tile of this._tiles) {
            if(tile.update()) {
                updated = true;
            }
        }
        for(let tile of this._nextTiles) {
            if(tile.update()) {
                updated = true;
            }
        }
        if(this._pointsCounter.update()) {
            updated = true;
        }
        return updated;
    }

    draw() {
        background(Color.BACKGROUND);

        for(let tile of this._tiles) {
            tile.draw();
        }

        for(let tile of this._nextTiles) {
            tile.draw();
        }

        this._pointsCounter.draw();

        if(this._lost) {
            stroke(Color.UI_DARK);
            strokeWeight(4);
            fill(Color.UI_DARK);
            textSize(100);
            textAlign(CENTER, CENTER);
            text('GAME OVER', 0, 0, 900, 1000);
        }
    }

    handleClick(clickX, clickY) {
        if(this._lost) {
            if(clickX < 900 && clickX > 0 && clickY < 1000 && clickY > 0) {
                this._resetGame();
            }
        } else {
            let indexX = floor(clickX / 100);
            let indexY = floor(clickY / 100);

            // Click out of board
            if(indexX < 0 || indexY < 0 || indexX >= 9 || indexY >= 9) {
                return
            }
            // Click on tile with ball
            if(this._tiles[indexY*9 + indexX].ballColor !== Color.NONE) {
                // Click on activated tile
                if(this._activeX === indexX && this._activeY === indexY) {
                    this._deactivateTile();
                }
                // Click on deactivated tile
                else {
                    this._deactivateTile();
                    this._activateTile(indexX, indexY);
                }
            }
            // Click on empty tile when some tile is active
            else if(this._activeX !== -1 && this._activeY !== -1) {
                if(this._existsPath(indexX, indexY)) {
                    this._tiles[indexY*9 + indexX].ballColor = this._tiles[this._activeY*9 + this._activeX].ballColor;
                    this._tiles[this._activeY*9 + this._activeX].ballColor = Color.NONE;
                    this._deactivateTile();

                    let nRemoved = this._removeTiles();
                    if(nRemoved === 0) {
                        this._putNextTiles();
                        this._setNewNextTiles();
                        nRemoved += this._removeTiles();
                        // Check if lost
                        let emptyTiles = this._tiles.filter(tile => tile.ballColor === Color.NONE);
                        if(emptyTiles.length === 0) {
                            this._lost = true;
                        }
                    }
                    // Update points
                    this._pointsCounter.value += max(0, 50 + (nRemoved-5)*20);
                } else {
                    this._deactivateTile();
                }
            }
        }
    }

    _resetGame() {
        this._lost = false;

        this._pointsCounter = new Counter(0, 300, 900, 600, 100, 60);

        this._nextTiles = [];
        for(let i=0; i<3; ++i) {
            this._nextTiles.push(new Tile(Color.NONE, 10 + i*100, 910, 80, false));
        }
        this._setNewNextTiles();

        this._tiles = [];
        for(let indexY=0; indexY<9; ++indexY) {
            for(let indexX=0; indexX<9; ++indexX) {
                this._tiles.push(new Tile(Color.NONE, indexX*100, indexY*100, 100));
            }
        }
        this._activeX = -1;
        this._activeY = -1;
        this._putNextTiles();
        this._setNewNextTiles();
    }

    _setNewNextTiles() {
        for(let i=0; i<3; ++i) {
            let color_ = random([Color.RED, Color.YELLOW, Color.BLUE, Color.GREEN, Color.PURPLE, Color.ORANGE]);
            this._nextTiles[i].ballColor = color_;
        }
    }

    _putNextTiles() {
        for(let nextTile of this._nextTiles) {
            let emptyTiles = this._tiles.filter(tile => tile.ballColor === Color.NONE);
            // Check if lost
            if(emptyTiles.length === 0) {
                this._lost = true;
                break;
            } else {
                random(emptyTiles).ballColor = nextTile.ballColor;
            }
        }
    }

    _removeTiles() {
        let toRemoveTiles = new Array(81).fill(false);
        for(let indexY=0; indexY<9; ++indexY) {
            for(let indexX=0; indexX<9; ++indexX) {
                let currentColor = this._tiles[indexY*9 + indexX].ballColor;
                if(currentColor !== Color.NONE) {
                    // Horizontal check
                    let x = indexX;
                    while(x < 9 && this._tiles[indexY*9 + x].ballColor === currentColor) {
                        ++x;
                    }
                    if(x-indexX >= 5) {
                        while(x > indexX){
                            --x;
                            toRemoveTiles[indexY*9 + x] = true;
                        }
                    }
                    // Vertical check
                    let y = indexY;
                    while(y < 9 && this._tiles[y*9 + indexX].ballColor === currentColor) {
                        ++y;
                    }
                    if(y-indexY >= 5) {
                        while(y > indexY){
                            --y;
                            toRemoveTiles[y*9 + indexX] = true;
                        }
                    }
                    // Diagonal check (\)
                    x = indexX;
                    y = indexY;
                    while(x < 9 && y < 9 && this._tiles[y*9 + x].ballColor === currentColor) {
                        ++x;
                        ++y;
                    }
                    if(x-indexX >= 5 && y-indexY >= 5) {
                        while(x > indexX && y > indexY) {
                            --x;
                            --y;
                            toRemoveTiles[y*9 + x] = true;
                        }
                    }
                    // Diagonal check (/)
                    x = indexX;
                    y = indexY;
                    while(x < 9 && y >= 0 && this._tiles[y*9 + x].ballColor === currentColor) {
                        ++x;
                        --y;
                    }
                    if(x-indexX >= 5 && indexY-y >= 5) {
                        while(x > indexX && y < indexY) {
                            --x;
                            ++y;
                            toRemoveTiles[y*9 + x] = true;
                        }
                    }
                }
            }
        }
        let nRemoved = 0;
        for(let i=0; i<81; ++i) {
            if(toRemoveTiles[i]) {
                this._tiles[i].ballColor = Color.NONE;
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

        visitedTiles[y*9 + x] = true;

        while(bfsQueue.length !== 0 && (x !== indexX || y !== indexY)) {
            x = bfsQueue.shift();
            y = bfsQueue.shift();
            // Up
            if(y > 0 && this._tiles[(y-1)*9 + x].ballColor === Color.NONE && !visitedTiles[(y-1)*9 + x]) {
                visitedTiles[(y-1)*9 + x] = true;
                bfsQueue.push(x);
                bfsQueue.push(y-1);
            }
            // Right
            if(x < 8 && this._tiles[y*9 + x + 1].ballColor === Color.NONE && !visitedTiles[y*9 + x + 1]) {
                visitedTiles[y*9 + x + 1] = true;
                bfsQueue.push(x+1);
                bfsQueue.push(y);
            }
            // Down
            if(y < 8 && this._tiles[(y+1)*9 + x].ballColor === Color.NONE && !visitedTiles[(y+1)*9 + x]) {
                visitedTiles[(y+1)*9 + x] = true;
                bfsQueue.push(x);
                bfsQueue.push(y+1);
            }
            // Left
            if(x > 0 && this._tiles[y*9 + x - 1].ballColor === Color.NONE && !visitedTiles[y*9 + x - 1]) {
                visitedTiles[y*9 + x - 1] = true;
                bfsQueue.push(x-1);
                bfsQueue.push(y);
            }
        }
        return visitedTiles[indexY*9 + indexX];
    }

    _activateTile(indexX, indexY) {
        this._tiles[indexY*9 + indexX].active = true;
        this._activeX = indexX;
        this._activeY = indexY;
    }

    _deactivateTile() {
        if(this._activeX !== -1 && this._activeY !== -1) {
            this._tiles[this._activeY*9 + this._activeX].active = false;
            this._activeX = -1;
            this._activeY = -1;
        }
    }
}
