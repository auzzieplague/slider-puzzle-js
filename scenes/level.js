class Level extends Phaser.Scene {

    config = {};
    tiles = [];
    frameWidth = 0;
    frameHeight = 0;
    startTileIndex = -1;
    endTileIndex = -1;
    fireworks = null;

    constructor() {
        super('Level');
    }
    preload() {
        // Preload your main image
        let level = gameState.level;
        this.load.image('tiles', `./levels/${level}/tiles.png`);
        this.load.image('level_background', `./levels/${level}/background.png`);
        this.load.json('levelConfig', `./levels/${level}/config.json`);

        this.load.audio('fireworks','./sounds/fireworks.wav');
        this.load.atlas('flares', './atlas/flares.png', './atlas/flares.json'); // todo put in preloader
        this.load.audio('music','./sounds/music1.mp3');
    }

    create() {
        this.sound.play('music', {loop:true, volume:0.66});
        gameState.currentLevel.config = this.cache.json.get('levelConfig');
        this.config =  gameState.currentLevel.config;
        this.setupGrid();
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointerup', this.handlePointerUp, this);
        this.input.on('pointermove', this.handlePointerMove, this);
        this.shuffle();
    }

    handlePointerMove(pointer) {
        let overIndex = this.getTileIndexFromPointer(pointer);
        if (overIndex>-1 && overIndex!==this.startTileIndex){
            this.endTileIndex = overIndex;
            this.swapTiles();
            this.startTileIndex = this.endTileIndex = -1;
        }
    }

    handlePointerDown(pointer) {
        this.startTileIndex = this.getTileIndexFromPointer(pointer);
    }

    handlePointerUp(pointer) {
        this.endTileIndex = this.getTileIndexFromPointer(pointer);
    }

    getTileIndexFromPointer(pointer){
        let grid = this.getCellCoordinatesFromPointer(pointer);
        return grid.y*this.config['gridWidth']+grid.x;
    }

    getCellCoordinatesFromPointer(pointer) {
        const x = pointer.x;
        const y = pointer.y;
        return {
            x: Math.floor(x / this.frameWidth),
            y: Math.floor(y / this.frameHeight)
        };
    }

    swapTiles() {
        // Return early if the condition for swapping is not met
        if (this.startTileIndex===-1 || this.endTileIndex===-1 || !this.isNeighbour(this.startTileIndex, this.endTileIndex)) {
            return;
        }

        let startTile = this.tiles[this.startTileIndex];
        let endTile = this.tiles[this.endTileIndex];

        this.swapTileAnimations(startTile,endTile);


        [this.tiles[this.startTileIndex], this.tiles[this.endTileIndex]] = [endTile, startTile];

        if (this.isPuzzleSolved()){
           this.completeLevel();
        }
    }

    swapTileAnimations(startTile,endTile){
        // Coordinates for swapping
        const startX = startTile.x, startY = startTile.y;
        const endX = endTile.x, endY = endTile.y;

        this.tweens.add({
            targets: [startTile, endTile],
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Linear',
            duration: 50,
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                // Swap positions
                startTile.setPosition(endX, endY);
                endTile.setPosition(startX, startY);
            }
        });
        // Tween for moving the startTile to the endTile's position
        this.tweens.add({
            targets: startTile,
            x: endTile.x,
            y: endTile.y,
            ease: 'Linear',
            duration: 200,
        });
        // Tween for moving the endTile to the startTile's position
        this.tweens.add({
            targets: endTile,
            x: startTile.x,
            y: startTile.y,
            ease: 'Linear',
            duration: 200,
        });
    }

    setupGrid() {
        const gridWidth = this.config['gridWidth']; // Number of columns
        const gridHeight = this.config['gridHeight']; // Number of rows

        const texture = this.textures.get('tiles');
        const frame= texture.frames[texture.firstFrame];
        this.frameWidth = frame.width / gridWidth;
        this.frameHeight = frame.height / gridHeight;
        this.textures.addSpriteSheet('level', texture.getSourceImage(), { frameWidth: this.frameWidth, frameHeight: this.frameHeight });

        console.log(texture,frame);
        this.tiles = [];

        let index = 0;
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                const x = col * this.frameWidth + this.frameWidth / 2;
                const y = row * this.frameHeight + this.frameHeight / 2;
                this.setupTile(index++, x, y);
            }
        }

        console.log('last index is', index);

        this.drawGridLines(gridWidth, gridHeight);
    }


    drawGridLines(cols, rows) {

        if (!this.gridGraphics) {
            this.gridGraphics = this.add.graphics();
        }

        this.gridGraphics.clear(); // Clear previous lines
        this.gridGraphics.lineStyle(2, 0xffffff, 0.8);

        // Draw vertical lines
        for (let col = 1; col < cols; col++) {
            const x = col * this.frameWidth;
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, this.game.config.height);
        }

        // Draw horizontal lines
        for (let row = 1; row < rows; row++) {
            const y = row * this.frameHeight;
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(this.game.config.width, y);
        }

        this.gridGraphics.strokePath();
    }
    setupTile (index,x,y) {
        const tile = this.add.sprite(x, y, 'level', index);
        // tile.setOrigin(0, 0);
        tile.setInteractive();
        tile.name = index;
        this.input.setDraggable(tile);
        this.tiles.push(tile);
    }

    isNeighbour(index1, index2) {
        const gridWidth = this.config['gridWidth']; // Number of columns
        const gridHeight = this.config['gridHeight']; // Number of rows

        // Calculate row and column for each index
        const row1 = Math.floor(index1 / gridWidth); // Row is based on gridWidth
        const col1 = index1 % gridWidth;             // Column is index mod gridWidth
        const row2 = Math.floor(index2 / gridWidth);
        const col2 = index2 % gridWidth;

        // Check if the tiles are horizontal neighbors (same row, adjacent columns)
        const isHorizontalNeighbors = (row1 === row2) && (Math.abs(col1 - col2) === 1);

        // Check if the tiles are vertical neighbors (adjacent rows, same column)
        const isVerticalNeighbors = (Math.abs(row1 - row2) === 1) && (col1 === col2);

        return isHorizontalNeighbors || isVerticalNeighbors;
    }
    shuffle() {
        const shuffleMoves = 100; // Number of shuffle moves

        for (let i = 0; i < shuffleMoves; i++) {
            // Randomly select two different tiles
            let index1 = Phaser.Math.Between(0, this.tiles.length - 1);
            let index2 = index1;
            while (index2 === index1) {
                index2 = Phaser.Math.Between(0, this.tiles.length - 1);
            }

            // Swap positions
            const tile1 = this.tiles[index1];
            const tile2 = this.tiles[index2];

            const tempX = tile1.x;
            const tempY = tile1.y;
            tile1.setPosition(tile2.x, tile2.y);
            tile2.setPosition(tempX, tempY);

            // Swap in array
            [this.tiles[index1], this.tiles[index2]] = [tile2, tile1];
        }
    }

    isPuzzleSolved() {
        for (let i = 0; i < this.tiles.length; i++) {
            // The tile's frame index should match its position in the array
            if (this.tiles[i].name !== i) {
                return false; // If any tile is not in the correct position, the puzzle is not solved
            }
        }
        return true; // All tiles are in the correct positions
    }

    completeLevel() {
        // this.gridGraphics.clear();
        this.sound.play('fireworks');
        this.doFireworks();
        this.time.delayedCall(700, ()=>{ this.doFireworks();}, [], this);
    }

    doFireworks(){
        for (let i = 0; i < 15; i++) {
            // Generate random positions within the game canvas
            let randomX = Phaser.Math.Between(0, this.game.config.width);
            let randomY = Phaser.Math.Between(0, this.game.config.height);

            // Create particle system at random position
            let fireworks = this.add.particles(randomX,randomY,'flares', {
                frame: ['red', 'yellow', 'green'],
                lifespan: 2500,
                speed: { min: 150, max: 250 },
                scale: { start: 0.8, end: 0 },
                gravityY: 150,
                blendMode: 'ADD'
            });

            fireworks.explode('20');
        }
    }
}