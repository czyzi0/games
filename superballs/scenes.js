class GameScene {

    constructor() {
        this.width = 900;
        this.height = 1000;

        this._tiles = [];
        for(let indexY=0; indexY<9; ++indexY) {
            for(let indexX=0; indexX<9; ++indexX) {
                this._tiles.push(new Tile(indexX*100, indexY*100, 100, Color.NONE));
            }
        }
        this._activeX = -1;
        this._activeY = -1;

        this._pointsCounter = new Counter(450, 920, 440, 60, 60, 0);

        this.nextScene = this

        this._tiles[0].ballColor = Color.RED;
    }

    update() {
        let updated = false;
        for(let tile of this._tiles) {
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

        this._pointsCounter.draw();
    }

    handleClick(clickX, clickY) {
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
            }
            else {
                this._deactivateTile();
            }
        }
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

    _existsPath(indexX, indexY) {
        // TODO: Implement bfs to find if path exists
        return true;
    }
}
