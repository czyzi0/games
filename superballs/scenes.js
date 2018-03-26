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
        this.chosenX = -1;
        this.chosenY = -1;

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
        for(let tile of this.tiles) {
            tile.draw();
        }
    }

    handleClick(clickX, clickY) {
        let indexX = floor(clickX / 100);
        let indexY = floor(clickY / 100);
        
        console.log(indexX + ' ' + indexY)
    }
}
