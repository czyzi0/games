class GameScene {

    constructor() {
        this.width = 900;
        this.height = 1000;

        this.tiles = [];
        for(let indexY=0; indexY<9; ++indexY) {
            for(let indexX=0; indexX<9; ++indexX) {
                this.tiles.push(new Tile(indexX*100, indexY*100, 100, Color.ORANGE));
            }
        }
        this.activeX = -1;
        this.activeY = -1;

        this.nextScene = this

        this.points = 0;
    }

    update() {
        let updated = false;
        for(let tile of this.tiles) {
            if(tile.update()) {
                updated = true;
            }
        }
        return updated;
    }

    draw() {
        background(Color.BACKGROUND);

        for(let tile of this.tiles) {
            tile.draw();
        }
    }

    handleClick(clickX, clickY) {
        let indexX = floor(clickX / 100);
        let indexY = floor(clickY / 100);

        // Click out of board
        if(indexX < 0 || indexY < 0 || indexX >= 9 || indexY >= 9) {
            return
        }
        // Click on tile with ball
        if(this.tiles[indexY*9 + indexX].ballColor !== Color.NONE) {
            // Click on activated tile
            if(this.activeX === indexX && this.activeY === indexY) {
                this.deactivateTile();
            }
            // Click on deactivated tile
            else {
                this.deactivateTile();
                this.activateTile(indexX, indexY);
            }
        }
        // Click on empty tile
        else if(this.activeX !== -1 && this.activeY !== -1) {
            
        }
    }

    activateTile(indexX, indexY) {
        this.tiles[indexY*9 + indexX].active = true;
        this.activeX = indexX;
        this.activeY = indexY;
    }

    deactivateTile() {
        if(this.activeX !== -1 && this.activeY !== -1) {
            this.tiles[this.activeY*9 + this.activeX].active = false;
            this.activeX = -1;
            this.activeY = -1;
        }
    }
}
